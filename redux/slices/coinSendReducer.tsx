import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  amount: number;
  sender: string;
  receiver: string;
}

// Optionnel : charger depuis localStorage
const loadState = (): CounterState => {
  try {
    const serializedState = localStorage.getItem('sendCoinState');
    if (serializedState === null) {
      return {
        amount: 0,
        sender: '',
        receiver: '',
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return {
      amount: 0,
      sender: '',
      receiver: '',
    };
  }
};

const initialState: CounterState = loadState();

const sendCoinSlice = createSlice({
  name: 'sendCoin',
  initialState,
  reducers: {
    sendCoin: (state, action: PayloadAction<{ amount: number; sender: string; receiver: string }>) => {
      state.amount = action.payload.amount;
      state.sender = action.payload.sender;
      state.receiver = action.payload.receiver;

      console.log("sending a coin");
      console.log( state.amount, state.sender, state.receiver);

      // Optionnel : sauvegarde dans localStorage
      try {
        localStorage.setItem('sendCoinState', JSON.stringify(state));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
    },
  },
});

export const { sendCoin } = sendCoinSlice.actions;

export default sendCoinSlice.reducer;
