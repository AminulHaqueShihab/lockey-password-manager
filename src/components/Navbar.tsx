'use client';

import { useState, useEffect } from 'react';
import { Shield, Moon, Sun, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { logoutAndResetCache } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface NavbarProps {
	credentialCount: number;
}

export default function Navbar({ credentialCount }: NavbarProps) {
	const [darkMode, setDarkMode] = useState(false);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(state => state.auth);

	// Handle logout
	const handleLogout = () => {
		dispatch(logoutAndResetCache());
		toast.success('Logged out successfully');
		router.push('/auth');
	};

	// Toggle dark mode
	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle('dark');
	};

	// Initialize dark mode
	useEffect(() => {
		const isDark = document.documentElement.classList.contains('dark');
		setDarkMode(isDark);
	}, []);

	return (
		<header className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center gap-3'>
						<div className='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg'>
							<Shield className='h-6 w-6 text-blue-600 dark:text-blue-400' />
						</div>
						<div>
							<h1 className='text-xl font-bold text-gray-900 dark:text-white'>
								Password Vault
							</h1>
							<p className='text-sm text-gray-600 dark:text-gray-400'>
								{credentialCount} credentials stored
							</p>
						</div>
					</div>

					<div className='flex items-center gap-3'>
						{/* User info */}
						<div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
							<User className='h-4 w-4' />
							<span>
								{user?.firstName} {user?.lastName}
							</span>
						</div>

						{/* Dark mode toggle */}
						<Button
							variant='ghost'
							size='sm'
							onClick={toggleDarkMode}
							className='p-2'
						>
							{darkMode ? (
								<Sun className='h-4 w-4' />
							) : (
								<Moon className='h-4 w-4' />
							)}
						</Button>

						{/* Logout button */}
						<Button
							variant='outline'
							size='sm'
							onClick={handleLogout}
							className='flex items-center gap-2'
						>
							<LogOut className='h-4 w-4' />
							Logout
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
