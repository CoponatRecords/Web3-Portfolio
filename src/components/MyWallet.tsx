"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Skeleton, // Added for loading states
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence for exit animations
import { useAccount } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import TokenIcon from "@mui/icons-material/Token"; // Default icon for unknown tokens
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // For copy button
import Tooltip from "@mui/material/Tooltip"; // For copy button tooltip
import IconButton from "@mui/material/IconButton"; // For copy button
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // For copy success icon

// Constants
const ALCHEMY_CONFIG = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ARB_MAINNET,
};

// Types
type TokenAsset = {
  contractAddress: string; // Added to enable copying, no logic change
  metadata: { name: string; symbol: string; logo?: string };
  balance: number;
};

// Styles for the Text Field (visually enhanced, logic remains same)
const WalletAddressInputSx = {
  "& .MuiInputBase-input": {
    fontSize: { xs: "0.875rem", sm: "1rem" },
    color: "#ffffff",
    paddingRight: "40px", // Make space for the copy icon
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: 1,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)", // Subtle shadow
  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
  },
  "&.Mui-focused": {
    background: "rgba(255, 255, 255, 0.15)",
  },
};

// Animation variants for Framer Motion (visual only)
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // Stagger effect
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }, // For AnimatePresence
};

// Main Component
const MyWallet = () => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletContent, setWalletContent] = useState<TokenAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false); // State for copy feedback

  const alchemy = new Alchemy(ALCHEMY_CONFIG);

  // Logic: Sync connected wallet address with input field
  useEffect(() => {
    if (address && address !== walletAddress) {
      setWalletAddress(address);
    } else if (!address && walletAddress) {
      // Logic: Clear address if wallet disconnects
      setWalletAddress("");
      setWalletContent([]);
      setError(null);
    }
  }, [address, walletAddress]);

  // Logic: Fetch token balances when walletAddress changes
  useEffect(() => {
    if (!walletAddress) {
      setWalletContent([]);
      setError("Please connect your wallet or enter an address.");
      setLoading(false);
      return;
    }

    // Logic: Basic address validation (can be more robust)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setWalletContent([]);
      setError("Invalid Ethereum address format.");
      setLoading(false);
      return;
    }

    const fetchTokenBalances = async () => {
      setLoading(true);
      setError(null); // Logic: Clear previous errors
      setWalletContent([]); // Logic: Clear previous content

      try {
        const response = await alchemy.core.getTokenBalances(walletAddress);
        const walletContentList: TokenAsset[] = [];

        // Logic: Fetch metadata for each token and filter out zero balances
        for (const token of response.tokenBalances) {
          const balanceWei = parseInt(token.tokenBalance as string, 16);
          if (balanceWei === 0) continue; // Logic: Skip zero balance tokens

          const metadata = await alchemy.core.getTokenMetadata(
            token.contractAddress
          );

          const decimals = metadata.decimals || 18; // Logic: Default to 18 if not found
          const formattedBalance = balanceWei / Math.pow(10, decimals);
          const symbol =
            metadata.symbol || `UNK-${token.contractAddress.slice(-4)}`;
          const name = metadata.name || "Unknown Token";

          walletContentList.push({
            contractAddress: token.contractAddress, // Logic: Store full address
            metadata: { name, symbol, logo: metadata.logo },
            balance: formattedBalance,
          });
        }

        // Logic: Sort tokens alphabetically by symbol
        walletContentList.sort((a, b) =>
          a.metadata.symbol.localeCompare(b.metadata.symbol)
        );

        setWalletContent(walletContentList);
      } catch (err) {
        console.error("Error fetching token balances:", err);
        setError(
          "Failed to fetch token balances. Please check the address or try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalances();
  }, [walletAddress]); // Logic: Dependencies for useEffect

  // Logic: Handle copying wallet address to clipboard
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card
        sx={{
          borderRadius: 3, // Visual: More rounded corners
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)", // Visual: Deeper shadow for pop
          background: "rgba(30, 30, 40, 0.9)", // Visual: Slightly darker, semi-transparent background
          border: "1px solid rgba(255, 255, 255, 0.1)", // Visual: Subtle border
          overflow: "hidden", // Visual: Ensures inner elements respect border-radius
        }}
      >
        <CardHeader
          title={
            <Box width="100%" textAlign="center">
              <Typography
                variant="h5" // Visual: Slightly larger title
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: "bold",
                  color: "#e0e0e0", // Visual: Lighter white
                  textShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                  pb: 0.5, // Visual: Padding below title
                }}
              >
                Arbitrum Wallet Balance
              </Typography>
              <Typography
                variant="body2" // Visual: Changed to body2 for better readability
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontStyle: "italic",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                View your ERC-20 token holdings on Arbitrum Mainnet.
              </Typography>
            </Box>
          }
          sx={{
            background: "linear-gradient(45deg, #0f3460 30%, #1a1a2e 90%)", // Visual: Gradient header
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            pb: 2, // Visual: More padding below header text
          }}
        />

        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            pt: 2, // Visual: Adjust top padding
            background: "rgba(30, 30, 40, 0.8)", // Visual: Match card background
          }}
        >
          <Stack spacing={3}>
            {" "}
            {/* Visual: Increased spacing between elements */}
            <Box sx={{ position: "relative" }}>
              <TextField
                label="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                fullWidth
                variant="outlined"
                sx={WalletAddressInputSx}
                InputProps={{
                  endAdornment: walletAddress && (
                    <Tooltip
                      title={copySuccess ? "Copied!" : "Copy address"}
                      arrow
                      placement="top"
                    >
                      <IconButton
                        onClick={handleCopyAddress}
                        size="small"
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: copySuccess
                            ? "#03dac6"
                            : "rgba(255, 255, 255, 0.7)",
                          transition: "color 0.3s ease-in-out",
                        }}
                      >
                        {copySuccess ? (
                          <CheckCircleOutlineIcon fontSize="small" />
                        ) : (
                          <ContentCopyIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Box>
            {/* Conditional Rendering for Loading, Error, No Tokens, or List */}
            {loading ? (
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={30}
                  sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                />
                {[...Array(5)].map(
                  (
                    _,
                    i // Visual: Show 5 skeleton items
                  ) => (
                    <ListItem
                      key={i}
                      sx={{
                        py: 1,
                        px: 2,
                        bgcolor: "rgba(255,255,255,0.05)",
                        borderRadius: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Skeleton
                            variant="text"
                            width="40%"
                            height={20}
                            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                          />
                        }
                        secondary={
                          <Skeleton
                            variant="text"
                            width="25%"
                            height={15}
                            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
                          />
                        }
                      />
                    </ListItem>
                  )
                )}
              </Stack>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    color: "#f44336",
                    fontWeight: "bold",
                  }}
                >
                  {error}
                </Typography>
              </motion.div>
            ) : walletContent.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontStyle: "italic",
                  }}
                >
                  No tokens with non-zero balance found for this address.
                </Typography>
              </motion.div>
            ) : (
              <List
                sx={{
                  p: 0,
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 2, // Visual: Slightly more rounded list
                  maxHeight: walletContent.length > 5 ? "350px" : "auto", // Visual: Taller scroll area
                  overflowY: walletContent.length > 5 ? "auto" : "visible",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)", // Visual: Inner shadow for depth
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(255, 255, 255, 0.25)",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                <AnimatePresence>
                  {" "}
                  {/* Visual: Enables exit animations for list items */}
                  {walletContent.map((asset, index) => (
                    <motion.div
                      key={asset.contractAddress} // Visual: Use unique key for animations
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit" // Visual: For when items are removed (e.g., filtering)
                      custom={index}
                    >
                      <ListItem
                        sx={{
                          py: 1.5, // Visual: Increased vertical padding for more air
                          px: 2,
                          borderBottom:
                            index < walletContent.length - 1
                              ? "1px solid"
                              : "none",
                          borderColor: "rgba(255, 255, 255, 0.1)", // Visual: Softer border
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.08)", // Visual: More subtle hover
                          },
                          transition: "background-color 0.2s ease-in-out", // Visual: Smooth hover transition
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: "48px" }}>
                          {" "}
                          {/* Visual: Ensure consistent spacing */}
                          <Avatar
                            sx={{
                              bgcolor: asset.metadata.logo
                                ? "transparent"
                                : "rgba(98, 0, 234, 0.7)", // Visual: More vibrant default avatar background
                              color: "#ffffff",
                              width: 40, // Visual: Slightly larger avatar
                              height: 40,
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            }}
                          >
                            {asset.metadata.logo ? (
                              <img
                                src={asset.metadata.logo}
                                alt={asset.metadata.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain", // Visual: Use contain to prevent cropping
                                  borderRadius: "50%", // Visual: Make logo avatar truly circular
                                }}
                              />
                            ) : (
                              <TokenIcon sx={{ fontSize: 24 }} />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle1" // Visual: More prominent primary text
                              sx={{
                                fontWeight: "bold",
                                color: "#ffffff",
                                lineHeight: 1.2,
                              }}
                            >
                              {asset.metadata.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                                fontSize: "0.85rem",
                              }}
                            >
                              {asset.balance.toFixed(6)}{" "}
                              {/* Visual: More decimal places for precision */}
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontWeight: "bold", color: "#03dac6" }} // Visual: Highlight symbol with secondary color
                              >
                                {asset.metadata.symbol}
                              </Typography>
                            </Typography>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            )}
            <Typography
              variant="caption"
              sx={{
                mt: 2, // Visual: More space from the list
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.5)", // Visual: Softer color for attribution
                fontStyle: "italic",
                fontSize: "0.75rem",
              }}
            >
              Powered by{" "}
              <a
                href="https://www.alchemy.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Alchemy
              </a>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyWallet;
