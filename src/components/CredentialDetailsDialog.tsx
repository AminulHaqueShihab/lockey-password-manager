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
	X,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CopyButton from './CopyButton';
import { getServiceConfig, getCategoryColor } from '@/lib/services';
import { ICredential } from '@/models/Credential';

interface CredentialDetailsDialogProps {
	credential: ICredential;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit: (credential: ICredential) => void;
	onDelete: (id: string) => void;
	onTogglePin: (id: string, isPinned: boolean) => void;
}

export default function CredentialDetailsDialog({
	credential,
	open,
	onOpenChange,
	onEdit,
	onDelete,
	onTogglePin,
}: CredentialDetailsDialogProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [showTwoFactor, setShowTwoFactor] = useState(false);

	const serviceConfig = getServiceConfig(credential.serviceName);
	const categoryColor = getCategoryColor(credential.category);

	const handleLogin = () => {
		window.open(credential.serviceUrl, '_blank');
	};

	const handleAutoFill = () => {
		console.log('Auto-fill functionality would be implemented here');
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<div className='flex items-center justify-between'>
						<DialogTitle className='flex items-center gap-3'>
							<div className='text-2xl'>{serviceConfig.icon}</div>
							<div>
								<h2 className='text-xl font-semibold'>
									{credential.serviceName}
								</h2>
								<p className='text-sm text-gray-600 dark:text-gray-400'>
									{credential.serviceUrl}
								</p>
							</div>
						</DialogTitle>
						<div className='flex items-center gap-2'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() =>
									onTogglePin(credential._id as string, !credential.isPinned)
								}
							>
								{credential.isPinned ? (
									<Pin className='h-4 w-4' />
								) : (
									<PinOff className='h-4 w-4' />
								)}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => onOpenChange(false)}
							>
								<X className='h-4 w-4' />
							</Button>
						</div>
					</div>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Category and actions */}
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

						<div className='flex items-center gap-2'>
							<Button variant='outline' size='sm' onClick={handleLogin}>
								<ExternalLink className='h-4 w-4 mr-2' />
								Log In
							</Button>
							<Button variant='outline' size='sm' onClick={handleAutoFill}>
								Auto Fill
							</Button>
						</div>
					</div>

					{/* Credential details */}
					<div className='space-y-4'>
						{/* Username */}
						<div>
							<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Username
							</label>
							<div className='flex items-center gap-2 mt-1'>
								<span className='text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1'>
									{credential.username}
								</span>
								<CopyButton text={credential.username} label='Copy' />
							</div>
						</div>

						{/* Email */}
						<div>
							<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Email
							</label>
							<div className='flex items-center gap-2 mt-1'>
								<span className='text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1'>
									{credential.email}
								</span>
								<CopyButton text={credential.email} label='Copy' />
							</div>
						</div>

						{/* Password */}
						<div>
							<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
								Password
							</label>
							<div className='flex items-center gap-2 mt-1'>
								<div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1'>
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
								<CopyButton text={credential.password} label='Copy' />
							</div>
						</div>

						{/* 2FA Secret (if exists) */}
						{credential.twoFactorSecret && (
							<div>
								<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
									2FA Secret
								</label>
								<div className='flex items-center gap-2 mt-1'>
									<div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded flex-1'>
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
									<CopyButton text={credential.twoFactorSecret} label='Copy' />
								</div>
							</div>
						)}

						{/* Notes (if exists) */}
						{credential.notes && (
							<div>
								<label className='text-sm font-medium text-gray-600 dark:text-gray-400'>
									Notes
								</label>
								<p className='text-sm text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded'>
									{credential.notes}
								</p>
							</div>
						)}
					</div>

					{/* Card actions */}
					<div className='flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700'>
						<div className='flex items-center gap-2'>
							<Button variant='outline' onClick={() => onEdit(credential)}>
								<Edit className='h-4 w-4 mr-2' />
								Edit
							</Button>
							<Button
								variant='outline'
								onClick={() => onDelete(credential._id as string)}
								className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
							>
								<Trash2 className='h-4 w-4 mr-2' />
								Delete
							</Button>
						</div>

						<div className='text-xs text-gray-500'>
							Created: {new Date(credential.createdAt).toLocaleDateString()}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
