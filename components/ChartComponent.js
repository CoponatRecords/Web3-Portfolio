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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var chart_js_1 = require("chart.js");
var Websocket_1 = __importDefault(require("./Websocket"));
// Register chart.js components
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.LineElement, chart_js_1.PointElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
var ChartComponent = function (_a) {
    var coin = _a.coin;
    var chartRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)({
        labels: [],
        datasets: [
            {
                label: 'Price',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
            },
        ],
    }), chartData = _b[0], setChartData = _b[1];
    var handleWebSocketMessage = function (message) {
        var kline = message.k;
        var newData = {
            time: new Date(kline.t).toLocaleTimeString(),
            price: parseFloat(kline.c),
        };
        setChartData(function (prevData) {
            var newLabels = __spreadArray(__spreadArray([], prevData.labels, true), [newData.time], false);
            var newPrices = __spreadArray(__spreadArray([], prevData.datasets[0].data, true), [newData.price], false);
            // Limit to 1000 entries
            if (newLabels.length > 1000) {
                newLabels.shift();
                newPrices.shift();
            }
            return {
                labels: newLabels,
                datasets: [
                    __assign(__assign({}, prevData.datasets[0]), { data: newPrices }),
                ],
            };
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h2", { children: ["Live ", coin.toUpperCase(), "/USDT Chart"] }), (0, jsx_runtime_1.jsx)(react_chartjs_2_1.Line, { ref: chartRef, data: chartData }), (0, jsx_runtime_1.jsx)(Websocket_1.default, { onMessage: handleWebSocketMessage, coin: coin })] }));
};
exports.default = ChartComponent;
