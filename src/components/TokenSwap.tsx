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
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useSignTypedData,
} from "wagmi";
import { sendTransaction } from "@wagmi/core";
import { parseUnits, isAddress, formatUnits } from "ethers";
import { arbitrum } from "wagmi/chains";
import { useGetSwapQuoteQuery } from "../redux/slices/swapSlice";
import { wagmiconfig } from "../wagmiConfig";
import { concat, Hex, numberToHex, size } from "viem";
import { Alchemy, Network } from "alchemy-sdk";
import TokenIcon from "@mui/icons-material/Token";
import SwapVertIcon from "@mui/icons-material/SwapVert";

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

type TokenSwapProps = {
  expandedTool:
    | "send"
    | "read"
    | "graph"
    | "swap"
    | "balance"
    | "docker"
    | null;
  handleToolClick: (
    tool: "send" | "read" | "graph" | "swap" | "docker" | "balance"
  ) => void;
};

interface TokenMetadata {
  name: string;
  symbol: string;
  logo?: string;
}

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ARB_MAINNET,
};

const alchemy = new Alchemy(config);

const TokenSwap: React.FC<TokenSwapProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();

  const [sellToken, setSellToken] = useState(
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" // USDT
  );
  const [buyToken, setBuyToken] = useState(
    "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" // USDC
  );
  const [sellAmount, setSellAmount] = useState("0.0001");
  const [, setStatus] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [sellTokenMetadata, setSellTokenMetadata] =
    useState<TokenMetadata | null>(null);
  const [buyTokenMetadata, setBuyTokenMetadata] =
    useState<TokenMetadata | null>(null);
  const [sellTokenError, setSellTokenError] = useState<string | null>(null);
  const [buyTokenError, setBuyTokenError] = useState<string | null>(null);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<React.ReactNode>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const CONTRACTS = {
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  };

  // Fetch token metadata and verify token is on Arbitrum
  useEffect(() => {
    const fetchTokenMetadata = async (
      tokenAddress: string,
      setMetadata: React.Dispatch<React.SetStateAction<TokenMetadata | null>>,
      setError: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
      if (!tokenAddress) {
        setMetadata(null);
        setError("Token address is empty");
        return;
      }

      if (!isAddress(tokenAddress)) {
        setMetadata(null);
        setError("Invalid token address");
        return;
      }

      setIsMetadataLoading(true);
      if (tokenAddress === CONTRACTS.ETH) {
        setMetadata({
          name: "Ethereum",
          symbol: "ETH",
        });
        setError(null);
        setIsMetadataLoading(false);
        return;
      }

      try {
        // Check if contract exists on Arbitrum
        const code = await alchemy.core.getCode(tokenAddress);
        if (code === "0x") {
          setMetadata(null);
          setError("Token contract not found on Arbitrum");
          setIsMetadataLoading(false);
          return;
        }

        const metadata = await alchemy.core.getTokenMetadata(tokenAddress);
        setMetadata({
          name: metadata.name || "Unknown Token",
          symbol: metadata.symbol || `UNK-${tokenAddress.slice(-4)}`,
          logo: metadata.logo,
        });
        setError(null);
      } catch (err) {
        console.error(`Error fetching metadata for ${tokenAddress}:`, err);
        setMetadata({
          name: "Unknown Token",
          symbol: `UNK-${tokenAddress.slice(-4)}`,
        });
        setError("Failed to verify token on Arbitrum");
      } finally {
        setIsMetadataLoading(false);
      }
    };

    fetchTokenMetadata(sellToken, setSellTokenMetadata, setSellTokenError);
    fetchTokenMetadata(buyToken, setBuyTokenMetadata, setBuyTokenError);
  }, [sellToken, buyToken, CONTRACTS.ETH]);

  // Fetch decimals for non-ETH tokens
  const { data: decimalsData } = useReadContract({
    address: sellToken as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: arbitrum.id,
    query: {
      enabled:
        sellToken !== CONTRACTS.ETH && isAddress(sellToken) && !sellTokenError,
    },
  });

  useEffect(() => {
    if (sellToken === CONTRACTS.ETH) {
      setDecimals(18);
    } else if (decimalsData) {
      setDecimals(Number(decimalsData));
    }
  }, [CONTRACTS.ETH, decimalsData, sellToken]);

  const amountInUnits = parseUnits(sellAmount || "0", decimals);

  // Fetch swap quote using Redux Toolkit Query
  const {
    data: quote,
    isLoading,
    error: quoteError,
  } = useGetSwapQuoteQuery(
    {
      sellToken,
      buyToken,
      sellAmount: amountInUnits.toString(),
      takerAddress: address,
    },
    {
      skip:
        !address ||
        !sellAmount ||
        parseFloat(sellAmount) <= 0 ||
        !!sellTokenError ||
        !!buyTokenError,
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
        !!address &&
        !sellTokenError,
    },
  });

  const handleSwitchTokens = () => {
    setSellToken(buyToken);
    setBuyToken(sellToken);
    setSellTokenMetadata(buyTokenMetadata);
    setBuyTokenMetadata(sellTokenMetadata);
    setSellTokenError(buyTokenError);
    setBuyTokenError(sellTokenError);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleApproveAndSwap = async () => {
    if (!address || !isAddress(address)) {
      setStatus("Invalid wallet address");
      setSnackbarMessage("Invalid wallet address");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!isAddress(sellToken) || sellTokenError) {
      setStatus("Invalid or unsupported sell token address");
      setSnackbarMessage("Invalid or unsupported sell token address");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!isAddress(buyToken) || buyTokenError) {
      setStatus("Invalid or unsupported buy token address");
      setSnackbarMessage("Invalid or unsupported buy token address");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!quote || !quote.transaction) {
      setStatus("No quote or transaction data available");
      setSnackbarMessage("No quote or transaction data available");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!isAddress(quote.transaction.to)) {
      setStatus("Invalid transaction 'to' address");
      setSnackbarMessage("Invalid transaction 'to' address");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const slippageBuyToken = quote.buyToken || buyToken;
    if (!isAddress(slippageBuyToken)) {
      setStatus("Invalid buy token address in quote");
      setSnackbarMessage("Invalid buy token address in quote");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!quote.buyAmount || isNaN(Number(quote.buyAmount))) {
      setStatus("Invalid buy amount in quote");
      setSnackbarMessage("Invalid buy amount in quote");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (sellToken !== CONTRACTS.ETH && quote.issues?.allowance?.spender) {
      if (!isAddress(quote.issues.allowance.spender)) {
        setStatus("Invalid allowance spender address");
        setSnackbarMessage("Invalid allowance spender address");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      if (BigInt(allowanceData as bigint) < amountInUnits) {
        setStatus("Writing contract...");
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
          setSnackbarMessage("Token approved successfully");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } catch (error) {
          console.error("Error approving token:", error);
          setStatus("Error approving token");
          setSnackbarMessage("Error approving token");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          return;
        }
      } else {
        setStatus("Token already approved");
        setSnackbarMessage("Token already approved");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    } else if (sellToken === CONTRACTS.ETH) {
      setStatus("Native token detected, no approval needed");
    }

    setStatus("Processing swap...");
    if (quote.permit2?.eip712) {
      try {
        setStatus("Signing Permit2 data...");
        const signature = (await signTypedDataAsync({
          ...quote.permit2.eip712,
          account: address as `0x${string}`,
        })) as Hex;

        const signatureLengthInHex = numberToHex(size(signature), {
          signed: false,
          size: 32,
        });
        const sigLengthHex = signatureLengthInHex as Hex;
        const sig = signature as Hex;

        const actions = concat([quote.transaction.data, sigLengthHex, sig]);

        try {
          const ContractData = {
            gas: quote.transaction.gas
              ? BigInt(quote.transaction.gas)
              : undefined,
            to: quote.transaction.to,
            address: quote.transaction.to as `0x${string}`,
            data: actions,
            value: quote.transaction.value
              ? BigInt(quote.transaction.value)
              : undefined,
            gasPrice: quote?.transaction.gasPrice
              ? BigInt(quote?.transaction.gasPrice)
              : undefined,
            chain: arbitrum,
          };

          const transactionHash = await sendTransaction(
            wagmiconfig,
            ContractData
          );

          setStatus(`Transaction sent: ${transactionHash}`);
          setSnackbarMessage(
            <span>
              Transaction sent!{" "}
              <a
                href={`https://arbiscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                View on Arbiscan
              </a>
            </span>
          );
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        } catch (error) {
          console.error("Error during transaction:", error);
          setStatus(`Error: ${error.message}`);
          setSnackbarMessage(`Error: ${error.message}`);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          return;
        }
      } catch (error) {
        console.error("Error during signing:", error);
        setStatus(`Error: ${error.message}`);
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
    } else {
      setStatus("Permit2 data not available");
      setSnackbarMessage("Permit2 data not available");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  };

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: 1,
        boxShadow:
          expandedTool === "swap"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: expandedTool === "swap" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        zIndex: expandedTool === "swap" ? 2 : 1,
        width: { xs: "100%", sm: "400px" },
        "&:hover": {
          transform: expandedTool !== "swap" ? "scale(1.05)" : "scale(1.02)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <CardHeader
        title={
          <Box width="100%" textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                fontWeight: "bold",
                color: "#ffffff",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              Token Swap
            </Typography>
            <Collapse in={expandedTool === "swap"}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Tokens must be on the{" "}
                <Link
                  href="https://arbitrum.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Arbitrum
                </Link>{" "}
                chain
              </Typography>
            </Collapse>
          </Box>
        }
        onClick={(e) => {
          e.stopPropagation();
          handleToolClick("swap");
        }}
      />
      <Collapse in={expandedTool === "swap"}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              pt: 1,
              background: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Stack spacing={2}>
              {isMetadataLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                </Box>
              ) : sellTokenMetadata ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: sellTokenMetadata.logo
                            ? "transparent"
                            : "primary.light",
                          color: sellTokenMetadata.logo ? "inherit" : "#ffffff",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {sellTokenMetadata.logo ? (
                          <img
                            src={sellTokenMetadata.logo}
                            alt={sellTokenMetadata.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        ) : (
                          <TokenIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium", color: "#ffffff" }}
                        >
                          {sellTokenMetadata.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {sellTokenMetadata.symbol}
                        </Typography>
                      }
                    />
                  </ListItem>
                </motion.div>
              ) : null}
              <TextField
                label="Sell Token Address"
                value={sellToken}
                onChange={(e) => {
                  e.stopPropagation();
                  setSellToken(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                fullWidth
                variant="outlined"
                error={!!sellTokenError}
                helperText={sellTokenError}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#ffffff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                }}
              />
              <TextField
                label="Amount"
                value={sellAmount}
                onChange={(e) => {
                  e.stopPropagation();
                  setSellAmount(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                fullWidth
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: sellTokenMetadata?.symbol && (
                    <InputAdornment position="end">
                      {sellTokenMetadata.symbol}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#ffffff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchTokens();
                    }}
                    sx={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      "&:hover": { background: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <SwapVertIcon />
                  </IconButton>
                </motion.div>
              </Box>
              {isMetadataLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                </Box>
              ) : buyTokenMetadata ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: buyTokenMetadata.logo
                            ? "transparent"
                            : "primary.light",
                          color: buyTokenMetadata.logo ? "inherit" : "#ffffff",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {buyTokenMetadata.logo ? (
                          <img
                            src={buyTokenMetadata.logo}
                            alt={buyTokenMetadata.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        ) : (
                          <TokenIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium", color: "#ffffff" }}
                        >
                          {buyTokenMetadata.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {buyTokenMetadata.symbol}
                        </Typography>
                      }
                    />
                  </ListItem>
                </motion.div>
              ) : null}
              <TextField
                label="Buy Token Address"
                value={buyToken}
                onChange={(e) => {
                  e.stopPropagation();
                  setBuyToken(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                fullWidth
                variant="outlined"
                error={!!buyTokenError}
                helperText={buyTokenError}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    color: "#ffffff",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                }}
              />

              {quote?.buyAmount && buyTokenMetadata?.symbol && (
                <Typography
                  variant="body2"
                  sx={{ color: "#ffffff", textAlign: "center" }}
                >
                  You will receive ~{formatUnits(quote.buyAmount, decimals)}{" "}
                  {buyTokenMetadata.symbol}
                </Typography>
              )}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveAndSwap();
                }}
                disabled={
                  isLoading ||
                  !address ||
                  !quote ||
                  !!sellTokenError ||
                  !!buyTokenError ||
                  !!quoteError
                }
                variant="contained"
                sx={{
                  borderRadius: 1,
                  background:
                    "linear-gradient(90deg, #6200ea 0%, #304ffe 100%)",
                  color: "#ffffff",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #7f39fb 0%, #3f51b5 100%)",
                  },
                  "&:disabled": {
                    background: "rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                ) : (
                  "Swap"
                )}
              </Button>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Powered by{" "}
                <a
                  href="https://0x.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#ffffff" }}
                >
                  0x
                </a>{" "}
                &{" "}
                <a
                  href="https://www.alchemy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#ffffff" }}
                >
                  Alchemy
                </a>
              </Typography>
            </Stack>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
                sx={{
                  width: "100%",
                  background: "rgba(0, 0, 0, 0.9)",
                  color: "#ffffff",
                }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default TokenSwap;
