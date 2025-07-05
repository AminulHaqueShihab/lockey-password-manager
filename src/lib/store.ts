import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { credentialsApi } from './api/credentialsApi';
import { authApi, User } from './api/authApi';

// Auth slice for managing authentication state
interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

const getInitialAuthState = (): AuthState => {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('authToken');
		return {
			user: null,
			token,
			isAuthenticated: !!token,
		};
	}
	return {
		user: null,
		token: null,
		isAuthenticated: false,
	};
};

const authSlice = createSlice({
	name: 'auth',
	initialState: getInitialAuthState(),
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: User; token: string }>
		) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			if (typeof window !== 'undefined') {
				localStorage.setItem('authToken', action.payload.token);
			}
		},
		logout: state => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			if (typeof window !== 'undefined') {
				localStorage.removeItem('authToken');
			}
		},
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
	},
});

export const { setCredentials, logout, setUser } = authSlice.actions;

// Configure the Redux store
export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		// Add the APIs reducers
		[credentialsApi.reducerPath]: credentialsApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			credentialsApi.middleware,
			authApi.middleware
		),
	devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for use in components
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
