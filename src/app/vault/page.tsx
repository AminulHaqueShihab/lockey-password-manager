'use client';

import { RefreshCw } from 'lucide-react';
import CredentialList from '@/components/CredentialList';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useCredentials } from '@/hooks/useCredentials';
import { Toaster } from '@/components/ui/sonner';

/**
 * Vault page - Main password manager interface
 */
function VaultPageContent() {
	// Custom hook for credential operations
	const { credentials, isLoading } = useCredentials();

	// Loading state
	if (isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
				<div className='text-center'>
					<RefreshCw className='h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400' />
					<p className='text-gray-600 dark:text-gray-400'>
						Loading your vault...
					</p>
				</div>
			</div>
		);
	}

	// Main vault interface
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
			<Toaster />

			{/* Navbar */}
			<Navbar credentialCount={credentials.length} />

			{/* Main content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<CredentialList />
			</main>
		</div>
	);
}

export default function VaultPage() {
	return (
		<ProtectedRoute>
			<VaultPageContent />
		</ProtectedRoute>
	);
}
