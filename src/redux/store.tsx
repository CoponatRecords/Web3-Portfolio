import { configureStore } from "@reduxjs/toolkit";
import coinListReducer from "./slices/coinListReducer";
import coinSendReducer from "./slices/coinSendReducer";
import hashReducer from "./slices/hashReducer";
import { swapApi } from "./slices/swapSlice";

// Step 1: Configure the store
export const store = configureStore({
  reducer: {
    coinList: coinListReducer,
    coindSend: coinSendReducer, // Note: Typo in 'coindSend' - should be 'coinSend'?
    hash: hashReducer,
    [swapApi.reducerPath]: swapApi.reducer, // Add RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(swapApi.middleware), // Add RTK Query middleware
});

// Step 2: Define RootState and AppDispatch types for type inference
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
