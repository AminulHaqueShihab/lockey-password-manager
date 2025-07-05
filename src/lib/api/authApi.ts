import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isEmailVerified: boolean;
	lastLogin: string;
	createdAt: string;
}

export interface AuthResponse {
	success: boolean;
	data: {
		user: User;
		token: string;
	};
	message: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	masterPassword: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface ProfileResponse {
	success: boolean;
	data: {
		user: User;
	};
}

// Define the base query with error handling
const baseQuery = fetchBaseQuery({
	baseUrl: '/api',
	prepareHeaders: (headers, { getState }) => {
		headers.set('Content-Type', 'application/json');

		// Add auth token if available (only on client side)
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('authToken');
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
				console.log(
					'Adding auth token to request:',
					token.substring(0, 20) + '...'
				);
			} else {
				console.log('No auth token found in localStorage');
			}
		} else {
			console.log('Running on server side, skipping token');
		}

		return headers;
	},
});

// Define the auth API
export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery,
	tagTypes: ['User'],
	endpoints: builder => ({
		// Register new user
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: credentials => ({
				url: '/auth/register',
				method: 'POST',
				body: credentials,
			}),
		}),

		// Login user
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: credentials => ({
				url: '/auth/login',
				method: 'POST',
				body: credentials,
			}),
		}),

		// Get current user profile
		getProfile: builder.query<ProfileResponse, void>({
			query: () => '/auth/me',
			providesTags: ['User'],
		}),
	}),
});

// Export hooks for use in components
export const { useRegisterMutation, useLoginMutation, useGetProfileQuery } =
	authApi;
