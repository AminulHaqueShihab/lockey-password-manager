import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createAuthResponse, createAuthErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		console.log('POST /api/auth/register - Starting registration');

		// Connect to MongoDB
		await connectDB();

		// Parse request body
		const body = await request.json();
		const { email, password, firstName, lastName, masterPassword } = body;

		// Validate required fields
		if (!email || !password || !firstName || !lastName || !masterPassword) {
			return createAuthErrorResponse(
				'All fields are required: email, password, firstName, lastName, masterPassword',
				400
			);
		}

		// Validate password length
		if (password.length < 8) {
			return createAuthErrorResponse(
				'Password must be at least 8 characters long',
				400
			);
		}

		// Validate master password length
		if (masterPassword.length < 8) {
			return createAuthErrorResponse(
				'Master password must be at least 8 characters long',
				400
			);
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return createAuthErrorResponse(
				'User with this email already exists',
				409
			);
		}

		// Create new user
		const newUser = new User({
			email: email.toLowerCase(),
			password,
			firstName,
			lastName,
			masterPassword,
		});

		// Save user to database
		const savedUser = await newUser.save();

		console.log('POST /api/auth/register - User created successfully');

		// Return success response with token
		return createAuthResponse(savedUser);
	} catch (error) {
		console.error('Error during registration:', error);

		// Handle duplicate key error
		if (error instanceof Error && error.message.includes('duplicate key')) {
			return createAuthErrorResponse(
				'User with this email already exists',
				409
			);
		}

		return createAuthErrorResponse('Failed to create user account', 500);
	}
}
