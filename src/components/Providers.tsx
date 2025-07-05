'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';

interface ProvidersProps {
	children: React.ReactNode;
}

/**
 * Providers component wraps the app with Redux store
 */
export default function Providers({ children }: ProvidersProps) {
	return <Provider store={store}>{children}</Provider>;
}
