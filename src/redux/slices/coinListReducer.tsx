import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CoinItem {
  id: number;
  coin: string;
}

interface CoinListState {
  coins: CoinItem[];
}

// Function to load coins from localStorage (if available)
const loadFromLocalStorage = (): CoinItem[] => {
  try {
    const storedCoins = localStorage.getItem('coins');
    if (storedCoins) {
      return JSON.parse(storedCoins);
    }
    return [];
  } catch (error) {
    console.log(`error ${error}`)
    return [];
  }
};

// Function to save coins to localStorage
const saveToLocalStorage = (coins: CoinItem[]): void => {
  try {
    localStorage.setItem('coins', JSON.stringify(coins));
  } catch (error) {
    console.error("Couldn't save to localStorage", error);
  }
};

const initialState: CoinListState = {
  coins: loadFromLocalStorage(), // Load coins from localStorage if available
};

const coinListSlice = createSlice({
  name: 'coinList',
  initialState,
  reducers: {
    addCoin: (state, action: PayloadAction<string>) => {
      const coin = action.payload.toLowerCase();
      const coinExists = state.coins.some((item) => item.coin === coin);

      if (!coinExists) {
        const id = Date.now();
        state.coins.push({ id, coin });
        saveToLocalStorage(state.coins);
      } else {
        console.info(`${coin} already exists in the list.`);
      }

      saveToLocalStorage(state.coins); // Save updated state to localStorage
      console.log('Coins added:', JSON.parse(JSON.stringify(state.coins))); // Log the updated coin list
    },
    removeCoin: (state, action: PayloadAction<number>) => {
      state.coins = state.coins.filter((coin) => coin.id !== action.payload);
      saveToLocalStorage(state.coins); // Save updated state to localStorage
      console.log('Coin removed:', JSON.parse(JSON.stringify(state.coins))); // Log the updated coin list
    },
    clearCoins: (state) => {
      state.coins = [];
      saveToLocalStorage(state.coins); // Save updated state to localStorage
      console.log('All coins removed:', JSON.parse(JSON.stringify(state.coins))); // Log the updated coin list
    },
  },
});

export const { addCoin, removeCoin, clearCoins } = coinListSlice.actions;

export default coinListSlice.reducer;

