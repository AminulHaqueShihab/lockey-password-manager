'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
	ArrowLeft,
	Edit,
	Trash2,
	ExternalLink,
	Copy,
	Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ICredential } from '@/models/Credential';
import { getServiceConfig, getCategoryColor } from '@/lib/services';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

/**
 * Individual credential detail page
 */
export default function CredentialDetailPage() {
	const params = useParams();
	const router = useRouter();
	const credentialId = params.id as string;

	const [credential, setCredential] = useState<ICredential | null>(null);
	const [loading, setLoading] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [copiedField, setCopiedField] = useState<string | null>(null);

	// Load credential data
	useEffect(() => {
		const loadCredential = async () => {
			try {
				const response = await fetch(`/api/credentials/${credentialId}`);
				if (!response.ok) {
					throw new Error('Failed to fetch credential');
				}

				const data = await response.json();
				if (data.success) {
					setCredential(data.data);
				} else {
					throw new Error(data.error || 'Failed to load credential');
				}
			} catch (error) {
				console.error('Error loading credential:', error);
				toast.error('Failed to load credential');
				router.push('/vault');
			} finally {
				setLoading(false);
			}
		};

		if (credentialId) {
			loadCredential();
		}
	}, [credentialId, router]);

	// Handle copy to clipboard
	const handleCopy = async (text: string, field: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedField(field);
			toast.success(`${field} copied to clipboard!`);

			setTimeout(() => {
				setCopiedField(null);
			}, 2000);
		} catch (error) {
			console.error('Failed to copy text:', error);
			toast.error('Failed to copy to clipboard');
		}
	};

	// Handle delete
	const handleDelete = async () => {
		if (!credential) return;

		if (
			!confirm(
				'Are you sure you want to delete this credential? This action cannot be undone.'
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/credentials/${credential._id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete credential');
			}

			toast.success('Credential deleted successfully!');
			router.push('/vault');
		} catch (error) {
			console.error('Error deleting credential:', error);
			toast.error('Failed to delete credential');
		}
	};

	// Handle edit
	const handleEdit = () => {
		router.push(`/vault?edit=${credentialId}`);
	};

	// Loading state
	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600 dark:text-gray-400'>
						Loading credential...
					</p>
				</div>
			</div>
		);
	}

	// Not found state
	if (!credential) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold mb-4'>Credential Not Found</h1>
					<p className='text-gray-600 dark:text-gray-400 mb-4'>
						The credential you're looking for doesn't exist or has been deleted.
					</p>
					<Button onClick={() => router.push('/vault')}>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back to Vault
					</Button>
				</div>
			</div>
		);
	}

	const serviceConfig = getServiceConfig(credential.serviceName);
	const categoryColor = getCategoryColor(credential.category);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
			<Toaster />

			{/* Header */}
			<header className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						<div className='flex items-center gap-4'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => router.push('/vault')}
								className='flex items-center gap-2'
							>
								<ArrowLeft className='h-4 w-4' />
								Back to Vault
							</Button>

							<div className='flex items-center gap-3'>
								<div className='text-2xl'>{serviceConfig.icon}</div>
								<div>
									<h1 className='text-xl font-bold text-gray-900 dark:text-white'>
										{credential.serviceName}
									</h1>
									<p className='text-sm text-gray-600 dark:text-gray-400'>
										Credential Details
									</p>
								</div>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<Button variant='outline' size='sm' onClick={handleEdit}>
								<Edit className='h-4 w-4 mr-2' />
								Edit
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={handleDelete}
								className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
							>
								<Trash2 className='h-4 w-4 mr-2' />
								Delete
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Main credential card */}
					<div className='lg:col-span-2'>
						<Card className='overflow-hidden'>
							{/* Service header */}
							<CardHeader
								className={`bg-gradient-to-r ${serviceConfig.gradient} text-white p-6`}
								style={{
									background: `linear-gradient(135deg, ${serviceConfig.color}, ${serviceConfig.color}dd)`,
								}}
							>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-4'>
										<div className='text-4xl'>{serviceConfig.icon}</div>
										<div>
											<CardTitle className='text-2xl'>
												{credential.serviceName}
											</CardTitle>
											<p className='text-lg opacity-90'>
												{credential.serviceUrl}
											</p>
										</div>
									</div>

									<Button
										variant='ghost'
										size='sm'
										onClick={() => window.open(credential.serviceUrl, '_blank')}
										className='text-white hover:bg-white/20'
									>
										<ExternalLink className='h-4 w-4 mr-2' />
										Visit Site
									</Button>
								</div>
							</CardHeader>

							<CardContent className='p-6 space-y-6'>
								{/* Category and metadata */}
								<div className='flex items-center justify-between'>
									<Badge
										variant='secondary'
										style={{
											backgroundColor: categoryColor + '20',
											color: categoryColor,
										}}
									>
										{credential.category}
									</Badge>

									<div className='text-sm text-gray-500'>
										Created:{' '}
										{new Date(credential.createdAt).toLocaleDateString()}
									</div>
								</div>

								{/* Credential fields */}
								<div className='space-y-6'>
									{/* Username */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
											Username
										</label>
										<div className='flex items-center gap-2'>
											<div className='flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
												<span className='font-mono text-sm'>
													{credential.username}
												</span>
											</div>
											<Button
												variant='outline'
												size='sm'
												onClick={() =>
													handleCopy(credential.username, 'Username')
												}
											>
												{copiedField === 'Username' ? (
													<Check className='h-4 w-4' />
												) : (
													<Copy className='h-4 w-4' />
												)}
											</Button>
										</div>
									</div>

									{/* Email */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
											Email
										</label>
										<div className='flex items-center gap-2'>
											<div className='flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
												<span className='font-mono text-sm'>
													{credential.email}
												</span>
											</div>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleCopy(credential.email, 'Email')}
											>
												{copiedField === 'Email' ? (
													<Check className='h-4 w-4' />
												) : (
													<Copy className='h-4 w-4' />
												)}
											</Button>
										</div>
									</div>

									{/* Password */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
											Password
										</label>
										<div className='flex items-center gap-2'>
											<div className='flex items-center gap-2 flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
												<span className='font-mono text-sm'>
													{showPassword
														? credential.password
														: '••••••••••••••••'}
												</span>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => setShowPassword(!showPassword)}
													className='h-6 w-6 p-0'
												>
													{showPassword ? '👁️' : '👁️‍🗨️'}
												</Button>
											</div>
											<Button
												variant='outline'
												size='sm'
												onClick={() =>
													handleCopy(credential.password, 'Password')
												}
											>
												{copiedField === 'Password' ? (
													<Check className='h-4 w-4' />
												) : (
													<Copy className='h-4 w-4' />
												)}
											</Button>
										</div>
									</div>

									{/* 2FA Secret */}
									{credential.twoFactorSecret && (
										<div className='space-y-2'>
											<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
												2FA Secret
											</label>
											<div className='flex items-center gap-2'>
												<div className='flex items-center gap-2 flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
													<span className='font-mono text-sm'>
														{showTwoFactor
															? credential.twoFactorSecret
															: '••••••••••••••••'}
													</span>
													<Button
														variant='ghost'
														size='sm'
														onClick={() => setShowTwoFactor(!showTwoFactor)}
														className='h-6 w-6 p-0'
													>
														{showTwoFactor ? '👁️' : '👁️‍🗨️'}
													</Button>
												</div>
												<Button
													variant='outline'
													size='sm'
													onClick={() =>
														handleCopy(
															credential.twoFactorSecret!,
															'2FA Secret'
														)
													}
												>
													{copiedField === '2FA Secret' ? (
														<Check className='h-4 w-4' />
													) : (
														<Copy className='h-4 w-4' />
													)}
												</Button>
											</div>
										</div>
									)}

									{/* Notes */}
									{credential.notes && (
										<div className='space-y-2'>
											<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
												Notes
											</label>
											<div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
												<p className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
													{credential.notes}
												</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className='space-y-6'>
						{/* Quick actions */}
						<Card>
							<CardHeader>
								<CardTitle className='text-lg'>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								<Button
									variant='outline'
									className='w-full justify-start'
									onClick={() => window.open(credential.serviceUrl, '_blank')}
								>
									<ExternalLink className='h-4 w-4 mr-2' />
									Log In to Service
								</Button>
								<Button
									variant='outline'
									className='w-full justify-start'
									onClick={() => handleCopy(credential.username, 'Username')}
								>
									<Copy className='h-4 w-4 mr-2' />
									Copy Username
								</Button>
								<Button
									variant='outline'
									className='w-full justify-start'
									onClick={() => handleCopy(credential.password, 'Password')}
								>
									<Copy className='h-4 w-4 mr-2' />
									Copy Password
								</Button>
							</CardContent>
						</Card>

						{/* Security info */}
						<Card>
							<CardHeader>
								<CardTitle className='text-lg'>Security Info</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-600 dark:text-gray-400'>
										Last Updated
									</span>
									<span className='text-sm font-medium'>
										{new Date(credential.updatedAt).toLocaleDateString()}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-600 dark:text-gray-400'>
										Pinned
									</span>
									<span className='text-sm font-medium'>
										{credential.isPinned ? 'Yes' : 'No'}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-gray-600 dark:text-gray-400'>
										2FA Enabled
									</span>
									<span className='text-sm font-medium'>
										{credential.twoFactorSecret ? 'Yes' : 'No'}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
