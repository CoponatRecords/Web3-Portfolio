// portfolio-tools.tsx

import { lazy, LazyExoticComponent, FC, Dispatch, SetStateAction } from "react";
import tokenSwapCodeRaw from "./components/TokenSwap/TokenSwap.tsx?raw";
import SendUSDCPropsRaw from "./components/SendUSDCProps.tsx?raw";
import MyWalletRaw from "./components/MyWallet.tsx?raw";
import ReadATransactionRaw from "./components/ReadATransaction.tsx?raw";
import GraphACoinRaw from "./components/ChartComponent.tsx?raw";

// Define the shape of a tool
export type ToolDefinition = {
  id: PortfolioTool;
  name: string;
  description: string;
  component: LazyExoticComponent<FC<ToolComponentProps>> | null;
  code: string;
  link: null;
};

export type OtherWorksDefinition = {
  id: PortfolioTool;
  name: string;
  description: string;
  link: string;
  component: null;
};

export interface ToolComponentProps {
  expandedTool: PortfolioTool;
  handleToolClick: () => void;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>; // setAnchorEl can be null
  // Add any other common props your tools might need
}

// The same enum from your Home.js
export enum PortfolioTool {
  SEND = "send",
  GRAPH = "graph",
  SWAP = "swap",
  READ = "read",
  BALANCE = "balance",
  STUDIO_SITE = "studioSite",
  ATEM_MINI = "atemMini",
  SEAT_BOOKING = "seatBooking",
}

// --- Lazy load all your tool components ---
const TokenSwap = lazy(() => import("./components/TokenSwap/TokenSwap"));
const WalletBalance = lazy(() => import("./components/WalletBalance"));
const SendUSDC = lazy(() => import("./components/SendUSDCProps")); // Assuming this is your SendUSDC component
const ReadATransaction = lazy(() => import("./components/ReadATransaction"));
const GraphACoin = lazy(() => import("./components/GraphACoin"));

// --- Define your portfolio tools here ---
export const web3Tools: ToolDefinition[] = [
  {
    id: PortfolioTool.SWAP,
    name: "Token Swap DApp",
    description:
      "A simple interface to swap between two tokens using a DEX aggregator.",
    component: TokenSwap,
    code: tokenSwapCodeRaw,
    link: null,
  },
  {
    id: PortfolioTool.BALANCE,
    name: "Wallet Balance",
    description:
      "Connect your wallet to see your native and ERC20 token balances.",
    component: WalletBalance,
    code: MyWalletRaw,
    link: null,
  },
  {
    id: PortfolioTool.SEND,
    name: "Send USDC",
    description:
      "An interface to send a specified amount of cryptocurrency to an address.",
    component: SendUSDC,
    code: SendUSDCPropsRaw,
    link: null,
  },
  {
    id: PortfolioTool.READ,
    name: "Read Transaction",
    description:
      "Input a transaction hash to fetch and display its on-chain details.",
    component: ReadATransaction,
    code: ReadATransactionRaw,
    link: null,
  },
  {
    id: PortfolioTool.GRAPH,
    name: "Graph A Coin",
    description:
      "Visualizes real-time or historical price data for a selected cryptocurrency.",
    component: GraphACoin,
    code: GraphACoinRaw, // Example code
    link: null,
  },
];

export const otherWorks: OtherWorksDefinition[] = [
  {
    id: PortfolioTool.STUDIO_SITE,
    name: "Music Studio Site",
    description: "A responsive website for a local music recording studio.",
    link: "https://www.coponatrecords.com",
    component: null,
  },
  {
    id: PortfolioTool.ATEM_MINI,
    name: "ATEM Mini Control",
    description: "A python interface to control a Blackmagic Design ATEM Mini.",
    link: "https://github.com/CoponatRecords/AtemMini",
    component: null,
  },
  {
    id: PortfolioTool.SEAT_BOOKING,
    name: "Seat Booking System",
    description: "An application for booking event seats.",
    link: "https://ddfujb3ypq6p7.cloudfront.net/cortot", // Example link
    component: null,
  },
];
