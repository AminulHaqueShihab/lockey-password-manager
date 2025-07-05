'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useRegisterMutation } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/store';
import { setCredentials } from '@/lib/store';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';

interface RegisterFormProps {
	onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		masterPassword: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showMasterPassword, setShowMasterPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const dispatch = useAppDispatch();
	const [register] = useRegisterMutation();

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const validateForm = () => {
		const { firstName, lastName, email, password, masterPassword } = formData;

		if (!firstName || !lastName || !email || !password || !masterPassword) {
			toast.error('Please fill in all fields');
			return false;
		}

		if (password.length < 8) {
			toast.error('Password must be at least 8 characters long');
			return false;
		}

		if (masterPassword.length < 8) {
			toast.error('Master password must be at least 8 characters long');
			return false;
		}

		if (password === masterPassword) {
			toast.error('Regular password and master password must be different');
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error('Please enter a valid email address');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			const result = await register(formData).unwrap();

			if (result.success) {
				dispatch(
					setCredentials({
						user: result.data.user,
						token: result.data.token,
					})
				);

				toast.success('Registration successful! Welcome to Lockey.');
				router.push('/vault');
			}
		} catch (error: any) {
			console.error('Registration error:', error);
			const errorMessage =
				error?.data?.error || 'Registration failed. Please try again.';
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl font-bold text-center'>
					Create Account
				</CardTitle>
				<CardDescription className='text-center'>
					Set up your secure password vault
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>First Name</Label>
							<div className='relative'>
								<User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<Input
									id='firstName'
									type='text'
									placeholder='First name'
									value={formData.firstName}
									onChange={e => handleInputChange('firstName', e.target.value)}
									className='pl-10'
									required
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='lastName'>Last Name</Label>
							<div className='relative'>
								<User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<Input
									id='lastName'
									type='text'
									placeholder='Last name'
									value={formData.lastName}
									onChange={e => handleInputChange('lastName', e.target.value)}
									className='pl-10'
									required
								/>
							</div>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
							<Input
								id='email'
								type='email'
								placeholder='Enter your email'
								value={formData.email}
								onChange={e => handleInputChange('email', e.target.value)}
								className='pl-10'
								required
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password'>Password</Label>
						<div className='relative'>
							<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
							<Input
								id='password'
								type={showPassword ? 'text' : 'password'}
								placeholder='Create a password'
								value={formData.password}
								onChange={e => handleInputChange('password', e.target.value)}
								className='pl-10 pr-10'
								required
							/>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className='h-4 w-4 text-gray-400' />
								) : (
									<Eye className='h-4 w-4 text-gray-400' />
								)}
							</Button>
						</div>
						<p className='text-xs text-gray-500'>Minimum 8 characters</p>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='masterPassword'>Master Password</Label>
						<div className='relative'>
							<Shield className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
							<Input
								id='masterPassword'
								type={showMasterPassword ? 'text' : 'password'}
								placeholder='Create a master password'
								value={formData.masterPassword}
								onChange={e =>
									handleInputChange('masterPassword', e.target.value)
								}
								className='pl-10 pr-10'
								required
							/>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
								onClick={() => setShowMasterPassword(!showMasterPassword)}
							>
								{showMasterPassword ? (
									<EyeOff className='h-4 w-4 text-gray-400' />
								) : (
									<Eye className='h-4 w-4 text-gray-400' />
								)}
							</Button>
						</div>
						<p className='text-xs text-gray-500'>
							This will be used to encrypt/decrypt your passwords. Keep it
							secure!
						</p>
					</div>

					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading ? 'Creating account...' : 'Create Account'}
					</Button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-gray-600'>
						Already have an account?{' '}
						<button
							type='button'
							onClick={onSwitchToLogin}
							className='text-blue-600 hover:text-blue-800 font-medium'
						>
							Sign in
						</button>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
