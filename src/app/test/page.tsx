'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store';
import { useGetProfileQuery } from '@/lib/api/authApi';
import { useGetCredentialsQuery } from '@/lib/api/credentialsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
	const [testResults, setTestResults] = useState<string[]>([]);
	const { token, isAuthenticated, user } = useAppSelector(state => state.auth);

	const {
		data: profileData,
		error: profileError,
		isLoading: profileLoading,
	} = useGetProfileQuery(undefined, {
		skip: !token,
	});

	const {
		data: credentialsData,
		error: credentialsError,
		isLoading: credentialsLoading,
	} = useGetCredentialsQuery(
		{},
		{
			skip: !token,
		}
	);

	const addResult = (message: string) => {
		setTestResults(prev => [
			...prev,
			`${new Date().toLocaleTimeString()}: ${message}`,
		]);
	};

	const runTests = () => {
		setTestResults([]);

		addResult('Starting authentication tests...');
		addResult(`Token exists: ${!!token}`);
		addResult(`Is authenticated: ${isAuthenticated}`);
		addResult(`User: ${user ? `${user.firstName} ${user.lastName}` : 'None'}`);

		if (profileLoading) {
			addResult('Profile loading...');
		} else if (profileError) {
			addResult(`Profile error: ${JSON.stringify(profileError)}`);
		} else if (profileData) {
			addResult('Profile loaded successfully');
		}

		if (credentialsLoading) {
			addResult('Credentials loading...');
		} else if (credentialsError) {
			addResult(`Credentials error: ${JSON.stringify(credentialsError)}`);
		} else if (credentialsData) {
			addResult(`Credentials loaded: ${credentialsData.data.length} items`);
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 p-8'>
			<div className='max-w-4xl mx-auto'>
				<Card>
					<CardHeader>
						<CardTitle>Authentication Test Page</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<h3 className='font-semibold mb-2'>Auth State</h3>
								<div className='space-y-1 text-sm'>
									<p>Token: {token ? '✅ Present' : '❌ Missing'}</p>
									<p>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
									<p>
										User: {user ? `${user.firstName} ${user.lastName}` : 'None'}
									</p>
								</div>
							</div>

							<div>
								<h3 className='font-semibold mb-2'>API Status</h3>
								<div className='space-y-1 text-sm'>
									<p>
										Profile:{' '}
										{profileLoading
											? '🔄 Loading'
											: profileError
											? '❌ Error'
											: profileData
											? '✅ Loaded'
											: '⏸️ Skipped'}
									</p>
									<p>
										Credentials:{' '}
										{credentialsLoading
											? '🔄 Loading'
											: credentialsError
											? '❌ Error'
											: credentialsData
											? '✅ Loaded'
											: '⏸️ Skipped'}
									</p>
								</div>
							</div>
						</div>

						<Button onClick={runTests} className='w-full'>
							Run Tests
						</Button>

						{testResults.length > 0 && (
							<div>
								<h3 className='font-semibold mb-2'>Test Results</h3>
								<div className='bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto'>
									{testResults.map((result, index) => (
										<div key={index} className='text-sm font-mono'>
											{result}
										</div>
									))}
								</div>
							</div>
						)}

						{profileError && (
							<div className='bg-red-50 border border-red-200 p-4 rounded-md'>
								<h3 className='font-semibold text-red-800 mb-2'>
									Profile Error
								</h3>
								<pre className='text-sm text-red-700 overflow-auto'>
									{JSON.stringify(profileError, null, 2)}
								</pre>
							</div>
						)}

						{credentialsError && (
							<div className='bg-red-50 border border-red-200 p-4 rounded-md'>
								<h3 className='font-semibold text-red-800 mb-2'>
									Credentials Error
								</h3>
								<pre className='text-sm text-red-700 overflow-auto'>
									{JSON.stringify(credentialsError, null, 2)}
								</pre>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
