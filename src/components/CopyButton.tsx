'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CopyButtonProps {
	text: string;
	label?: string;
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	className?: string;
	autoClearTimeout?: number;
}

/**
 * CopyButton component with auto-clear functionality
 * Copies text to clipboard and shows success feedback
 */
export default function CopyButton({
	text,
	label = 'Copy',
	variant = 'outline',
	size = 'sm',
	className = '',
	autoClearTimeout = 3000,
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);

			// Show success toast
			toast.success(`${label} copied to clipboard!`);

			// Auto-clear after timeout
			setTimeout(() => {
				setCopied(false);
			}, autoClearTimeout);
		} catch (error) {
			console.error('Failed to copy text:', error);
			toast.error('Failed to copy to clipboard');
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleCopy}
			className={`transition-all duration-200 ${className}`}
			disabled={copied}
		>
			{copied ? (
				<>
					<Check className='h-4 w-4 mr-2' />
					Copied!
				</>
			) : (
				<>
					<Copy className='h-4 w-4 mr-2' />
					{label}
				</>
			)}
		</Button>
	);
}
