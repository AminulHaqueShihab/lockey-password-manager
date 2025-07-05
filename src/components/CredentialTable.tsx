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
	MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CopyButton from './CopyButton';
import CredentialDetailsDialog from './CredentialDetailsDialog';
import { getServiceConfig, getCategoryColor } from '@/lib/services';
import { ICredential } from '@/models/Credential';

interface CredentialTableProps {
	credentials: ICredential[];
	onEdit: (credential: ICredential) => void;
	onDelete: (id: string) => void;
	onTogglePin: (id: string, isPinned: boolean) => void;
}

export default function CredentialTable({
	credentials,
	onEdit,
	onDelete,
	onTogglePin,
}: CredentialTableProps) {
	const [showDetails, setShowDetails] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState<string | null>(null);

	const handleLogin = (url: string) => {
		window.open(url, '_blank');
	};

	const togglePasswordVisibility = (id: string) => {
		setShowPassword(showPassword === id ? null : id);
	};

	const openDetails = (id: string) => {
		setShowDetails(id);
	};

	return (
		<div className='overflow-x-auto'>
			<table className='w-full border-collapse'>
				<thead>
					<tr className='border-b border-gray-200 dark:border-gray-700'>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Service
						</th>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Category
						</th>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Username
						</th>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Email
						</th>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Password
						</th>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Created
						</th>
						<th className='text-left p-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{credentials.map(credential => {
						const serviceConfig = getServiceConfig(credential.serviceName);
						const categoryColor = getCategoryColor(credential.category);

						return (
							<tr
								key={credential._id as string}
								className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
							>
								{/* Service */}
								<td className='p-2'>
									<div className='flex items-center gap-2'>
										<div className='text-sm'>{serviceConfig.icon}</div>
										<div>
											<div className='text-sm font-medium'>
												{credential.serviceName}
											</div>
											<div className='text-xs text-gray-500 truncate max-w-32'>
												{credential.serviceUrl}
											</div>
										</div>
									</div>
								</td>

								{/* Category */}
								<td className='p-2'>
									<Badge
										variant='secondary'
										className='text-xs'
										style={{
											backgroundColor: categoryColor + '20',
											color: categoryColor,
										}}
									>
										{credential.category}
									</Badge>
								</td>

								{/* Username */}
								<td className='p-2'>
									<div className='flex items-center gap-1'>
										<span className='text-sm font-mono truncate max-w-32'>
											{credential.username}
										</span>
										<CopyButton text={credential.username} label='' size='sm' />
									</div>
								</td>

								{/* Email */}
								<td className='p-2'>
									<div className='flex items-center gap-1'>
										<span className='text-sm font-mono truncate max-w-32'>
											{credential.email}
										</span>
										<CopyButton text={credential.email} label='' size='sm' />
									</div>
								</td>

								{/* Password */}
								<td className='p-2'>
									<div className='flex items-center gap-1'>
										<span className='text-sm font-mono'>
											{showPassword === credential._id
												? credential.password
												: '••••••••••••••••'}
										</span>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												togglePasswordVisibility(credential._id as string)
											}
											className='h-5 w-5 p-0'
										>
											{showPassword === credential._id ? (
												<EyeOff className='h-3 w-3' />
											) : (
												<Eye className='h-3 w-3' />
											)}
										</Button>
										<CopyButton text={credential.password} label='' size='sm' />
									</div>
								</td>

								{/* Created Date */}
								<td className='p-2'>
									<span className='text-xs text-gray-500'>
										{new Date(credential.createdAt).toLocaleDateString()}
									</span>
								</td>

								{/* Actions */}
								<td className='p-2'>
									<div className='flex items-center gap-1'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleLogin(credential.serviceUrl)}
											className='h-6 w-6 p-0'
											title='Login'
										>
											<ExternalLink className='h-3 w-3' />
										</Button>
										<Button
											variant='ghost'
											size='sm'
											onClick={() =>
												onTogglePin(
													credential._id as string,
													!credential.isPinned
												)
											}
											className='h-6 w-6 p-0'
											title={credential.isPinned ? 'Unpin' : 'Pin'}
										>
											{credential.isPinned ? (
												<Pin className='h-3 w-3' />
											) : (
												<PinOff className='h-3 w-3' />
											)}
										</Button>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => openDetails(credential._id as string)}
											className='h-6 w-6 p-0'
											title='Details'
										>
											<MoreHorizontal className='h-3 w-3' />
										</Button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* Details Dialogs */}
			{credentials.map(credential => (
				<CredentialDetailsDialog
					key={credential._id as string}
					credential={credential}
					open={showDetails === credential._id}
					onOpenChange={open => setShowDetails(open ? credential._id : null)}
					onEdit={onEdit}
					onDelete={onDelete}
					onTogglePin={onTogglePin}
				/>
			))}
		</div>
	);
}
