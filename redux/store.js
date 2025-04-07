"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var coinListReducer_1 = __importDefault(require("./slices/coinListReducer"));
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        coinList: coinListReducer_1.default,
    }
});
var initialState = { value: 0 };
function counterReducer(state, action) {
    if (state === void 0) { state = initialState; }
    // Check to see if the reducer cares about this action
    if (action.type === 'counter/increment') {
        // If so, make a copy of `state`
        return __assign(__assign({}, state), { 
            // and update the copy with the new value
            value: state.value + 1 });
    }
    // otherwise return the existing state unchanged
    return state;
}
