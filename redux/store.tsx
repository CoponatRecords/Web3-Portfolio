import { configureStore } from '@reduxjs/toolkit';
import priceReducer from './slices/priceSlice';

// Step 1: Configure the store
export const store = configureStore({
  reducer: {
    price: priceReducer,
  },
});

// Step 2: Define RootState and AppDispatch types for type inference
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
