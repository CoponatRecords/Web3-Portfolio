import { configureStore } from "@reduxjs/toolkit";
import coinListReducer from "./slices/coinListReducer";
import coinSendReducer from "./slices/coinSendReducer";
import hashReducer from "./slices/hashReducer";

// Step 1: Configure the store
export const store = configureStore({
  reducer: {
    coinList: coinListReducer,
    coindSend: coinSendReducer,
    hash: hashReducer,

  },
});

// Step 2: Define RootState and AppDispatch types for type inference
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
