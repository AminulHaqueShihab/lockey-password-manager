import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICredential } from '@/models/Credential';

// Define the base query with error handling
const baseQuery = fetchBaseQuery({
	baseUrl: '/api',
	prepareHeaders: headers => {
		headers.set('Content-Type', 'application/json');
		return headers;
	},
});

// Define the credentials API
export const credentialsApi = createApi({
	reducerPath: 'credentialsApi',
	baseQuery,
	tagTypes: ['Credential'],
	endpoints: builder => ({
		// Get all credentials
		getCredentials: builder.query<
			{ success: boolean; data: ICredential[]; count: number },
			{ category?: string; search?: string }
		>({
			query: params => {
				const searchParams = new URLSearchParams();
				if (params.category) searchParams.append('category', params.category);
				if (params.search) searchParams.append('search', params.search);

				return {
					url: `/credentials${
						searchParams.toString() ? `?${searchParams.toString()}` : ''
					}`,
				};
			},
			providesTags: result =>
				result
					? [
							...result.data.map(({ _id }) => ({
								type: 'Credential' as const,
								id: _id,
							})),
							{ type: 'Credential', id: 'LIST' },
					  ]
					: [{ type: 'Credential', id: 'LIST' }],
		}),

		// Get single credential by ID
		getCredential: builder.query<
			{ success: boolean; data: ICredential },
			string
		>({
			query: id => `/credentials/${id}`,
			providesTags: (result, error, id) => [{ type: 'Credential', id }],
		}),

		// Create new credential
		createCredential: builder.mutation<
			{ success: boolean; data: ICredential; message: string },
			Partial<ICredential>
		>({
			query: credential => ({
				url: '/credentials',
				method: 'POST',
				body: credential,
			}),
			invalidatesTags: [{ type: 'Credential', id: 'LIST' }],
		}),

		// Update credential
		updateCredential: builder.mutation<
			{ success: boolean; data: ICredential; message: string },
			{ id: string; credential: Partial<ICredential> }
		>({
			query: ({ id, credential }) => ({
				url: `/credentials/${id}`,
				method: 'PUT',
				body: credential,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Credential', id },
				{ type: 'Credential', id: 'LIST' },
			],
		}),

		// Delete credential
		deleteCredential: builder.mutation<
			{ success: boolean; message: string },
			string
		>({
			query: id => ({
				url: `/credentials/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Credential', id: 'LIST' }],
		}),

		// Toggle pin status
		togglePin: builder.mutation<
			{ success: boolean; data: ICredential; message: string },
			{ id: string; isPinned: boolean }
		>({
			query: ({ id, isPinned }) => ({
				url: `/credentials/${id}`,
				method: 'PUT',
				body: { isPinned },
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Credential', id },
				{ type: 'Credential', id: 'LIST' },
			],
		}),
	}),
});

// Export hooks for use in components
export const {
	useGetCredentialsQuery,
	useGetCredentialQuery,
	useCreateCredentialMutation,
	useUpdateCredentialMutation,
	useDeleteCredentialMutation,
	useTogglePinMutation,
} = credentialsApi;
