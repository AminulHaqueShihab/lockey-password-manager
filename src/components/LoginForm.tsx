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
import { useLoginMutation } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/store';
import { setCredentials } from '@/lib/store';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormProps {
	onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	const dispatch = useAppDispatch();
	const [login] = useLoginMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error('Please fill in all fields');
			return;
		}

		setIsLoading(true);

		try {
			const result = await login({ email, password }).unwrap();

			if (result.success) {
				dispatch(
					setCredentials({
						user: result.data.user,
						token: result.data.token,
					})
				);

				toast.success('Login successful!');
				router.push('/vault');
			}
		} catch (error: any) {
			console.log('Login error:', error);
			const errorMessage =
				error?.data?.error || 'Login failed. Please try again.';
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl font-bold text-center'>
					Welcome Back
				</CardTitle>
				<CardDescription className='text-center'>
					Enter your credentials to access your vault
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<div className='relative'>
							<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
							<Input
								id='email'
								type='email'
								placeholder='Enter your email'
								value={email}
								onChange={e => setEmail(e.target.value)}
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
								placeholder='Enter your password'
								value={password}
								onChange={e => setPassword(e.target.value)}
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
					</div>

					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</Button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-gray-600'>
						Don't have an account?{' '}
						<button
							type='button'
							onClick={onSwitchToRegister}
							className='text-blue-600 hover:text-blue-800 font-medium'
						>
							Sign up
						</button>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
