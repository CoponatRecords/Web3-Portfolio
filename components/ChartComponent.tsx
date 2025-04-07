import React, { useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import WebSocketComponent from './Websocket';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Define types for the chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}

// Define types for WebSocket message
interface WebSocketMessage {
  k: {
    t: number; // Timestamp
    c: string; // Closing price
  };
}

interface ChartComponentProps {
  coin: string;
}

const ChartComponent = ({ coin }: ChartComponentProps) => {
  // Type the ref as ChartJS instance for a line chart specifically
  const chartRef = useRef<ChartJS<'line', number[], string>>(null); // ChartJS ref for line chart

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Price',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
      },
    ],
  });

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    const kline = message.k;
    const newData = {
      time: new Date(kline.t).toLocaleTimeString(),  // Time formatted from timestamp
      price: parseFloat(kline.c),  // Closing price
    };

    setChartData((prevData) => {
      const newLabels = [...prevData.labels, newData.time];
      const newPriceData = [...prevData.datasets[0].data, newData.price];

      // Keep the chart data size within a limit (e.g., last 1000 entries)
      if (newLabels.length > 1000) {
        newLabels.shift();
        newPriceData.shift();
      }

      return {
        labels: newLabels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: newPriceData,
          },
        ],
      };
    });
  };

  console.log('coin ' + coin);

  return (
    <div>
      <h2>Live {coin.toUpperCase()}/USDT Chart</h2>
      <Line ref={chartRef} data={chartData} />
      <WebSocketComponent onMessage={handleWebSocketMessage} coin={coin} />
    </div>
  );
};

export default ChartComponent;
