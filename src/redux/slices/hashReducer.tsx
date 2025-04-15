import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HashState {
  myhash: `0x${string}` | null;
}

const initialState: HashState = {
  myhash: (() => {
    const stored = localStorage.getItem('hash');
    const parsed = stored ? JSON.parse(stored) : null;
    // Validate hash format
    return parsed && /^0x[a-fA-F0-9]{64}$/.test(parsed) ? parsed : null;
  })(),
};

const hashSlice = createSlice({
  name: 'hash',
  initialState,
  reducers: {
    setHash: (state, action: PayloadAction<`0x${string}`>) => {
      state.myhash = action.payload;
      saveToLocalStorage(state.myhash);
    },
  },
});

const saveToLocalStorage = (hash: `0x${string}` | null): void => {
  try {
    localStorage.setItem('hash', JSON.stringify(hash));
  } catch (error) {
    console.error("Couldn't save to localStorage", error);
  }
};

export const { setHash } = hashSlice.actions;
export default hashSlice.reducer;