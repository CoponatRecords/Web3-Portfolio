import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SendingEthereum from '../../components/EthProvider';
interface CounterState {
  amount: number;
  sender: string;
  receiver: string;
}


const sendCoinSlice = createSlice({
  name: 'sendCoin',
  initialState: {amount:0,sender:'',receiver:''},
  reducers: {
    sendCoin: (state, action: PayloadAction<{ amount: number; sender: string; receiver: string }>) => {
      state.amount = action.payload.amount;
      state.sender = action.payload.sender;
      state.receiver = action.payload.receiver;

      console.log("sending a coin");
      console.log( 'reducer: ', state.amount, state.sender, state.receiver);
      SendingEthereum()

    },
  },
});

export const { sendCoin } = sendCoinSlice.actions;

export default sendCoinSlice.reducer;
