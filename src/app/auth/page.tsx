'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { Shield, Lock } from 'lucide-react';

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const { isAuthenticated } = useAppSelector(state => state.auth);
	const router = useRouter();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.push('/vault');
		}
	}, [isAuthenticated, router]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Header */}
				<div className='text-center mb-8'>
					<div className='flex items-center justify-center mb-4'>
						<div className='bg-blue-600 p-3 rounded-full mr-3'>
							<Shield className='h-8 w-8 text-white' />
						</div>
						<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
							Lockey
						</h1>
					</div>
					<p className='text-gray-600 dark:text-gray-300'>
						Secure password management for everyone
					</p>
				</div>

				{/* Auth Forms */}
				{isLogin ? (
					<LoginForm onSwitchToRegister={() => setIsLogin(false)} />
				) : (
					<RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
				)}

				{/* Footer */}
				<div className='mt-8 text-center'>
					<div className='flex items-center justify-center text-gray-500 dark:text-gray-400 mb-2'>
						<Lock className='h-4 w-4 mr-2' />
						<span className='text-sm'>End-to-end encrypted</span>
					</div>
					<p className='text-xs text-gray-400 dark:text-gray-500'>
						Your data is encrypted and secure
					</p>
				</div>
			</div>
		</div>
	);
}
