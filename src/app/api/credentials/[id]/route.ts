import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Credential, { ICredential } from '@/models/Credential';
import { decryptData, encryptData } from '@/lib/encryption';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/auth';

/**
 * GET /api/credentials/[id]
 * Fetches a single credential by ID with decrypted sensitive data (user-specific)
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Authenticate request
		const userPayload = await authenticateRequest(request);
		if (!userPayload) {
			return createAuthErrorResponse('Authentication required', 401);
		}

		// Connect to MongoDB
		await connectDB();

		const { id } = await params;

		// Validate ID
		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Credential ID is required' },
				{ status: 400 }
			);
		}

		// Find credential by ID and user ID
		const credential = (await Credential.findOne({
			_id: id,
			userId: userPayload.userId,
		}).lean()) as any;

		if (!credential) {
			return NextResponse.json(
				{ success: false, error: 'Credential not found' },
				{ status: 404 }
			);
		}

		// Decrypt sensitive data
		const decryptedCredential = {
			...credential,
			_id: credential._id as string,
			password: decryptData(credential.password),
			twoFactorSecret: credential.twoFactorSecret
				? decryptData(credential.twoFactorSecret)
				: undefined,
		};

		return NextResponse.json({
			success: true,
			data: decryptedCredential,
		});
	} catch (error) {
		console.error('Error fetching credential:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch credential' },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/credentials/[id]
 * Updates a credential with encrypted sensitive data (user-specific)
 */
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Authenticate request
		const userPayload = await authenticateRequest(request);
		if (!userPayload) {
			return createAuthErrorResponse('Authentication required', 401);
		}

		// Connect to MongoDB
		await connectDB();

		const { id } = await params;

		// Validate ID
		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Credential ID is required' },
				{ status: 400 }
			);
		}

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

		// Find existing credential by ID and user ID
		const existingCredential = (await Credential.findOne({
			_id: id,
			userId: userPayload.userId,
		})) as any;

		if (!existingCredential) {
			return NextResponse.json(
				{ success: false, error: 'Credential not found' },
				{ status: 404 }
			);
		}

		// Encrypt sensitive data
		const encryptedPassword = encryptData(password);
		const encryptedTwoFactorSecret = twoFactorSecret
			? encryptData(twoFactorSecret)
			: undefined;

		// Update credential
		const updatedCredential = (await Credential.findByIdAndUpdate(
			id,
			{
				serviceName,
				serviceUrl,
				username,
				email,
				password: encryptedPassword,
				category: category || 'General',
				isPinned: isPinned || false,
				twoFactorSecret: encryptedTwoFactorSecret,
				notes,
			},
			{ new: true, runValidators: true }
		).lean()) as any;

		// Return decrypted data for response
		const responseData = {
			...updatedCredential,
			_id: updatedCredential._id as string,
			password: password, // Return original password for confirmation
			twoFactorSecret: twoFactorSecret || undefined,
		};

		return NextResponse.json({
			success: true,
			data: responseData,
			message: 'Credential updated successfully',
		});
	} catch (error) {
		console.error('Error updating credential:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update credential' },
			{ status: 500 }
		);
	}
}

/**
 * DELETE /api/credentials/[id]
 * Deletes a credential by ID (user-specific)
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// Authenticate request
		const userPayload = await authenticateRequest(request);
		if (!userPayload) {
			return createAuthErrorResponse('Authentication required', 401);
		}

		// Connect to MongoDB
		await connectDB();

		const { id } = await params;

		// Validate ID
		if (!id) {
			return NextResponse.json(
				{ success: false, error: 'Credential ID is required' },
				{ status: 400 }
			);
		}

		// Find and delete credential by ID and user ID
		const deletedCredential = (await Credential.findOneAndDelete({
			_id: id,
			userId: userPayload.userId,
		})) as any;

		if (!deletedCredential) {
			return NextResponse.json(
				{ success: false, error: 'Credential not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Credential deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting credential:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to delete credential' },
			{ status: 500 }
		);
	}
}
