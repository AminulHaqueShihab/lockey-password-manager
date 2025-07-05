'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store';

/**
 * Main page - Redirects based on authentication status
 */
export default function HomePage() {
	const router = useRouter();
	const { isAuthenticated } = useAppSelector(state => state.auth);

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/vault');
		} else {
			router.push('/auth');
		}
	}, [isAuthenticated, router]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
				<p className='text-gray-600 dark:text-gray-400'>Redirecting...</p>
			</div>
		</div>
	);
}
