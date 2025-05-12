"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  Typography,
  Card,
  CardHeader,
  Collapse,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import TokenIcon from "@mui/icons-material/Token";

// Constants
const ALCHEMY_CONFIG = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ARB_MAINNET,
};

// Types
type TokenBalanceProps = {
  expandedTool: "send" | "read" | "graph" | "swap" | "balance" | null;
  handleToolClick: (
    tool: "send" | "read" | "graph" | "swap" | "balance"
  ) => void;
};

type TokenAsset = {
  metadata: { name: string; symbol: string; logo?: string };
  balance: number;
};

// Styles
const commonTextFieldSx = {
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
};

// Main Component
const WalletBalance: React.FC<TokenBalanceProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletContent, setWalletContent] = useState<TokenAsset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const alchemy = new Alchemy(ALCHEMY_CONFIG);

  useEffect(() => {
    if (address && address !== walletAddress) {
      setWalletAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (!walletAddress) {
      setWalletContent([]);
      setError("No wallet address provided");
      setLoading(false);
      return;
    }

    const fetchTokenBalances = async () => {
      setLoading(true);
      try {
        const response = await alchemy.core.getTokenBalances(walletAddress);
        const walletContentList: TokenAsset[] = [];

        for (const token of response.tokenBalances) {
          const balance = parseInt(token.tokenBalance as string, 16);
          if (balance !== 0) {
            const metadata = await alchemy.core.getTokenMetadata(
              token.contractAddress
            );
            const formattedBalance =
              balance / Math.pow(10, metadata.decimals || 18);
            const symbol =
              metadata.symbol || `UNK-${token.contractAddress.slice(-4)}`;

            walletContentList.push({
              metadata: {
                name: metadata.name || "Unknown Token",
                symbol,
                logo: metadata.logo,
              },
              balance: formattedBalance,
            });
          }
        }

        setWalletContent(walletContentList);
        setError(null);
      } catch (err) {
        console.error("Error fetching token balances:", err);
        setError("Failed to fetch token balances");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenBalances();
  }, [walletAddress]);

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: 1,
        boxShadow:
          expandedTool === "balance"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: expandedTool === "balance" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        zIndex: expandedTool === "balance" ? 2 : 1,
        width: { xs: "100%", sm: "400px" },
        "&:hover": {
          transform: expandedTool !== "balance" ? "scale(1.05)" : "scale(1.02)",
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
              Wallet Balance
            </Typography>
            <Collapse in={expandedTool === "balance"}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                View token balances on Arbitrum Mainnet
              </Typography>
            </Collapse>
          </Box>
        }
        onClick={() => handleToolClick("balance")}
      />
      <Collapse in={expandedTool === "balance"}>
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
              <TextField
                label="Wallet Address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                fullWidth
                variant="outlined"
                sx={commonTextFieldSx}
              />
              {error ? (
                <Typography
                  variant="body2"
                  sx={{ mt: 1, textAlign: "center", color: "#f44336" }}
                >
                  {error}
                </Typography>
              ) : loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                </Box>
              ) : walletContent.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  No tokens with non-zero balance
                </Typography>
              ) : (
                <List
                  sx={{
                    p: 0,
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 1,
                  }}
                >
                  {walletContent.map((asset, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom:
                          index < walletContent.length - 1
                            ? "1px solid"
                            : "none",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: asset.metadata.logo
                              ? "transparent"
                              : "linear-gradient(135deg, #6200ea 0%, #304ffe 100%)",
                            color: "#ffffff",
                            width: 32,
                            height: 32,
                          }}
                        >
                          {asset.metadata.logo ? (
                            <img
                              src={asset.metadata.logo}
                              alt={asset.metadata.name}
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
                            {asset.metadata.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            {asset.balance.toFixed(4)}{" "}
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{ fontWeight: "bold", color: "#ffffff" }}
                            >
                              {asset.metadata.symbol}
                            </Typography>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
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
                  href="https://www.alchemy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#ffffff" }}
                >
                  Alchemy
                </a>
              </Typography>
            </Stack>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default WalletBalance;
