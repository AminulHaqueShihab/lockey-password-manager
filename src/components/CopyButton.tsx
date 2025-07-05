'use client';

import { Copy } from 'lucide-react';
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
}

/**
 * CopyButton component that copies text to clipboard and shows toast notification
 */
export default function CopyButton({
	text,
	label = 'Copy',
	variant = 'outline',
	size = 'sm',
	className = '',
}: CopyButtonProps) {
	const handleCopy = async () => {
		try {
			// Check if clipboard API is available
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				// Fallback for older browsers or when clipboard API is not available
				const textArea = document.createElement('textarea');
				textArea.value = text;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}

			// Show success toast
			toast.success(`${label} copied to clipboard!`);
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
		>
			<Copy className='h-4 w-4 mr-2' />
			{label}
		</Button>
	);
}
