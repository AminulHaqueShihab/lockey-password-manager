import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { IUser } from '@/models/User';

// Master password configuration
const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH;
const MASTER_PASSWORD_SALT = process.env.MASTER_PASSWORD_SALT || 'default-salt';

const JWT_SECRET =
	process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

/**
 * Hash a password using SHA-256 with salt
 * @param password - The password to hash
 * @param salt - The salt to use (optional, uses default if not provided)
 * @returns Hashed password
 */
export function hashPassword(password: string, salt?: string): string {
	const saltToUse = salt || MASTER_PASSWORD_SALT;
	return CryptoJS.SHA256(password + saltToUse).toString();
}

/**
 * Verify a password against a hash
 * @param password - The password to verify
 * @param hash - The hash to compare against
 * @param salt - The salt used (optional)
 * @returns True if password matches
 */
export function verifyPassword(
	password: string,
	hash: string,
	salt?: string
): boolean {
	const passwordHash = hashPassword(password, salt);
	return passwordHash === hash;
}

/**
 * Get the expected master password hash
 * @returns The master password hash from environment or null
 */
export function getMasterPasswordHash(): string | null {
	return MASTER_PASSWORD_HASH || null;
}

/**
 * Check if master password is configured
 * @returns True if master password is set up
 */
export function isMasterPasswordConfigured(): boolean {
	return !!MASTER_PASSWORD_HASH;
}

/**
 * Validate master password
 * @param password - The password to validate
 * @returns True if password is correct
 */
export function validateMasterPassword(password: string): boolean {
	const expectedHash = getMasterPasswordHash();

	if (!expectedHash) {
		// Check localStorage for demo mode
		const localHash = localStorage.getItem('masterPasswordHash');
		const localSalt = localStorage.getItem('masterPasswordSalt');

		if (localHash && localSalt) {
			return verifyPassword(password, localHash, localSalt);
		}

		// If no master password is configured anywhere, accept any password (demo mode)
		return password.trim().length > 0;
	}

	return verifyPassword(password, expectedHash);
}

/**
 * Generate a secure salt
 * @returns A random salt string
 */
export function generateSalt(): string {
	return CryptoJS.lib.WordArray.random(16).toString();
}

/**
 * Set up master password (for first-time use)
 * @param password - The new master password
 * @returns Object with hash and salt
 */
export function setupMasterPassword(password: string): {
	hash: string;
	salt: string;
} {
	const salt = generateSalt();
	const hash = hashPassword(password, salt);

	return { hash, salt };
}

export interface JWTPayload {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
}

// Generate JWT token
export function generateToken(user: IUser): string {
	const payload: JWTPayload = {
		userId: (user._id as any).toString(),
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
	};

	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch (error) {
		return null;
	}
}

// Get token from request headers
export function getTokenFromRequest(request: NextRequest): string | null {
	const authHeader = request.headers.get('authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}
	return null;
}

// Middleware to authenticate requests
export async function authenticateRequest(
	request: NextRequest
): Promise<JWTPayload | null> {
	const token = getTokenFromRequest(request);
	if (!token) {
		return null;
	}

	return verifyToken(token);
}

// Create authenticated response
export function createAuthResponse(user: IUser) {
	const token = generateToken(user);

	return NextResponse.json({
		success: true,
		data: {
			user: {
				id: user._id as any,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				isEmailVerified: user.isEmailVerified,
			},
			token,
		},
		message: 'Authentication successful',
	});
}

// Create error response
export function createAuthErrorResponse(message: string, status: number = 401) {
	return NextResponse.json(
		{
			success: false,
			error: message,
		},
		{ status }
	);
}
