import { configureStore } from '@reduxjs/toolkit';
import { credentialsApi } from './api/credentialsApi';

// Configure the Redux store
export const store = configureStore({
	reducer: {
		// Add the credentials API reducer
		[credentialsApi.reducerPath]: credentialsApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(credentialsApi.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
