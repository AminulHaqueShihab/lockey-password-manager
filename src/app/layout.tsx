import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Password Manager - Secure Vault',
	description: 'A secure, cross-platform password manager with AES encryption',
	keywords: ['password manager', 'security', 'encryption', 'vault'],
	authors: [{ name: 'Password Manager Team' }],
	viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='dark'>
			<body className={`${geist.variable} ${geistMono.variable} antialiased`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
