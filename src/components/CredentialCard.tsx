'use client';

import { useState } from 'react';
import { Pin, PinOff, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CopyButton from './CopyButton';
import CredentialDetailsDialog from './CredentialDetailsDialog';
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
 * CredentialCard component displays a compact credential card with
 * basic info and a "See Details" button to open full details dialog
 */
export default function CredentialCard({
	credential,
	onEdit,
	onDelete,
	onTogglePin,
	className = '',
}: CredentialCardProps) {
	const [showDetails, setShowDetails] = useState(false);

	const serviceConfig = getServiceConfig(credential.serviceName);
	const categoryColor = getCategoryColor(credential.category);

	const handleLogin = () => {
		window.open(credential.serviceUrl, '_blank');
	};

	return (
		<>
			<Card
				className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}
			>
				{/* Service header with gradient background */}
				<CardHeader
					className={`bg-gradient-to-r ${serviceConfig.gradient} text-white p-2`}
					style={{
						background: `linear-gradient(135deg, ${serviceConfig.color}, ${serviceConfig.color}dd)`,
					}}
				>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-1'>
							<div className='text-sm'>{serviceConfig.icon}</div>
							<div>
								<h3 className='font-semibold text-xs'>
									{credential.serviceName}
								</h3>
							</div>
						</div>

						{/* Pin toggle */}
						<Button
							variant='ghost'
							size='sm'
							onClick={() =>
								onTogglePin(credential._id as string, !credential.isPinned)
							}
							className='text-white hover:bg-white/20 h-5 w-5 p-0'
						>
							{credential.isPinned ? (
								<Pin className='h-3 w-3' />
							) : (
								<PinOff className='h-3 w-3' />
							)}
						</Button>
					</div>
				</CardHeader>

				<CardContent className='p-2 space-y-1'>
					{/* Category badge */}
					<div className='flex items-center justify-between'>
						<Badge
							variant='secondary'
							className='text-xs px-1 py-0'
							style={{
								backgroundColor: categoryColor + '20',
								color: categoryColor,
							}}
						>
							{credential.category}
						</Badge>

						{/* Quick actions */}
						<div className='flex items-center gap-1'>
							<Button
								variant='ghost'
								size='sm'
								onClick={handleLogin}
								className='h-5 w-5 p-0'
							>
								<ExternalLink className='h-3 w-3' />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setShowDetails(true)}
								className='h-5 w-5 p-0'
							>
								<MoreHorizontal className='h-3 w-3' />
							</Button>
						</div>
					</div>

					{/* Compact credential info */}
					<div className='space-y-0.5'>
						{/* Username */}
						<div className='flex items-center gap-1'>
							<span className='text-xs text-gray-600 dark:text-gray-400 w-10'>
								User:
							</span>
							<span className='text-xs font-mono flex-1 truncate'>
								{credential.username}
							</span>
							<CopyButton text={credential.username} label='' size='sm' />
						</div>

						{/* Email */}
						<div className='flex items-center gap-1'>
							<span className='text-xs text-gray-600 dark:text-gray-400 w-10'>
								Email:
							</span>
							<span className='text-xs font-mono flex-1 truncate'>
								{credential.email}
							</span>
							<CopyButton text={credential.email} label='' size='sm' />
						</div>

						{/* Password */}
						<div className='flex items-center gap-1'>
							<span className='text-xs text-gray-600 dark:text-gray-400 w-10'>
								Pass:
							</span>
							<span className='text-xs font-mono flex-1'>••••••••••••••••</span>
							<CopyButton text={credential.password} label='' size='sm' />
						</div>
					</div>

					{/* Quick action buttons */}
					<div className='flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setShowDetails(true)}
							className='text-xs h-6 px-2'
						>
							Details
						</Button>

						<div className='text-xs text-gray-500'>
							{new Date(credential.createdAt).toLocaleDateString()}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Details Dialog */}
			<CredentialDetailsDialog
				credential={credential}
				open={showDetails}
				onOpenChange={setShowDetails}
				onEdit={onEdit}
				onDelete={onDelete}
				onTogglePin={onTogglePin}
			/>
		</>
	);
}
