"use client"; // Ensures the component is rendered on the client side in Next.js

// faire ca avec wagmi sans viem

// Imports
import { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Card,
  CardHeader,
  Collapse,
  CardContent,
} from "@mui/material"; // UI components from Material UI
import { useAccount, useWriteContract } from "wagmi"; // Wagmi hooks for Ethereum wallet/account data
import { erc20Abi, parseUnits, createPublicClient, http } from "viem"; // ERC20 ABI and utility to convert amounts to token units
import { motion } from "framer-motion"; // Animation library
import { useGetSwapQuoteQuery } from "../redux/slices/swapSlice"; // Custom Redux hook to fetch swap quotes from 0x
import { isAddress } from "ethers"; // Address validation function
import { arbitrum } from "wagmi/chains"; // Import Arbitrum chain data

// ERC20 ABI constant
const ERC20_ABI = erc20Abi;

// Component Props interface
interface TokenSwapProps {
  expandedTool: "send" | "read" | "graph" | "swap" | null;
  handleToolClick: (tool: "send" | "read" | "graph" | "swap") => void;
}

// Main TokenSwap component
const TokenSwap: React.FC<TokenSwapProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  const { address } = useAccount(); // Get user's connected wallet address
  const publicClient = createPublicClient({
    chain: arbitrum, // Ensure you're using the Arbitrum chain
    transport: http("https://arb1.arbitrum.io/rpc"), // Arbitrum RPC URL
  }); // Client to read from blockchain
  const [sellToken, setSellToken] = useState(
    "0x068DEf65B9dbAFf02b4ee54572a9Fa7dFb188EA3"
  ); // Token user wants to sell
  const [buyToken, setBuyToken] = useState(
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
  ); // Token user wants to buy
  const [sellAmount, setSellAmount] = useState("0.001"); // Amount to sell
  const [status, setStatus] = useState(""); // UI status message

  const { writeContractAsync } = useWriteContract(); // Contract write function

  // Map token symbols to their decimals (needed for parseUnits)
  const decimalsMap: Record<string, number> = {
    USDC: 6,
    USDT: 6,
    DAI: 18,
  };

  const decimals = decimalsMap[sellToken] || 18; // Default to 18 if unknown
  const amountInUnits = parseUnits(sellAmount, decimals); // Convert amount to base units

  // Fetch swap quote using Redux query (with skip if invalid)
  const {
    data: quote,
    isLoading,
    error,
  } = useGetSwapQuoteQuery(
    {
      sellToken,
      buyToken,
      sellAmount: amountInUnits.toString(),
      takerAddress: address, // Pass a fallback if address is not available
    },
    {
      skip: !address || !sellAmount || parseFloat(sellAmount) <= 0,
    }
  );

  // Function to validate token and address
  const isValidAddress = (addr: string) => {
    return isAddress(addr);
  };

  // Function to approve ERC20 if needed and send the swap transaction
  const handleApproveAndSwap = async () => {
    // Validate the user's address
    if (!address || !isValidAddress(address)) {
      setStatus("Invalid wallet address");
      return;
    }

    // Validate token addresses
    if (!isValidAddress(sellToken)) {
      setStatus("Invalid sell token address");
      return;
    }

    if (!isValidAddress(buyToken)) {
      setStatus("Invalid buy token address");
      return;
    }

    if (!quote) {
      setStatus("No quote available");
      return;
    }

    setStatus("Processing swap...");
    console.log("Processing Swap");

    try {
      console.log(quote);

      // Ensure quote is not null and has the expected structure
      if (quote && quote.issues && quote.issues.allowance) {
        const allowanceTarget = quote.issues.allowance.spender;
        if (allowanceTarget) {
          console.log("Allowance Target:", allowanceTarget);

          // 1. Check current allowance
          let allowance: bigint = 0n;

          // Skip allowance check for ETH (ETH doesn't require allowance)
          if (sellToken !== "0xEeeeeEeeeEeEeeEeEeEeeEeEeEeeEeEeEeEeeEe") {
            allowance = await publicClient.readContract({
              address: sellToken as `0x${string}`,
              abi: ERC20_ABI,
              functionName: "allowance",
              args: [address, allowanceTarget],
            });
            console.log("Allowance checked:", allowance.toString());
          } else {
            console.log("ETH does not require allowance");
          }

          // 2. Approve the contract to spend tokens if necessary
          if (BigInt(allowance) < amountInUnits) {
            setStatus("Approving token...");
            console.log("Approving token...");

            // Call the approve function for the ERC20 token
            await writeContractAsync({
              address: sellToken as `0x${string}`,
              abi: ERC20_ABI,
              functionName: "approve",
              args: [allowanceTarget, amountInUnits],
              account: address!,
              chain: arbitrum, // Specify Arbitrum chain here
            });
            setStatus("Token approved");
            console.log("Token Approved");
          }
        } else {
          setStatus("No allowance spender found in the quote.");
        }
      } else {
        setStatus("Quote is invalid or incomplete.");
      }

      // 3. Send the swap transaction (via MetaMask)
      setStatus("Sending swap transaction...");
      console.log("Sending swap transaction...");

      // const tx = await writeContractAsync({
      //   address: quote.transaction.to, // address contract 0X
      //   abi: ERC20_ABI,
      //   functionName: "swap",
      //   args: [sellCoin, buyCoin],
      //   account: address,
      //   chain: arbitrum, // Specify Arbitrum chain here
      // });

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to: quote.transaction.to,
            data: quote.data,
            value: quote.value,
            gas: quote.gas?.toString(),
          },
        ],
      });

      setStatus(`Transaction sent! Hash: ${tx}`);
      console.log("hash :", tx);
    } catch (err) {
      console.error(err);
      setStatus("Error during swap.");
    }
  };

  // Render UI
  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 4,
        boxShadow: expandedTool === "swap" ? 6 : 3,
        transform: expandedTool === "swap" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        zIndex: expandedTool === "swap" ? 2 : 1,
        cursor: "pointer",
        width: { xs: "100%", sm: "400px" },
        "&:hover": {
          transform: expandedTool !== "swap" ? "scale(1.05)" : "scale(1.02)",
        },
      }}
      onClick={() => handleToolClick("swap")} // Expand on click
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
            }}
          >
            Token Swap
          </Typography>
        }
      />
      <Collapse in={expandedTool === "swap"}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
            <Stack spacing={2}>
              <TextField
                label="Sell Token"
                value={sellToken}
                onChange={(e) => setSellToken(e.target.value)}
              />
              <TextField
                label="Buy Token"
                value={buyToken}
                onChange={(e) => setBuyToken(e.target.value)}
              />
              <TextField
                label="Amount"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
              <Button
                onClick={handleApproveAndSwap}
                disabled={isLoading || !address || !quote}
                variant="contained"
              >
                {isLoading ? "Fetching Quote..." : "Swap via 0x"}
              </Button>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {status || (error && `Error: ${error}`)}
              </Typography>
            </Stack>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default TokenSwap;
