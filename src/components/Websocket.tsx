import { useEffect, useRef, useState } from "react";

type CoinProps = {
  coin: string;
  onMessage: (message: unknown) => void;
};

const WebSocketComponent = ({ onMessage, coin }: CoinProps) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [, setStatus] = useState<string>("Connecting...");

  useEffect(() => {
    // Initialize WebSocket connection
    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        `wss://stream.binance.com:9443/ws/${coin}usdt@kline_1s`
      );
    }

    socketRef.current.onopen = () => {
      setStatus("Connected");
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    socketRef.current.onerror = (error) => {
      setStatus("Error");
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      setStatus("Closed");
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount;
  }, [coin, onMessage]); // Dependencies to ensure WebSocket reconnects when 'coin' changes

  return <></>;
};

export default WebSocketComponent;
