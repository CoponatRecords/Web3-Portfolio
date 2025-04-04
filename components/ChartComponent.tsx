import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import WebSocketComponent from './Websocket';
import React from 'react';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  coin: string;
}

const ChartComponent = ({coin}: ChartComponentProps) => {
  const chartRef = useRef<any>(null);  // Ref for Chart.js
  const [chartData, setChartData] = useState<any>({
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

  const handleWebSocketMessage = (message: any) => {
    const kline = message.k;
    const newData = {
      time: new Date(kline.t).toLocaleTimeString(),  // Time formatted from timestamp
      price: parseFloat(kline.c),  // Closing price
    };

    setChartData((prevData: { labels: any; datasets: any[]; }) => {
      const newLabels = [...prevData.labels, newData.time];
      const newPriceData = [...prevData.datasets[0].data, newData.price];

      // Keep the chart data size within a limit (e.g., last 100 entries)
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
  console.log('coin '+coin)

  return (
<>

    <div>
      <h2>Live {coin.toUpperCase()}/USDT Chart</h2>
      <Line ref={chartRef} data={chartData} />
      <WebSocketComponent onMessage={handleWebSocketMessage}  coin={coin}  />
    </div>

    </>
  );
};

export default ChartComponent;
