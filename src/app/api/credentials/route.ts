import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Credential, { ICredential } from '@/models/Credential';
import { decryptData, encryptData } from '@/lib/encryption';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/auth';

/**
 * GET /api/credentials
 * Fetches all credentials for the authenticated user with decrypted sensitive data
 */
export async function GET(request: NextRequest) {
	try {
		console.log('GET /api/credentials - Starting request');

		// Authenticate request
		const userPayload = await authenticateRequest(request);
		if (!userPayload) {
			return createAuthErrorResponse('Authentication required', 401);
		}

		// Connect to MongoDB
		await connectDB();
		console.log('GET /api/credentials - Database connected');

		// Get query parameters for filtering
		const { searchParams } = new URL(request.url);
		const category = searchParams.get('category');
		const search = searchParams.get('search');

		console.log('GET /api/credentials - Query params:', { category, search });

		// Build query - always filter by user
		let query: any = { userId: userPayload.userId };

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

		console.log('GET /api/credentials - Executing query:', query);

		// Fetch credentials from database
		const credentials = (await Credential.find(query)
			.sort({ isPinned: -1, createdAt: -1 }) // Pinned items first, then by creation date
			.lean()) as any[];

		console.log(
			'GET /api/credentials - Found credentials:',
			credentials.length
		);

		// Decrypt sensitive data
		const decryptedCredentials = credentials.map(credential => ({
			...credential,
			_id: credential._id as string,
			password: decryptData(credential.password),
			twoFactorSecret: credential.twoFactorSecret
				? decryptData(credential.twoFactorSecret)
				: undefined,
		}));

		console.log('GET /api/credentials - Returning response');

		return NextResponse.json({
			success: true,
			data: decryptedCredentials,
			count: decryptedCredentials.length,
		});
	} catch (error) {
		console.error('Error fetching credentials:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch credentials',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

/**
 * POST /api/credentials
 * Creates a new credential for the authenticated user with encrypted sensitive data
 */
export async function POST(request: NextRequest) {
	try {
		console.log('POST /api/credentials - Starting creation');

		// Authenticate request
		const userPayload = await authenticateRequest(request);
		if (!userPayload) {
			return createAuthErrorResponse('Authentication required', 401);
		}

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

		// Create new credential with user ID
		const newCredential = new Credential({
			userId: userPayload.userId,
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

		console.log('POST /api/credentials - Credential created successfully');

		// Return decrypted data for response
		const responseData = {
			...savedCredential.toObject(),
			_id: savedCredential._id as string,
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
