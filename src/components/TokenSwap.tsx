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
import { motion } from "framer-motion";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  // useSendTransaction,
  useSignTypedData,
} from "wagmi";
import { simulateContract } from "@wagmi/core";

import { parseUnits, isAddress } from "ethers";
import { arbitrum } from "wagmi/chains";
import { concat, numberToHex } from "viem";
import { useGetSwapQuoteQuery } from "../redux/slices/swapSlice";
import { wagmiconfig } from "../wagmiConfig";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

// const ETHERSCANABI = [
//   [
//     {
//       inputs: [{ internalType: "bytes20", name: "gitCommit", type: "bytes20" }],
//       stateMutability: "nonpayable",
//       type: "constructor",
//     },
//     { inputs: [], name: "InvalidOffset", type: "error" },
//     { inputs: [], name: "InvalidTarget", type: "error" },
//     {
//       anonymous: false,
//       inputs: [
//         { indexed: true, internalType: "bytes20", name: "", type: "bytes20" },
//       ],
//       name: "GitCommit",
//       type: "event",
//     },
//     { stateMutability: "nonpayable", type: "fallback" },
//     {
//       inputs: [{ internalType: "address", name: "", type: "address" }],
//       name: "balanceOf",
//       outputs: [],
//       stateMutability: "pure",
//       type: "function",
//     },
//     {
//       inputs: [
//         {
//           components: [
//             {
//               internalType: "address payable",
//               name: "recipient",
//               type: "address",
//             },
//             {
//               internalType: "contract IERC20",
//               name: "buyToken",
//               type: "address",
//             },
//             { internalType: "uint256", name: "minAmountOut", type: "uint256" },
//           ],
//           internalType: "struct ISettlerBase.AllowedSlippage",
//           name: "slippage",
//           type: "tuple",
//         },
//         { internalType: "bytes[]", name: "actions", type: "bytes[]" },
//         { internalType: "bytes32", name: "", type: "bytes32" },
//       ],
//       name: "execute",
//       outputs: [{ internalType: "bool", name: "", type: "bool" }],
//       stateMutability: "payable",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "rebateClaimer",
//       outputs: [{ internalType: "address", name: "", type: "address" }],
//       stateMutability: "view",
//       type: "function",
//     },
//     { stateMutability: "payable", type: "receive" },
//   ],
// ];
interface TokenSwapProps {
  expandedTool: "send" | "read" | "graph" | "swap" | null;
  handleToolClick: (tool: "send" | "read" | "graph" | "swap") => void;
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  // const { sendTransaction } = useSendTransaction();
  const { signTypedDataAsync } = useSignTypedData();

  const [sellToken, setSellToken] = useState(
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
  ); // USDT
  const [buyToken, setBuyToken] = useState(
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
  ); // USDC
  const [sellAmount, setSellAmount] = useState("0.0001");
  const [status, setStatus] = useState("");
  const [decimals, setDecimals] = useState(18);

  const CONTRACTS = {
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  };

  // Fetch decimals for non-ETH tokens
  const { data: decimalsData } = useReadContract({
    address: sellToken as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: arbitrum.id,
    query: { enabled: sellToken !== CONTRACTS.ETH && isAddress(sellToken) },
  });

  useEffect(() => {
    if (sellToken === CONTRACTS.ETH) {
      setDecimals(18);
    } else if (decimalsData) {
      setDecimals(Number(decimalsData));
    }
  }, [CONTRACTS.ETH, decimalsData, sellToken]);

  const amountInUnits = parseUnits(sellAmount, decimals);

  // Fetch swap quote using Redux Toolkit Query
  const {
    data: quote,
    isLoading,
    error,
  } = useGetSwapQuoteQuery(
    {
      sellToken,
      buyToken,
      sellAmount: amountInUnits.toString(),
      takerAddress: address,
    },
    {
      skip: !address || !sellAmount || parseFloat(sellAmount) <= 0,
    }
  );

