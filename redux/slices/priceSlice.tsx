import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Step 1: Define the state shape
type PriceState = {
  binancePrice: number | null,
  bitgetPrice: number | null
}

// Step 2: Define the initial state
const initialState: PriceState = {
  binancePrice: null,
  bitgetPrice: null, 
};

// Step 3: Create the slice
const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    setBinancePrice: (state, action: PayloadAction<number>) => {
      state.binancePrice = action.payload;
    },
    setBitgetPrice: (state, action: PayloadAction<number>) => {
      state.bitgetPrice = action.payload;
    },
  },
});

// Step 4: Export actions
export const { setBinancePrice, setBitgetPrice } = priceSlice.actions;

// Step 5: Export the reducer
export default priceSlice.reducer;