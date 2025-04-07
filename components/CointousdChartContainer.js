"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CointousdChartContainer = CointousdChartContainer;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var material_1 = require("@mui/material");
var Close_1 = __importDefault(require("@mui/icons-material/Close"));
var ChartComponent_1 = __importDefault(require("../components/ChartComponent"));
var react_redux_1 = require("react-redux");
var coinListReducer_1 = require("../redux/slices/coinListReducer");
function CointousdChartContainer() {
    var dispatch = (0, react_redux_1.useDispatch)();
    var coinList = (0, react_redux_1.useSelector)(function (state) { return state.coinList.coins; }); // le retrigger est automatique
    var _a = (0, react_1.useState)(''), newCoin = _a[0], setNewCoin = _a[1];
    // Log coinList every time it changes
    (0, react_1.useEffect)(function () {
        console.log('Updated coinList:', JSON.parse(JSON.stringify(coinList)));
    }, [coinList]);
    var handleAddCoin = function () {
        if (newCoin.trim() !== '') {
            var coin = newCoin.toLowerCase();
            var newCoinComponent = {
                id: Date.now(),
                componentName: 'ChartComponent',
                coin: coin,
            };
            dispatch((0, coinListReducer_1.addCoin)(coin)); // add the component with coin symbol
            setNewCoin('');
        }
    };
    var handleRemove = function (idToRemove) {
        dispatch((0, coinListReducer_1.removeCoin)(idToRemove)); // Remove coin from the list
    };
    var componentsMap = {
        ChartComponent: ChartComponent_1.default, // Mapping the ChartComponent
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Container, { maxWidth: "lg", sx: { mt: 8 }, children: (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 4, children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { label: "Enter Coin Symbol", variant: "outlined", value: newCoin, onChange: function (e) { return setNewCoin(e.target.value); }, fullWidth: true }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", sx: { mt: 2 }, onClick: dispatch((0, coinListReducer_1.addCoin)(coin)), fullWidth: true, children: "Add Coin" })] }) }) }), (0, jsx_runtime_1.jsx)(material_1.Container, { maxWidth: "lg", sx: { mt: 8 }, children: coinList.map(function (coinItem) { return ((0, jsx_runtime_1.jsx)(material_1.Typography, { children: coinItem.coin.toUpperCase() }, coinItem.id)); }) }), (0, jsx_runtime_1.jsx)(material_1.Container, { maxWidth: "lg", sx: { mt: 8 }, children: (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 2, children: coinList.map(function (_a) {
                        var id = _a.id, coin = _a.coin;
                        var Component = componentsMap['ChartComponent']; // Dynamically use the correct component
                        return ((0, jsx_runtime_1.jsx)(material_1.Grid, { size: 12, children: (0, jsx_runtime_1.jsxs)(material_1.Card, { elevation: 6, sx: { borderRadius: 4, p: 2, position: 'relative' }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: function () { return handleRemove(id); }, sx: {
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            color: '#FF7F7F',
                                        }, children: (0, jsx_runtime_1.jsx)(Close_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.CardContent, { children: Component && (0, jsx_runtime_1.jsx)(Component, { coin: coin }) })] }) }, id));
                    }) }) })] }));
}
