'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { setUser } from '@/lib/store';
import { useGetProfileQuery } from '@/lib/api/authApi';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isAuthenticated, token, user } = useAppSelector(state => state.auth);

	// Get user profile if token exists but no user data
	const {
		data: profileData,
		error: profileError,
		isLoading: profileLoading,
	} = useGetProfileQuery(undefined, {
		skip: !token || !!user,
	});

	useEffect(() => {
		// If no token, redirect to auth immediately
		if (!token) {
			router.push('/auth');
			return;
		}

		// If we have a token but no profile data yet, keep loading
		if (token && profileLoading) {
			return;
		}

		// If we have an error, redirect to auth
		if (profileError) {
			console.error('Profile error:', profileError);
			router.push('/auth');
			return;
		}

		// If we have profile data, update Redux and stop loading
		if (profileData?.data?.user) {
			dispatch(setUser(profileData.data.user));
			setIsLoading(false);
		}

		// If we already have user data, stop loading
		if (user) {
			setIsLoading(false);
		}
	}, [
		token,
		profileData,
		profileError,
		profileLoading,
		user,
		dispatch,
		router,
	]);

	// Show loading while checking authentication
	if (isLoading || (profileLoading && !user)) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600 dark:text-gray-400'>
						Loading your vault...
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