  // Fetch allowance for non-ETH tokens
  const { data: allowanceData } = useReadContract({
    address: sellToken as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: quote?.issues?.allowance?.spender
      ? [address, quote.issues.allowance.spender]
      : undefined,
    chainId: arbitrum.id,
    query: {
      enabled:
        sellToken !== CONTRACTS.ETH &&
        isAddress(sellToken) &&
        !!quote?.issues?.allowance?.spender &&
        !!address,
    },
  });

  console.log("Simulating Swap");

  // Trigger simulation when quote is fully available and valid

  const handleApproveAndSwap = async () => {
    if (!address || !isAddress(address)) {
      setStatus("Invalid wallet address");
      return;
    }

    if (!isAddress(sellToken)) {
      setStatus("Invalid sell token address");
      return;
    }

    if (!isAddress(buyToken)) {
      setStatus("Invalid buy token address");
      return;
    }

    if (!quote) {
      setStatus("No quote available");
      return;
    }

    // Check allowance for non-ETH tokens
    if (sellToken !== CONTRACTS.ETH && quote.issues?.allowance?.spender) {
      if (BigInt(allowanceData as bigint) < amountInUnits) {
        setStatus("Approving token...");

        try {
          await writeContract({
            address: sellToken as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [
              quote.issues.allowance.spender as `0x${string}`,
              amountInUnits,
            ],
            chain: arbitrum,
            account: address as `0x${string}`,
          });
          setStatus("Token approved");
        } catch (error) {
          console.error("Error approving token:", error);
          setStatus("Error approving token");
          return;
        }
      } else {
        setStatus("Token already approved");
      }
    } else if (sellToken === CONTRACTS.ETH) {
      setStatus("Native token detected, no approval needed");
    }

    setStatus("Processing swap...");
    if (quote.permit2?.eip712) {
      try {
        setStatus("Signing Permit2 data...");
        console.log("Signing Permit2 data...");

        const signature = await signTypedDataAsync({
          ...quote.permit2.eip712,
          account: address as `0x${string}`,
        });
        console.log("signature ", signature);

        const signatureLengthInHex = numberToHex(signature.length, {
          signed: false,
          size: 32,
        });
        console.log("signatureLengthInHex ", signatureLengthInHex);
        console.log(quote?.transaction.data);
        console.log({
          account: address,
          gas: quote?.transaction.gas
            ? BigInt(quote?.transaction.gas)
            : undefined,
          to: quote?.transaction.to,
          data: concat([
            quote?.transaction.data,
            signatureLengthInHex,
            signature,
          ]),
          chain: arbitrum,
        });

        const simulation = await simulateContract(wagmiconfig, {
          // abi: ETHERSCANABI,
          value: quote?.transaction.value
            ? BigInt(quote.transaction.value)
            : undefined, // value is used for native tokens
          account: address,
          gas: quote?.transaction.gas
            ? BigInt(quote?.transaction.gas)
            : undefined,
          to: quote?.transaction.to,
          data: concat([
            quote?.transaction.data,
            signatureLengthInHex,
            signature,
          ]),
          chain: arbitrum,
        });

        console.log("simulation", simulation);
      } catch (error) {
        console.error("Error:", error);
        setStatus("Error");
        return;
      }
    }

    // Simulate the swap transaction
    setStatus("Sending swap transaction...");

    try {
      // const txHash = await sendTransaction({
      //   to: quote.transaction.to,
      //   data: txData,
      //   value: BigInt(quote.transaction.value || 0),
      //   gas: quote.transaction.gas ? BigInt(quote.transaction.gas) : undefined,
      //   gasPrice: quote.transaction.gasPrice
      //     ? BigInt(quote.transaction.gasPrice)
      //     : undefined,
      //   chainId: arbitrum.id,
      // });
      // setStatus(`Transaction sent! Hash: ${txHash}`);
      // console.log(`See tx details at https://arbiscan.io/tx/${txHash}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      setStatus("Error during swap");
    }
  };

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
