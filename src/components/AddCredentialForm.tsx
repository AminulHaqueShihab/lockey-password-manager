'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import PasswordStrength from './PasswordStrength';
import { generatePassword, calculatePasswordStrength } from '@/lib/encryption';
import { getCategories, getServiceConfig } from '@/lib/services';
import { ICredential } from '@/models/Credential';

interface AddCredentialFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (credential: Partial<ICredential>) => void;
	credential?: ICredential; // For editing mode
	loading?: boolean;
}

/**
 * AddCredentialForm component for creating and editing credentials
 */
export default function AddCredentialForm({
	open,
	onOpenChange,
	onSubmit,
	credential,
	loading = false,
}: AddCredentialFormProps) {
	const isEditing = !!credential;
	const categories = getCategories();

	// Form state
	const [formData, setFormData] = useState({
		serviceName: '',
		serviceUrl: '',
		username: '',
		email: '',
		password: '',
		category: 'General',
		isPinned: false,
		twoFactorSecret: '',
		notes: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [passwordLength, setPasswordLength] = useState(16);
	const [includeSpecialChars, setIncludeSpecialChars] = useState(true);

	// Reset form when dialog opens/closes or when editing
	useEffect(() => {
		if (open) {
			if (isEditing && credential) {
				setFormData({
					serviceName: credential.serviceName,
					serviceUrl: credential.serviceUrl,
					username: credential.username,
					email: credential.email,
					password: credential.password,
					category: credential.category,
					isPinned: credential.isPinned,
					twoFactorSecret: credential.twoFactorSecret || '',
					notes: credential.notes || '',
				});
			} else {
				setFormData({
					serviceName: '',
					serviceUrl: '',
					username: '',
					email: '',
					password: '',
					category: 'General',
					isPinned: false,
					twoFactorSecret: '',
					notes: '',
				});
			}
		}
	}, [open, isEditing, credential]);

	const handleInputChange = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const handleGeneratePassword = () => {
		const newPassword = generatePassword(passwordLength, includeSpecialChars);
		setFormData(prev => ({ ...prev, password: newPassword }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate required fields
		if (
			!formData.serviceName ||
			!formData.serviceUrl ||
			!formData.username ||
			!formData.email ||
			!formData.password
		) {
			return;
		}

		onSubmit(formData);
	};

	const handleServiceNameChange = (value: string) => {
		setFormData(prev => ({ ...prev, serviceName: value }));

		// Auto-suggest URL based on service name
		const serviceConfig = getServiceConfig(value);
		if (serviceConfig.url && !formData.serviceUrl) {
			setFormData(prev => ({ ...prev, serviceUrl: serviceConfig.url }));
		}
	};

	const passwordStrength = calculatePasswordStrength(formData.password);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Credential' : 'Add New Credential'}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? 'Update your credential information below.'
							: 'Add a new credential to your vault. All sensitive data will be encrypted.'}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Service Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='serviceName'>Service Name *</Label>
							<Input
								id='serviceName'
								value={formData.serviceName}
								onChange={e => handleServiceNameChange(e.target.value)}
								placeholder='e.g., Discord, GitHub'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='serviceUrl'>Service URL *</Label>
							<Input
								id='serviceUrl'
								type='url'
								value={formData.serviceUrl}
								onChange={e => handleInputChange('serviceUrl', e.target.value)}
								placeholder='https://example.com'
								required
							/>
						</div>
					</div>

					{/* Login Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='username'>Username *</Label>
							<Input
								id='username'
								value={formData.username}
								onChange={e => handleInputChange('username', e.target.value)}
								placeholder='Enter username'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='email'>Email *</Label>
							<Input
								id='email'
								type='email'
								value={formData.email}
								onChange={e => handleInputChange('email', e.target.value)}
								placeholder='Enter email'
								required
							/>
						</div>
					</div>

					{/* Password Section */}
					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password *</Label>
							<div className='flex items-center gap-2'>
								<div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md flex-1'>
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										value={formData.password}
										onChange={e =>
											handleInputChange('password', e.target.value)
										}
										placeholder='Enter password'
										className='border-0 bg-transparent p-0 focus-visible:ring-0'
										required
									/>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => setShowPassword(!showPassword)}
										className='h-6 w-6 p-0'
									>
										{showPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</Button>
								</div>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={handleGeneratePassword}
								>
									<RefreshCw className='h-4 w-4 mr-1' />
									Generate
								</Button>
							</div>
						</div>

						{/* Password Generator Options */}
						<div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3'>
							<h4 className='font-medium text-sm'>Password Generator</h4>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='passwordLength'>Length</Label>
									<Input
										id='passwordLength'
										type='number'
										min='8'
										max='64'
										value={passwordLength}
										onChange={e =>
											setPasswordLength(parseInt(e.target.value) || 16)
										}
										className='w-full'
									/>
								</div>
								<div className='flex items-center space-x-2'>
									<Switch
										id='specialChars'
										checked={includeSpecialChars}
										onCheckedChange={setIncludeSpecialChars}
									/>
									<Label htmlFor='specialChars'>
										Include special characters
									</Label>
								</div>
							</div>
						</div>

						{/* Password Strength */}
						<PasswordStrength password={formData.password} />
					</div>

					{/* Additional Options */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='category'>Category</Label>
							<select
								id='category'
								value={formData.category}
								onChange={e => handleInputChange('category', e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800'
							>
								{categories.map(category => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>

						<div className='flex items-center space-x-2'>
							<Switch
								id='isPinned'
								checked={formData.isPinned}
								onCheckedChange={checked =>
									handleInputChange('isPinned', checked)
								}
							/>
							<Label htmlFor='isPinned'>Pin to top</Label>
						</div>
					</div>

					{/* 2FA Secret */}
					<div className='space-y-2'>
						<Label htmlFor='twoFactorSecret'>2FA Secret (Optional)</Label>
						<div className='flex items-center gap-2'>
							<div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md flex-1'>
								<Input
									id='twoFactorSecret'
									type={showTwoFactor ? 'text' : 'password'}
									value={formData.twoFactorSecret}
									onChange={e =>
										handleInputChange('twoFactorSecret', e.target.value)
									}
									placeholder='Enter 2FA secret key'
									className='border-0 bg-transparent p-0 focus-visible:ring-0'
								/>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									onClick={() => setShowTwoFactor(!showTwoFactor)}
									className='h-6 w-6 p-0'
								>
									{showTwoFactor ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Notes */}
					<div className='space-y-2'>
						<Label htmlFor='notes'>Notes (Optional)</Label>
						<Textarea
							id='notes'
							value={formData.notes}
							onChange={e => handleInputChange('notes', e.target.value)}
							placeholder='Add any additional notes...'
							rows={3}
						/>
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={loading}>
							{loading ? (
								<>
									<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
									{isEditing ? 'Updating...' : 'Creating...'}
								</>
							) : (
								<>
									<Plus className='h-4 w-4 mr-2' />
									{isEditing ? 'Update Credential' : 'Add Credential'}
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
