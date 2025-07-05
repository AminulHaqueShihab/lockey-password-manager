'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setupMasterPassword } from '@/lib/auth';
import { toast } from 'sonner';

interface MasterPasswordSetupProps {
	onSetupComplete: () => void;
}

/**
 * MasterPasswordSetup component for first-time master password configuration
 */
export default function MasterPasswordSetup({
	onSetupComplete,
}: MasterPasswordSetupProps) {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate passwords
		if (password.length < 8) {
			toast.error('Master password must be at least 8 characters long');
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		setLoading(true);

		try {
			// Generate hash and salt
			const { hash, salt } = setupMasterPassword(password);

			// Store in localStorage for demo purposes
			// In production, this would be stored securely (e.g., in a secure database)
			localStorage.setItem('masterPasswordHash', hash);
			localStorage.setItem('masterPasswordSalt', salt);

			toast.success('Master password set successfully!');
			onSetupComplete();
		} catch (error) {
			console.error('Error setting up master password:', error);
			toast.error('Failed to set master password');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit'>
						<Shield className='h-8 w-8 text-blue-600 dark:text-blue-400' />
					</div>
					<CardTitle className='text-2xl font-bold'>
						Set Master Password
					</CardTitle>
					<p className='text-gray-600 dark:text-gray-400'>
						Create a master password to secure your vault. This password will be
						required to access your credentials.
					</p>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='password'>Master Password</Label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={e => setPassword(e.target.value)}
									placeholder='Enter your master password'
									className='pl-10 pr-10'
									required
									minLength={8}
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
								>
									{showPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
							<p className='text-xs text-gray-500'>
								Must be at least 8 characters long
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm Master Password</Label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<Input
									id='confirmPassword'
									type={showConfirmPassword ? 'text' : 'password'}
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									placeholder='Confirm your master password'
									className='pl-10 pr-10'
									required
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0'
								>
									{showConfirmPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>

						<div className='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
							<h4 className='text-sm font-medium text-blue-900 dark:text-blue-100 mb-2'>
								⚠️ Important Security Notes
							</h4>
							<ul className='text-xs text-blue-800 dark:text-blue-200 space-y-1'>
								<li>• This password cannot be recovered if lost</li>
								<li>• Use a strong, unique password</li>
								<li>• Store this password securely</li>
								<li>• This password encrypts all your data</li>
							</ul>
						</div>

						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? (
								<>
									<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
									Setting up...
								</>
							) : (
								<>
									<Shield className='h-4 w-4 mr-2' />
									Set Master Password
								</>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
