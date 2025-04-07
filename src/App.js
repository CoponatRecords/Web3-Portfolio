"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
require("./App.css"); // Import the CSS file
var CointousdChartContainer_1 = require("../components/CointousdChartContainer");
var store_1 = require("../redux/store");
var react_redux_1 = require("react-redux");
var App = function () {
    return ((0, jsx_runtime_1.jsx)(react_redux_1.Provider, { store: store_1.store, children: (0, jsx_runtime_1.jsx)(CointousdChartContainer_1.CointousdChartContainer, {}) }));
};
exports.default = App;
