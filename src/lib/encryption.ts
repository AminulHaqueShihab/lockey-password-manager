import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY =
	process.env.ENCRYPTION_KEY || 'your-super-secret-encryption-key-32-chars';

/**
 * Encrypts sensitive data using AES encryption
 * @param data - The data to encrypt
 * @returns Encrypted data as a string
 */
export function encryptData(data: string): string {
	try {
		return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
	} catch (error) {
		console.error('Encryption error:', error);
		throw new Error('Failed to encrypt data');
	}
}

/**
 * Decrypts encrypted data using AES decryption
 * @param encryptedData - The encrypted data to decrypt
 * @returns Decrypted data as a string
 */
export function decryptData(encryptedData: string): string {
	try {
		const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
		return bytes.toString(CryptoJS.enc.Utf8);
	} catch (error) {
		console.error('Decryption error:', error);
		throw new Error('Failed to decrypt data');
	}
}

/**
 * Generates a secure random password
 * @param length - Length of the password (default: 16)
 * @param includeSpecialChars - Whether to include special characters (default: true)
 * @returns Generated password
 */
export function generatePassword(
	length: number = 16,
	includeSpecialChars: boolean = true
): string {
	const lowercase = 'abcdefghijklmnopqrstuvwxyz';
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const numbers = '0123456789';
	const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

	let chars = lowercase + uppercase + numbers;
	if (includeSpecialChars) {
		chars += special;
	}

	let password = '';
	for (let i = 0; i < length; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return password;
}

/**
 * Calculates password strength score (0-100)
 * @param password - The password to evaluate
 * @returns Strength score from 0 to 100
 */
export function calculatePasswordStrength(password: string): number {
	let score = 0;

	// Length contribution
	if (password.length >= 8) score += 20;
	if (password.length >= 12) score += 10;
	if (password.length >= 16) score += 10;

	// Character variety contribution
	if (/[a-z]/.test(password)) score += 10;
	if (/[A-Z]/.test(password)) score += 10;
	if (/[0-9]/.test(password)) score += 10;
	if (/[^A-Za-z0-9]/.test(password)) score += 10;

	// Bonus for mixed case and numbers
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 10;
	if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 10;

	return Math.min(score, 100);
}
