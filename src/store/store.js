import { configureStore } from '@reduxjs/toolkit';
import medextReducer from './medextSlice';

export const store = configureStore({
  reducer: {
    medext: medextReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
