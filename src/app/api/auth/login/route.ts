import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createAuthResponse, createAuthErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		console.log('POST /api/auth/login - Starting login');

		// Connect to MongoDB
		await connectDB();

		// Parse request body
		const body = await request.json();
		const { email, password } = body;

		// Validate required fields
		if (!email || !password) {
			return createAuthErrorResponse('Email and password are required', 400);
		}

		// Find user by email
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return createAuthErrorResponse('Invalid email or password', 401);
		}

		// Verify password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return createAuthErrorResponse('Invalid email or password', 401);
		}

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		console.log('POST /api/auth/login - Login successful');

		// Return success response with token
		return createAuthResponse(user);
	} catch (error) {
		console.error('Error during login:', error);
		return createAuthErrorResponse('Failed to authenticate user', 500);
	}
}
