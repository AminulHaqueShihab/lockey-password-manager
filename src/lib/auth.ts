import CryptoJS from 'crypto-js';

// Master password configuration
const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH;
const MASTER_PASSWORD_SALT = process.env.MASTER_PASSWORD_SALT || 'default-salt';

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
