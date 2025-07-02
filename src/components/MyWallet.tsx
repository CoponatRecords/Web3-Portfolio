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
  Skeleton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import TokenIcon from "@mui/icons-material/Token";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Constants (unchanged)
const ALCHEMY_CONFIG = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ARB_MAINNET,
};

// Types (unchanged)
type TokenAsset = {
  contractAddress: string;
  metadata: { name: string; symbol: string; logo?: string };
  balance: number;
};

// Styles for the Text Field (unchanged)
const WalletAddressInputSx = {
  "& .MuiInputBase-input": {
    fontSize: { xs: "0.875rem", sm: "1rem" },
    color: "#ffffff",
    paddingRight: "40px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: 1,
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.15)",
  },
  "&.Mui-focused": {
    background: "rgba(255, 255, 255, 0.15)",
  },
};

// Animation variants for Framer Motion (unchanged)
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
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

// Main Component
const MyWallet = () => {
  const { address, isConnected } = useAccount(); // Get isConnected status
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [lastConnectedAddress, setLastConnectedAddress] = useState<
    string | undefined
  >(undefined); // New state to track the last connected address
  const [walletContent, setWalletContent] = useState<TokenAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const alchemy = new Alchemy(ALCHEMY_CONFIG);

  // LOGIC REVISION: Sync connected wallet address with input field more intelligently
  useEffect(() => {
    // If a wallet is connected and it's a new address or the input is empty, set it
    if (isConnected && address && address !== lastConnectedAddress) {
      setWalletAddress(address);
      setLastConnectedAddress(address); // Store the newly connected address
    } else if (
      !isConnected &&
      lastConnectedAddress &&
      walletAddress === lastConnectedAddress
    ) {
      // If wallet disconnects AND the current input field *still holds* the disconnected address, clear it.
      // This prevents clearing if the user has manually typed a different address.
      setWalletAddress("");
      setLastConnectedAddress(undefined); // Clear last connected address
      setWalletContent([]);
      setError(null);
    }
  }, [address, isConnected, lastConnectedAddress, walletAddress]); // Add isConnected and lastConnectedAddress to dependencies

  // Logic: Fetch token balances when walletAddress changes (unchanged)
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
      setError(null);
      setWalletContent([]);

      try {
        const response = await alchemy.core.getTokenBalances(walletAddress);
        const walletContentList: TokenAsset[] = [];

        for (const token of response.tokenBalances) {
          const balanceWei = parseInt(token.tokenBalance as string, 16);
          if (balanceWei === 0) continue;

          const metadata = await alchemy.core.getTokenMetadata(
            token.contractAddress
          );

          const decimals = metadata.decimals || 18;
          const formattedBalance = balanceWei / Math.pow(10, decimals);
          const symbol =
            metadata.symbol || `UNK-${token.contractAddress.slice(-4)}`;
          const name = metadata.name || "Unknown Token";

          walletContentList.push({
            contractAddress: token.contractAddress,
            metadata: { name, symbol, logo: metadata.logo },
            balance: formattedBalance,
          });
        }

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
  }, [walletAddress]);

  // Logic: Handle copying wallet address to clipboard (unchanged)
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          background: "rgba(30, 30, 40, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        <CardHeader
          title={
            <Box width="100%" textAlign="center">
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  fontWeight: "bold",
                  color: "#e0e0e0",
                  textShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                  pb: 0.5,
                }}
              >
                Arbitrum Wallet Balance
              </Typography>
              <Typography
                variant="body2"
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
            background: "linear-gradient(45deg, #0f3460 30%, #1a1a2e 90%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            pb: 2,
          }}
        />

        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            pt: 2,
            background: "rgba(30, 30, 40, 0.8)",
          }}
        >
          <Stack spacing={3}>
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
                {[...Array(5)].map((_, i) => (
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
                ))}
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
                  borderRadius: 2,
                  maxHeight: walletContent.length > 5 ? "100%" : "auto",
                  overflowY: walletContent.length > 5 ? "auto" : "visible",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
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
                  {walletContent.map((asset, index) => (
                    <motion.div
                      key={asset.contractAddress}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                    >
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderBottom:
                            index < walletContent.length - 1
                              ? "1px solid"
                              : "none",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.08)",
                          },
                          transition: "background-color 0.2s ease-in-out",
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: "48px" }}>
                          <Avatar
                            sx={{
                              bgcolor: asset.metadata.logo
                                ? "transparent"
                                : "rgba(98, 0, 234, 0.7)",
                              color: "#ffffff",
                              width: 40,
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
                                  objectFit: "contain",
                                  borderRadius: "50%",
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
                              variant="subtitle1"
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
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontWeight: "bold", color: "#03dac6" }}
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
                mt: 2,
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.5)",
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
