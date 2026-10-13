import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';

/**
 * ============================================================================
 * BUỔI 3: REDUX TOOLKIT STORE CONFIGURATION
 * ============================================================================
 */

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  devTools: import.meta.env.DEV,
});

// Infer RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
