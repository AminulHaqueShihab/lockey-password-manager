import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/components/Providers';

const geist = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Lockey- Password Manager',
	description:
		'A secure, cross-platform password manager with AES encryption. Lockey is a password manager that allows you to store your passwords in a secure and encrypted way.',
	keywords: ['password manager', 'security', 'encryption', 'vault', 'lockey'],
	authors: [{ name: 'Lockey Team' }],
	viewport: 'width=device-width, initial-scale=1',
	icons: {
		icon: '/favicon.ico',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='dark'>
			<body className={`${geist.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
