import React, { useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import WebSocketComponent from "./Websocket";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Define types for the chart data
type ChartData = {
  labels: string[];
  datasets: {
    borderWidth: number;
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
    pointRadius: number;
  }[];
};

// Define types for WebSocket message
type WebSocketMessage = {
  k: {
    t: number; // Timestamp
    c: string; // Closing price
  };
};

type ChartComponentProps = {
  coin: string;
};

const ChartComponent = ({ coin }: ChartComponentProps) => {
  // Type the ref as ChartJS instance for a line chart specifically
  const chartRef = useRef<ChartJS<"line", number[], string>>(null); // ChartJS ref for line chart

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        pointRadius: 0,
        borderWidth: 1,
        label: "",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
    ],
  });

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    const kline = message.k;
    const newData = {
      time: new Date(kline.t).toLocaleTimeString(), // Time formatted from timestamp
      price: parseFloat(kline.c), // Closing price
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

  return (
    <div>
      <h5>Live {coin.toUpperCase()}/USD</h5>
      <Line
        ref={chartRef}
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false, // 👈 removes the square and label above the chart
            },
          },
        }}
      />
      <WebSocketComponent onMessage={handleWebSocketMessage} coin={coin} />
    </div>
  );
};

export default ChartComponent;
