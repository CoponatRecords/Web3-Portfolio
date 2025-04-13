import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const sendCoinSlice = createSlice({
  name: 'sendCoin',
  initialState: {amount:0,sender:'',receiver:''},
  reducers: {
    sendCoin: (state, action: PayloadAction<{ amount: number; sender: string; receiver: string }>) => {
      state.amount = action.payload.amount;
      state.sender = action.payload.sender;
      state.receiver = action.payload.receiver;
    },
  },
});

export const { sendCoin } = sendCoinSlice.actions;

export default sendCoinSlice.reducer;
