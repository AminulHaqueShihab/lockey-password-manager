'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CredentialCard from './CredentialCard';
import AddCredentialForm from './AddCredentialForm';
import { ICredential } from '@/models/Credential';
import { getCategories, getCategoryColor } from '@/lib/services';
import { useCredentials } from '@/hooks/useCredentials';

interface CredentialListProps {
	className?: string;
}

/**
 * CredentialList component displays all credentials with filtering,
 * search, and management capabilities
 */
export default function CredentialList({
	className = '',
}: CredentialListProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingCredential, setEditingCredential] =
		useState<ICredential | null>(null);

	// Custom hook for credential operations
	const {
		credentials,
		isLoading,
		isCreating,
		isUpdating,
		isDeleting,
		isTogglingPin,
		createCredential,
		updateCredential,
		deleteCredential,
		togglePin,
	} = useCredentials({
		category: selectedCategory !== 'all' ? selectedCategory : undefined,
		search: searchTerm || undefined,
	});

	const loading = isCreating || isUpdating || isDeleting || isTogglingPin;

	const categories = getCategories();

	// RTK Query handles filtering automatically through the query parameters
	const filteredCredentials = credentials;

	// Handle credential creation
	const handleCreateCredential = async (
		credentialData: Partial<ICredential>
	) => {
		const success = await createCredential(credentialData);
		if (success) {
			setShowAddForm(false);
		}
	};

	// Handle credential update
	const handleUpdateCredential = async (
		credentialData: Partial<ICredential>
	) => {
		if (!editingCredential) return;

		const success = await updateCredential(
			editingCredential._id as string,
			credentialData
		);
		if (success) {
			setEditingCredential(null);
		}
	};

	// Handle credential deletion
	const handleDeleteCredential = async (id: string) => {
		await deleteCredential(id);
	};

	// Handle pin toggle
	const handleTogglePin = async (id: string, isPinned: boolean) => {
		await togglePin(id, isPinned);
	};

	// Handle edit
	const handleEdit = (credential: ICredential) => {
		setEditingCredential(credential);
	};

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header with search and filters */}
			<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
				<div className='flex items-center gap-4 flex-1'>
					{/* Search */}
					<div className='relative flex-1 max-w-md'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
						<Input
							placeholder='Search credentials...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='pl-10'
						/>
					</div>

					{/* Category filter */}
					<div className='flex items-center gap-2'>
						<Filter className='h-4 w-4 text-gray-400' />
						<select
							value={selectedCategory}
							onChange={e => setSelectedCategory(e.target.value)}
							className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm'
						>
							<option value='all'>All Categories</option>
							{categories.map(category => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* View mode toggle and add button */}
				<div className='flex items-center gap-2'>
					<div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-md'>
						<Button
							variant={viewMode === 'grid' ? 'default' : 'ghost'}
							size='sm'
							onClick={() => setViewMode('grid')}
							className='rounded-r-none'
						>
							<Grid className='h-4 w-4' />
						</Button>
						<Button
							variant={viewMode === 'list' ? 'default' : 'ghost'}
							size='sm'
							onClick={() => setViewMode('list')}
							className='rounded-l-none'
						>
							<List className='h-4 w-4' />
						</Button>
					</div>

					<Button onClick={() => setShowAddForm(true)}>
						<Plus className='h-4 w-4 mr-2' />
						Add Credential
					</Button>
				</div>
			</div>

			{/* Results summary */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-gray-600 dark:text-gray-400'>
						{filteredCredentials.length} of {credentials.length} credentials
					</span>
					{(searchTerm || selectedCategory !== 'all') && (
						<Button
							variant='ghost'
							size='sm'
							onClick={() => {
								setSearchTerm('');
								setSelectedCategory('all');
							}}
							className='text-xs'
						>
							Clear filters
						</Button>
					)}
				</div>

				{/* Category badges */}
				{selectedCategory !== 'all' && (
					<Badge
						variant='secondary'
						style={{
							backgroundColor: getCategoryColor(selectedCategory) + '20',
							color: getCategoryColor(selectedCategory),
						}}
					>
						{selectedCategory}
					</Badge>
				)}
			</div>

			{/* Credentials grid/list */}
			{filteredCredentials.length === 0 ? (
				<div className='text-center py-12'>
					<div className='text-gray-400 mb-4'>
						{searchTerm || selectedCategory !== 'all' ? (
							<>
								<Search className='h-12 w-12 mx-auto mb-4' />
								<h3 className='text-lg font-medium mb-2'>
									No credentials found
								</h3>
								<p className='text-sm'>
									Try adjusting your search terms or category filter.
								</p>
							</>
						) : (
							<>
								<div className='text-4xl mb-4'>🔐</div>
								<h3 className='text-lg font-medium mb-2'>No credentials yet</h3>
								<p className='text-sm text-gray-500 mb-4'>
									Start by adding your first credential to the vault.
								</p>
								<Button onClick={() => setShowAddForm(true)}>
									<Plus className='h-4 w-4 mr-2' />
									Add Your First Credential
								</Button>
							</>
						)}
					</div>
				</div>
			) : (
				<div
					className={
						viewMode === 'grid'
							? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
							: 'space-y-4'
					}
				>
					{filteredCredentials.map(credential => (
						<CredentialCard
							key={credential._id as string}
							credential={credential}
							onEdit={handleEdit}
							onDelete={handleDeleteCredential}
							onTogglePin={handleTogglePin}
						/>
					))}
				</div>
			)}

			{/* Add/Edit Form */}
			<AddCredentialForm
				open={showAddForm || !!editingCredential}
				onOpenChange={open => {
					if (!open) {
						setShowAddForm(false);
						setEditingCredential(null);
					}
				}}
				onSubmit={
					editingCredential ? handleUpdateCredential : handleCreateCredential
				}
				credential={editingCredential || undefined}
				loading={loading}
			/>
		</div>
	);
}
