#!/usr/bin/env node

const CryptoJS = require('crypto-js');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Generate a secure salt
 * @returns A random salt string
 */
function generateSalt() {
	return CryptoJS.lib.WordArray.random(16).toString();
}

/**
 * Hash a password using SHA-256 with salt
 * @param password - The password to hash
 * @param salt - The salt to use
 * @returns Hashed password
 */
function hashPassword(password, salt) {
	return CryptoJS.SHA256(password + salt).toString();
}

/**
 * Generate master password hash and salt
 * @param password - The master password
 * @returns Object with hash and salt
 */
function setupMasterPassword(password) {
	const salt = generateSalt();
	const hash = hashPassword(password, salt);

	return { hash, salt };
}

console.log('🔐 Master Password Generator');
console.log('============================\n');

rl.question('Enter your master password: ', password => {
	if (password.length < 8) {
		console.error('❌ Error: Password must be at least 8 characters long');
		rl.close();
		return;
	}

	rl.question('Confirm your master password: ', confirmPassword => {
		if (password !== confirmPassword) {
			console.error('❌ Error: Passwords do not match');
			rl.close();
			return;
		}

		const { hash, salt } = setupMasterPassword(password);

		console.log('\n✅ Master password generated successfully!\n');
		console.log('Add these to your .env.local file:\n');
		console.log(`MASTER_PASSWORD_HASH=${hash}`);
		console.log(`MASTER_PASSWORD_SALT=${salt}\n`);
		console.log('⚠️  Important:');
		console.log('• Keep your master password secure');
		console.log('• Store the hash and salt in a secure location');
		console.log('• Never share your master password');
		console.log('• This password cannot be recovered if lost\n');

		rl.close();
	});
});
