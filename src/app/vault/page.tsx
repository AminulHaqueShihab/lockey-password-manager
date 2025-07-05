'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, RefreshCw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CredentialList from '@/components/CredentialList';
import MasterPasswordSetup from '@/components/MasterPasswordSetup';
import { validateMasterPassword, isMasterPasswordConfigured } from '@/lib/auth';
import { useCredentials } from '@/hooks/useCredentials';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

/**
 * Vault page - Main password manager interface
 */
export default function VaultPage() {
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [needsSetup, setNeedsSetup] = useState(false);
	const [masterPassword, setMasterPassword] = useState('');
	const [darkMode, setDarkMode] = useState(false);

	// Custom hook for credential operations
	const { credentials, isLoading, refetch } = useCredentials(
		{},
		{ skip: !isUnlocked }
	);

	// Load credentials using RTK Query
	const loadCredentials = () => {
		refetch();
	};

	// Check if master password is configured
	useEffect(() => {
		const checkMasterPasswordSetup = () => {
			// Check if master password is configured via environment variables
			const envConfigured = isMasterPasswordConfigured();

			// Check if master password is configured via localStorage (demo mode)
			const localConfigured = localStorage.getItem('masterPasswordHash');

			if (!envConfigured && !localConfigured) {
				setNeedsSetup(true); 
			}
		};

		checkMasterPasswordSetup();
	}, []);

	// Handle vault unlock
	const handleUnlock = (e: React.FormEvent) => {
		e.preventDefault();

		if (!masterPassword.trim()) {
			toast.error('Please enter your master password');
			return;
		}

		// Validate master password
		const isValid = validateMasterPassword(masterPassword);

		if (isValid) {
			setIsUnlocked(true);
			toast.success('Vault unlocked successfully!');
		} else {
			toast.error('Incorrect master password');
			setMasterPassword('');
		}
	};

	// Handle vault lock
	const handleLock = () => {
		setIsUnlocked(false);
		setMasterPassword('');
		toast.info('Vault locked');
	};

	// Handle master password setup completion
	const handleSetupComplete = () => {
		setNeedsSetup(false);
		toast.success('Master password configured successfully!');
	};

	// Toggle dark mode
	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle('dark');
	};

	// Load credentials when vault is unlocked
	useEffect(() => {
		if (isUnlocked) {
			// RTK Query will automatically fetch when isUnlocked becomes true
			// due to the skip condition in useGetCredentialsQuery
		}
	}, [isUnlocked]);

	// Initialize dark mode
	useEffect(() => {
		const isDark = document.documentElement.classList.contains('dark');
		setDarkMode(isDark);
	}, []);

	// Master password setup state
	if (needsSetup) {
		return <MasterPasswordSetup onSetupComplete={handleSetupComplete} />;
	}

	// Loading state
	if (isLoading && isUnlocked) {
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

	// Locked state
	if (!isUnlocked) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
				<Card className='w-full max-w-md'>
					<CardHeader className='text-center'>
						<div className='mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit'>
							<Shield className='h-8 w-8 text-blue-600 dark:text-blue-400' />
						</div>
						<CardTitle className='text-2xl font-bold'>Password Vault</CardTitle>
						<p className='text-gray-600 dark:text-gray-400'>
							Enter your master password to unlock your vault
						</p>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleUnlock} className='space-y-4'>
							<div className='space-y-2'>
								<label htmlFor='masterPassword' className='text-sm font-medium'>
									Master Password
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
									<input
										id='masterPassword'
										type='password'
										value={masterPassword}
										onChange={e => setMasterPassword(e.target.value)}
										placeholder='Enter your master password'
										className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										required
									/>
								</div>
							</div>

							<Button type='submit' className='w-full'>
								<Shield className='h-4 w-4 mr-2' />
								Unlock Vault
							</Button>
						</form>

						<div className='mt-4 text-center'>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								Enter your master password to unlock the vault
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Unlocked state - Main vault interface
	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
			<Toaster />

			{/* Header */}
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
									{credentials.length} credentials stored
								</p>
							</div>
						</div>

						<div className='flex items-center gap-3'>
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

							{/* Refresh button */}
							<Button
								variant='outline'
								size='sm'
								onClick={loadCredentials}
								className='flex items-center gap-2'
							>
								<RefreshCw className='h-4 w-4' />
								Refresh
							</Button>

							{/* Lock vault button */}
							<Button
								variant='outline'
								size='sm'
								onClick={handleLock}
								className='flex items-center gap-2'
							>
								<Lock className='h-4 w-4' />
								Lock Vault
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<CredentialList />
			</main>
		</div>
	);
}
