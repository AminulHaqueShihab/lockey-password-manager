import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		console.log('GET /api/auth/me - Getting user profile');

		// Authenticate request
		const userPayload = await authenticateRequest(request);
		if (!userPayload) {
			return createAuthErrorResponse('Authentication required', 401);
		}

		// Connect to MongoDB
		await connectDB();

		// Find user by ID
		const user = await User.findById(userPayload.userId).select(
			'-password -masterPassword'
		);
		if (!user) {
			return createAuthErrorResponse('User not found', 404);
		}

		console.log('GET /api/auth/me - Profile retrieved successfully');

		return NextResponse.json({
			success: true,
			data: {
				user: {
					id: user._id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					isEmailVerified: user.isEmailVerified,
					lastLogin: user.lastLogin,
					createdAt: user.createdAt,
				},
			},
		});
	} catch (error) {
		console.error('Error getting user profile:', error);
		return createAuthErrorResponse('Failed to get user profile', 500);
	}
}
