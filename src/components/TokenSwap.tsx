"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Card,
  CardHeader,
  Collapse,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { useAccount, usePublicClient } from "wagmi";
import { erc20Abi, parseUnits } from "viem";
import { useWriteContract } from "wagmi";
import { motion } from "framer-motion";

const ERC20_ABI = erc20Abi;

interface TokenSwapProps {
  expandedTool: "send" | "read" | "graph" | "swap" | null; // Controls which tool is expanded in the UI
  handleToolClick: (tool: "send" | "read" | "graph" | "swap") => void; // Callback to toggle tool expansion
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [sellToken, setSellToken] = useState("USDC");
  const [buyToken, setBuyToken] = useState("DAI");
  const [sellAmount, setSellAmount] = useState("10");

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const handleApproveAndSwap = async () => {
    console.log("handleApproveAndSwap function is called");

    setIsLoading(true);
    setStatus("Fetching swap quote...");

    // Correcting the API key access
    const apiKey = import.meta.env.VITE_ZERO_X_API_KEY;

    if (!apiKey) {
      setStatus("API key is missing.");
      console.error("API key is missing.");
    } else {
      console.log("API Key:", apiKey); // Logs the API key if it exists
    }
    console.log("let s go");

    try {
      const decimalsMap: { [symbol: string]: number } = {
        USDC: 6,
        DAI: 18,
      };

      const decimals = decimalsMap[sellToken] || 18;
      const amountInUnits = parseUnits(sellAmount, decimals);

      const quote = await axios.get("https://api.0x.org/swap/v1/quote", {
        params: {
          sellToken,
          buyToken,
          sellAmount: amountInUnits.toString(),
          takerAddress: address,
        },
        headers: {
          "0x-api-key": apiKey,
        },
      });

      const { allowanceTarget, to, data, value, gas, sellTokenAddress } =
        quote.data;

      const allowance = await publicClient.readContract({
        address: sellTokenAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address!, allowanceTarget],
      });

      if (BigInt(allowance) < amountInUnits) {
        setStatus("Approving token...");

        await writeContractAsync({
          address: sellTokenAddress,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [allowanceTarget, amountInUnits],
          account: address!,
          chain: undefined,
        });
      }

      setStatus("Sending swap transaction...");

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: address,
            to,
            data,
            value: value || "0x0",
            gas: gas?.toString(16),
          },
        ],
      });

      setStatus(`Transaction sent! Hash: ${tx}`);
    } catch (error) {
      console.error(error);
      setStatus("Error during swap.");
    }

    setIsLoading(false);
  };

  // Debugging effect to log the isLoading state
  useEffect(() => {
    console.log("isLoading:", isLoading);
  }, [isLoading]);

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
      onClick={() => handleToolClick("swap")}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              color: "text.primary",
              textAlign: "center",
              width: "100%",
            }}
          >
            Token Swap
          </Typography>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: "center",
        }}
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
                label="Sell Token Symbol"
                value={sellToken}
                onChange={(e) => setSellToken(e.target.value.toUpperCase())}
              />
              <TextField
                label="Buy Token Symbol"
                value={buyToken}
                onChange={(e) => setBuyToken(e.target.value.toUpperCase())}
              />
              <TextField
                label="Sell Amount"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
              <Button
                onClick={() => {
                  console.log("Button clicked!");
                  handleApproveAndSwap();
                }}
                disabled={isLoading}
                variant="contained"
              >
                {isLoading ? "Processing... " : "Swap via 0x "}
              </Button>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {status}
              </Typography>
            </Stack>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default TokenSwap;
