import { useCallback } from 'react';
import { toast } from 'sonner';
import {
	useGetCredentialsQuery,
	useCreateCredentialMutation,
	useUpdateCredentialMutation,
	useDeleteCredentialMutation,
	useTogglePinMutation,
} from '@/lib/api/credentialsApi';
import { ICredential } from '@/models/Credential';

/**
 * Custom hook for credential operations with better error handling
 */
export const useCredentials = (
	filters?: {
		category?: string;
		search?: string;
	},
	options?: { skip?: boolean }
) => {
	const { data, isLoading, error, refetch } = useGetCredentialsQuery(
		filters || {},
		{ skip: options?.skip }
	);
	const [createCredential, { isLoading: isCreating }] =
		useCreateCredentialMutation();
	const [updateCredential, { isLoading: isUpdating }] =
		useUpdateCredentialMutation();
	const [deleteCredential, { isLoading: isDeleting }] =
		useDeleteCredentialMutation();
	const [togglePin, { isLoading: isTogglingPin }] = useTogglePinMutation();

	const credentials = data?.data || [];
	const count = data?.count || 0;

	const handleCreate = useCallback(
		async (credentialData: Partial<ICredential>) => {
			try {
				await createCredential(credentialData).unwrap();
				toast.success('Credential created successfully!');
				return true;
			} catch (error) {
				console.error('Error creating credential:', error);
				toast.error('Failed to create credential');
				return false;
			}
		},
		[createCredential]
	);

	const handleUpdate = useCallback(
		async (id: string, credentialData: Partial<ICredential>) => {
			try {
				await updateCredential({ id, credential: credentialData }).unwrap();
				toast.success('Credential updated successfully!');
				return true;
			} catch (error) {
				console.error('Error updating credential:', error);
				toast.error('Failed to update credential');
				return false;
			}
		},
		[updateCredential]
	);

	const handleDelete = useCallback(
		async (id: string) => {
			if (
				!confirm(
					'Are you sure you want to delete this credential? This action cannot be undone.'
				)
			) {
				return false;
			}

			try {
				await deleteCredential(id).unwrap();
				toast.success('Credential deleted successfully!');
				return true;
			} catch (error) {
				console.error('Error deleting credential:', error);
				toast.error('Failed to delete credential');
				return false;
			}
		},
		[deleteCredential]
	);

	const handleTogglePin = useCallback(
		async (id: string, isPinned: boolean) => {
			try {
				await togglePin({ id, isPinned }).unwrap();
				return true;
			} catch (error) {
				console.error('Error toggling pin:', error);
				toast.error('Failed to update credential');
				return false;
			}
		},
		[togglePin]
	);

	return {
		credentials,
		count,
		isLoading,
		error,
		refetch,
		isCreating,
		isUpdating,
		isDeleting,
		isTogglingPin,
		createCredential: handleCreate,
		updateCredential: handleUpdate,
		deleteCredential: handleDelete,
		togglePin: handleTogglePin,
	};
};

/**
 * Custom hook for single credential operations
 */
export const useCredential = (id: string) => {
	const { data, isLoading, error } = useGetCredentialQuery(id);
	const [deleteCredential, { isLoading: isDeleting }] =
		useDeleteCredentialMutation();

	const credential = data?.data;

	const handleDelete = useCallback(async () => {
		if (!credential) return false;

		if (
			!confirm(
				'Are you sure you want to delete this credential? This action cannot be undone.'
			)
		) {
			return false;
		}

		try {
			await deleteCredential(credential._id).unwrap();
			toast.success('Credential deleted successfully!');
			return true;
		} catch (error) {
			console.error('Error deleting credential:', error);
			toast.error('Failed to delete credential');
			return false;
		}
	}, [credential, deleteCredential]);

	return {
		credential,
		isLoading,
		error,
		isDeleting,
		deleteCredential: handleDelete,
	};
};
