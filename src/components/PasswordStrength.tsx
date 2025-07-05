'use client';

import { calculatePasswordStrength } from '@/lib/encryption';

interface PasswordStrengthProps {
	password: string;
	className?: string;
}

/**
 * PasswordStrength component displays a visual strength meter
 * for the given password
 */
export default function PasswordStrength({
	password,
	className = '',
}: PasswordStrengthProps) {
	const strength = calculatePasswordStrength(password);

	// Determine strength level and colors
	const getStrengthInfo = (score: number) => {
		if (score >= 80) {
			return {
				level: 'Strong',
				color: 'bg-green-500',
				textColor: 'text-green-500',
				bgColor: 'bg-green-100 dark:bg-green-900/20',
			};
		} else if (score >= 60) {
			return {
				level: 'Good',
				color: 'bg-blue-500',
				textColor: 'text-blue-500',
				bgColor: 'bg-blue-100 dark:bg-blue-900/20',
			};
		} else if (score >= 40) {
			return {
				level: 'Fair',
				color: 'bg-yellow-500',
				textColor: 'text-yellow-500',
				bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
			};
		} else if (score >= 20) {
			return {
				level: 'Weak',
				color: 'bg-orange-500',
				textColor: 'text-orange-500',
				bgColor: 'bg-orange-100 dark:bg-orange-900/20',
			};
		} else {
			return {
				level: 'Very Weak',
				color: 'bg-red-500',
				textColor: 'text-red-500',
				bgColor: 'bg-red-100 dark:bg-red-900/20',
			};
		}
	};

	const strengthInfo = getStrengthInfo(strength);

	return (
		<div className={`space-y-2 ${className}`}>
			{/* Strength meter */}
			<div className='flex items-center gap-2'>
				<div className='flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
					<div
						className={`h-full transition-all duration-300 ease-out ${strengthInfo.color}`}
						style={{ width: `${strength}%` }}
					/>
				</div>
				<span className={`text-sm font-medium ${strengthInfo.textColor}`}>
					{strength}%
				</span>
			</div>

			{/* Strength level */}
			<div className='flex items-center justify-between'>
				<span className={`text-sm font-medium ${strengthInfo.textColor}`}>
					{strengthInfo.level}
				</span>

				{/* Strength indicators */}
				<div className='flex gap-1'>
					{[20, 40, 60, 80, 100].map(threshold => (
						<div
							key={threshold}
							className={`w-1 h-1 rounded-full ${
								strength >= threshold
									? strengthInfo.color
									: 'bg-gray-300 dark:bg-gray-600'
							}`}
						/>
					))}
				</div>
			</div>

			{/* Password requirements */}
			{password && (
				<div className='text-xs text-gray-500 dark:text-gray-400 space-y-1'>
					<div className='flex items-center gap-2'>
						<span
							className={
								password.length >= 8 ? 'text-green-500' : 'text-gray-400'
							}
						>
							{password.length >= 8 ? '✓' : '○'}
						</span>
						At least 8 characters
					</div>
					<div className='flex items-center gap-2'>
						<span
							className={
								/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-400'
							}
						>
							{/[a-z]/.test(password) ? '✓' : '○'}
						</span>
						Lowercase letter
					</div>
					<div className='flex items-center gap-2'>
						<span
							className={
								/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'
							}
						>
							{/[A-Z]/.test(password) ? '✓' : '○'}
						</span>
						Uppercase letter
					</div>
					<div className='flex items-center gap-2'>
						<span
							className={
								/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'
							}
						>
							{/[0-9]/.test(password) ? '✓' : '○'}
						</span>
						Number
					</div>
					<div className='flex items-center gap-2'>
						<span
							className={
								/[^A-Za-z0-9]/.test(password)
									? 'text-green-500'
									: 'text-gray-400'
							}
						>
							{/[^A-Za-z0-9]/.test(password) ? '✓' : '○'}
						</span>
						Special character
					</div>
				</div>
			)}
		</div>
	);
}
