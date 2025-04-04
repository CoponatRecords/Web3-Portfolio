import { useEffect, useRef, useState } from 'react';

const WebSocketComponent = ({ onMessage }: { onMessage: (message: any) => void }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<string>('Connecting...');

  useEffect(() => {
    // Initialize WebSocket connection


    if (!socketRef.current) {
    
    socketRef.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');  }

    socketRef.current.onopen = () => {
      setStatus('Connected');
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    socketRef.current.onerror = (error) => {
      setStatus('Error');
      console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
      setStatus('Closed');
      console.log('WebSocket connection closed');
    };

    // Cleanup on component unmount
    return () => {

    };
  }, [onMessage]);

  return <div>Status: {status}</div>;
};

export default WebSocketComponent;