'use client';

import { useState } from 'react';
import {
	Eye,
	EyeOff,
	ExternalLink,
	Edit,
	Trash2,
	Pin,
	PinOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import CopyButton from './CopyButton';
import { getServiceConfig, getCategoryColor } from '@/lib/services';
import { ICredential } from '@/models/Credential';

interface CredentialCardProps {
	credential: ICredential;
	onEdit: (credential: ICredential) => void;
	onDelete: (id: string) => void;
	onTogglePin: (id: string, isPinned: boolean) => void;
	className?: string;
}

/**
 * CredentialCard component displays a single credential with
 * service branding, actions, and encrypted data handling
 */
export default function CredentialCard({
	credential,
	onEdit,
	onDelete,
	onTogglePin,
	className = '',
}: CredentialCardProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showTwoFactor, setShowTwoFactor] = useState(false);

	const serviceConfig = getServiceConfig(credential.serviceName);
	const categoryColor = getCategoryColor(credential.category);

	const handleLogin = () => {
		// Placeholder for login functionality
		window.open(credential.serviceUrl, '_blank');
	};

	const handleAutoFill = () => {
		// Placeholder for autofill functionality
		console.log('Auto-fill functionality would be implemented here');
	};

	return (
		<Card
			className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}
		>
			{/* Service header with gradient background */}
			<CardHeader
				className={`bg-gradient-to-r ${serviceConfig.gradient} text-white p-4`}
				style={{
					background: `linear-gradient(135deg, ${serviceConfig.color}, ${serviceConfig.color}dd)`,
				}}
			>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='text-2xl'>{serviceConfig.icon}</div>
						<div>
							<h3 className='font-semibold text-lg'>
								{credential.serviceName}
							</h3>
							<p className='text-sm opacity-90'>{credential.serviceUrl}</p>
						</div>
					</div>

					{/* Pin toggle */}
					<Button
						variant='ghost'
						size='sm'
						onClick={() =>
							onTogglePin(credential._id as string, !credential.isPinned)
						}
						className='text-white hover:bg-white/20'
					>
						{credential.isPinned ? (
							<Pin className='h-4 w-4' />
						) : (
							<PinOff className='h-4 w-4' />
						)}
					</Button>
				</div>
			</CardHeader>

			<CardContent className='p-6 space-y-4'>
				{/* Category badge */}
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

					{/* Action buttons */}
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={handleLogin}
							className='text-xs'
						>
							<ExternalLink className='h-3 w-3 mr-1' />
							Log In
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={handleAutoFill}
							className='text-xs'
						>
							Go Fill
						</Button>
					</div>
				</div>

				{/* Credential details */}
				<div className='space-y-3'>
					{/* Username */}
					<div>
						<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
							Username
						</label>
						<div className='flex items-center gap-2 mt-1'>
							<span className='text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1'>
								{credential.username}
							</span>
							<CopyButton text={credential.username} label='Copy' size='sm' />
						</div>
					</div>

					{/* Email */}
					<div>
						<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
							Email
						</label>
						<div className='flex items-center gap-2 mt-1'>
							<span className='text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1'>
								{credential.email}
							</span>
							<CopyButton text={credential.email} label='Copy' size='sm' />
						</div>
					</div>

					{/* Password */}
					<div>
						<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
							Password
						</label>
						<div className='flex items-center gap-2 mt-1'>
							<div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1'>
								<span className='text-sm font-mono'>
									{showPassword ? credential.password : '••••••••••••••••'}
								</span>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setShowPassword(!showPassword)}
									className='h-6 w-6 p-0'
								>
									{showPassword ? (
										<EyeOff className='h-3 w-3' />
									) : (
										<Eye className='h-3 w-3' />
									)}
								</Button>
							</div>
							<CopyButton text={credential.password} label='Copy' size='sm' />
						</div>
					</div>

					{/* 2FA Secret (if exists) */}
					{credential.twoFactorSecret && (
						<div>
							<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								2FA Secret
							</label>
							<div className='flex items-center gap-2 mt-1'>
								<div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1'>
									<span className='text-sm font-mono'>
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
										{showTwoFactor ? (
											<EyeOff className='h-3 w-3' />
										) : (
											<Eye className='h-3 w-3' />
										)}
									</Button>
								</div>
								<CopyButton
									text={credential.twoFactorSecret}
									label='Copy'
									size='sm'
								/>
							</div>
						</div>
					)}

					{/* Notes (if exists) */}
					{credential.notes && (
						<div>
							<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Notes
							</label>
							<p className='text-sm text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded'>
								{credential.notes}
							</p>
						</div>
					)}
				</div>

				{/* Card actions */}
				<div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => onEdit(credential)}
						>
							<Edit className='h-4 w-4 mr-1' />
							Edit
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => onDelete(credential._id as string)}
							className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
						>
							<Trash2 className='h-4 w-4 mr-1' />
							Delete
						</Button>
					</div>

					<div className='text-xs text-gray-500'>
						Created: {new Date(credential.createdAt).toLocaleDateString()}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
