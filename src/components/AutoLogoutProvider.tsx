'use client';

import { useEffect, useRef } from 'react';
import {
	useAppDispatch,
	useAppSelector,
	logoutAndResetCache,
} from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AutoLogoutProviderProps {
	children: React.ReactNode;
	timeoutMs?: number;
}

export default function AutoLogoutProvider({
	children,
	timeoutMs = 5 * 60 * 1000,
}: AutoLogoutProviderProps) {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { isAuthenticated } = useAppSelector(state => state.auth);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Reset the inactivity timer
	const resetTimer = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		if (!isAuthenticated) return;
		timerRef.current = setTimeout(() => {
			dispatch(logoutAndResetCache());
			toast('You have been logged out due to inactivity.');
			router.push('/auth');
		}, timeoutMs);
	};

	useEffect(() => {
		if (!isAuthenticated) return;
		// List of events that indicate user activity
		const events = [
			'mousemove',
			'mousedown',
			'keydown',
			'touchstart',
			'scroll',
		];
		events.forEach(event => window.addEventListener(event, resetTimer));
		resetTimer(); // Start timer on mount
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			events.forEach(event => window.removeEventListener(event, resetTimer));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated]);

	return <>{children}</>;
}
