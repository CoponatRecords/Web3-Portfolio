"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCoins = exports.removeCoin = exports.addCoin = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
// Function to load coins from localStorage (if available)
var loadFromLocalStorage = function () {
    try {
        var storedCoins = localStorage.getItem('coins');
        if (storedCoins) {
            return JSON.parse(storedCoins);
        }
        return [];
    }
    catch (error) {
        return [];
    }
};
// Function to save coins to localStorage
var saveToLocalStorage = function (coins) {
    try {
        localStorage.setItem('coins', JSON.stringify(coins));
    }
    catch (error) {
        console.error("Couldn't save to localStorage", error);
    }
};
var initialState = {
    coins: loadFromLocalStorage(), // Load coins from localStorage if available
};
var coinListSlice = (0, toolkit_1.createSlice)({
    name: 'coinList',
    initialState: initialState,
    reducers: {
        addCoin: function (state, action) {
            var coin = action.payload.toLowerCase();
            var id = Date.now(); // Unique ID
            var coinExists = state.coins.some(function (item) { return item.coin === coin; });
            coinExists ? console.log("".concat(coin, " is already in")) : state.coins.push({ id: id, coin: coin });
            saveToLocalStorage(state.coins); // Save updated state to localStorage
            console.log('Coins added:', JSON.parse(JSON.stringify(state.coins))); // Log the updated coin list
        },
        removeCoin: function (state, action) {
            state.coins = state.coins.filter(function (coin) { return coin.id !== action.payload; });
            saveToLocalStorage(state.coins); // Save updated state to localStorage
            console.log('Coin removed:', JSON.parse(JSON.stringify(state.coins))); // Log the updated coin list
        },
        clearCoins: function (state) {
            state.coins = [];
            saveToLocalStorage(state.coins); // Save updated state to localStorage
            console.log('All coins removed:', JSON.parse(JSON.stringify(state.coins))); // Log the updated coin list
        },
    },
});
exports.addCoin = (_a = coinListSlice.actions, _a.addCoin), exports.removeCoin = _a.removeCoin, exports.clearCoins = _a.clearCoins;
exports.default = coinListSlice.reducer;
