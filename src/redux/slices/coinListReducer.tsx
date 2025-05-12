import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CoinItem = {
  id: number;
  coin: string;
};

type CoinListState = {
  coins: CoinItem[];
};

// Function to load coins from localStorage
const loadFromLocalStorage = (): CoinItem[] => {
  try {
    const storedCoins = localStorage.getItem("coins");
    if (storedCoins) {
      const parsedCoins = JSON.parse(storedCoins);
      // Validate that parsedCoins is an array of CoinItem
      if (
        Array.isArray(parsedCoins) &&
        parsedCoins.every(
          (item) => typeof item.id === "number" && typeof item.coin === "string"
        )
      ) {
        return parsedCoins;
      }
    }
    return [];
  } catch (error) {
    console.warn(`Error loading from localStorage: ${error}`);
    return [];
  }
};

// Function to save coins to localStorage
const saveToLocalStorage = (coins: CoinItem[]): void => {
  try {
    localStorage.setItem("coins", JSON.stringify(coins));
  } catch (error) {
    console.error("Couldn't save to localStorage", error);
  }
};

// Define the default coin (Bitcoin, compatible with CoinItem)
const defaultCoin: CoinItem = {
  id: Date.now(), // Generate unique ID // Use a fixed number for the default coin
  coin: "btc",
};

// Define the initial state
const initialCoins = (() => {
  const storedCoins = loadFromLocalStorage();
  if (Array.isArray(storedCoins) && storedCoins.length > 0) {
    return storedCoins;
  } else {
    saveToLocalStorage([defaultCoin]); // ✅ Save default to localStorage
    return [defaultCoin];
  }
})();

const initialState: CoinListState = {
  coins: initialCoins,
};

const coinListSlice = createSlice({
  name: "coinList",
  initialState,
  reducers: {
    addCoin: (state, action: PayloadAction<string>) => {
      const coin = action.payload.toLowerCase();
      const coinExists = state.coins.some((item) => item.coin === coin);

      if (!coinExists) {
        const id = Date.now(); // Generate unique ID
        state.coins.push({ id, coin });
      } else {
        console.info(`${coin} already exists in the list.`);
      }

      saveToLocalStorage(state.coins); // Save updated state to localStorage
      console.log("Coins added:", state.coins); // Log the updated coin list
    },
    removeCoin: (state, action: PayloadAction<number>) => {
      state.coins = state.coins.filter((coin) => coin.id !== action.payload);
      saveToLocalStorage(state.coins); // Save updated state to localStorage
      console.log("Coin removed:", state.coins); // Log the updated coin list
    },
    clearCoins: (state) => {
      state.coins = [defaultCoin]; // Reset to default coin instead of empty
      saveToLocalStorage(state.coins); // Save updated state to localStorage
      console.log("Coins reset to default:", state.coins); // Log the updated coin list
    },
  },
});

export const { addCoin, removeCoin, clearCoins } = coinListSlice.actions;

export default coinListSlice.reducer;
