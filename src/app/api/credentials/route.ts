import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Credential from '@/models/Credential';
import { decryptData } from '@/lib/encryption';

/**
 * GET /api/credentials
 * Fetches all credentials with decrypted sensitive data
 */
export async function GET(request: NextRequest) {
	try {
		// Connect to MongoDB
		await connectDB();

		// Get query parameters for filtering
		const { searchParams } = new URL(request.url);
		const category = searchParams.get('category');
		const search = searchParams.get('search');

		// Build query
		let query: any = {};

		if (category && category !== 'all') {
			query.category = category;
		}

		if (search) {
			query.$or = [
				{ serviceName: { $regex: search, $options: 'i' } },
				{ username: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
			];
		}

		// Fetch credentials from database
		const credentials = await Credential.find(query)
			.sort({ isPinned: -1, createdAt: -1 }) // Pinned items first, then by creation date
			.lean();

		// Decrypt sensitive data
		const decryptedCredentials = credentials.map(credential => ({
			...credential,
			password: decryptData(credential.password),
			twoFactorSecret: credential.twoFactorSecret
				? decryptData(credential.twoFactorSecret)
				: undefined,
		}));

		return NextResponse.json({
			success: true,
			data: decryptedCredentials,
			count: decryptedCredentials.length,
		});
	} catch (error) {
		console.error('Error fetching credentials:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch credentials' },
			{ status: 500 }
		);
	}
}

/**
 * POST /api/credentials
 * Creates a new credential with encrypted sensitive data
 */
export async function POST(request: NextRequest) {
	try {
		// Connect to MongoDB
		await connectDB();

		// Parse request body
		const body = await request.json();
		const {
			serviceName,
			serviceUrl,
			username,
			email,
			password,
			category,
			isPinned,
			twoFactorSecret,
			notes,
		} = body;

		// Validate required fields
		if (!serviceName || !serviceUrl || !username || !email || !password) {
			return NextResponse.json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Encrypt sensitive data
		const encryptedPassword = encryptData(password);
		const encryptedTwoFactorSecret = twoFactorSecret
			? encryptData(twoFactorSecret)
			: undefined;

		// Create new credential
		const newCredential = new Credential({
			serviceName,
			serviceUrl,
			username,
			email,
			password: encryptedPassword,
			category: category || 'General',
			isPinned: isPinned || false,
			twoFactorSecret: encryptedTwoFactorSecret,
			notes,
		});

		// Save to database
		const savedCredential = await newCredential.save();

		// Return decrypted data for response
		const responseData = {
			...savedCredential.toObject(),
			password: password, // Return original password for confirmation
			twoFactorSecret: twoFactorSecret || undefined,
		};

		return NextResponse.json(
			{
				success: true,
				data: responseData,
				message: 'Credential created successfully',
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Error creating credential:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to create credential' },
			{ status: 500 }
		);
	}
}

// Import encryption function
import { encryptData } from '@/lib/encryption';
