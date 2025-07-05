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
import { toast } from 'sonner';

interface CredentialListProps {
	credentials: ICredential[];
	onRefresh: () => void;
	className?: string;
}

/**
 * CredentialList component displays all credentials with filtering,
 * search, and management capabilities
 */
export default function CredentialList({
	credentials,
	onRefresh,
	className = '',
}: CredentialListProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingCredential, setEditingCredential] =
		useState<ICredential | null>(null);
	const [loading, setLoading] = useState(false);

	const categories = getCategories();

	// Filter credentials based on search and category
	const filteredCredentials = credentials.filter(credential => {
		const matchesSearch =
			searchTerm === '' ||
			credential.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			credential.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			credential.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory =
			selectedCategory === 'all' || credential.category === selectedCategory;

		return matchesSearch && matchesCategory;
	});

	// Handle credential creation
	const handleCreateCredential = async (
		credentialData: Partial<ICredential>
	) => {
		setLoading(true);
		try {
			const response = await fetch('/api/credentials', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentialData),
			});

			if (!response.ok) {
				throw new Error('Failed to create credential');
			}

			toast.success('Credential created successfully!');
			setShowAddForm(false);
			onRefresh();
		} catch (error) {
			console.error('Error creating credential:', error);
			toast.error('Failed to create credential');
		} finally {
			setLoading(false);
		}
	};

	// Handle credential update
	const handleUpdateCredential = async (
		credentialData: Partial<ICredential>
	) => {
		if (!editingCredential) return;

		setLoading(true);
		try {
			const response = await fetch(
				`/api/credentials/${editingCredential._id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(credentialData),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update credential');
			}

			toast.success('Credential updated successfully!');
			setEditingCredential(null);
			onRefresh();
		} catch (error) {
			console.error('Error updating credential:', error);
			toast.error('Failed to update credential');
		} finally {
			setLoading(false);
		}
	};

	// Handle credential deletion
	const handleDeleteCredential = async (id: string) => {
		if (
			!confirm(
				'Are you sure you want to delete this credential? This action cannot be undone.'
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/api/credentials/${id}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete credential');
			}

			toast.success('Credential deleted successfully!');
			onRefresh();
		} catch (error) {
			console.error('Error deleting credential:', error);
			toast.error('Failed to delete credential');
		}
	};

	// Handle pin toggle
	const handleTogglePin = async (id: string, isPinned: boolean) => {
		try {
			const credential = credentials.find(c => c._id === id);
			if (!credential) return;

			const response = await fetch(`/api/credentials/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...credential,
					isPinned,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update credential');
			}

			onRefresh();
		} catch (error) {
			console.error('Error toggling pin:', error);
			toast.error('Failed to update credential');
		}
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
							key={credential._id}
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
