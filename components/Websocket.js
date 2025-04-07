"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var WebSocketComponent = function (_a) {
    var onMessage = _a.onMessage, coin = _a.coin;
    var socketRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)('Connecting...'), status = _b[0], setStatus = _b[1];
    (0, react_1.useEffect)(function () {
        // Initialize WebSocket connection
        if (!socketRef.current) {
            socketRef.current = new WebSocket("wss://stream.binance.com:9443/ws/".concat(coin, "usdt@kline_1s"));
        }
        socketRef.current.onopen = function () {
            setStatus('Connected');
            console.log('WebSocket connected');
        };
        socketRef.current.onmessage = function (event) {
            var message = JSON.parse(event.data);
            onMessage(message);
        };
        socketRef.current.onerror = function (error) {
            setStatus('Error');
            console.error('WebSocket error:', error);
        };
        socketRef.current.onclose = function () {
            setStatus('Closed');
            console.log('WebSocket connection closed');
        };
        // Cleanup on component unmount;
    }, [coin, onMessage]); // Dependencies to ensure WebSocket reconnects when 'coin' changes
    return (0, jsx_runtime_1.jsxs)("div", { children: ["Status: ", status] });
};
exports.default = WebSocketComponent;
