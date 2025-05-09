import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  getTransaction,
  getTransactionReceipt,
  GetTransactionReturnType,
} from "@wagmi/core";
import { wagmiconfig } from "../wagmiConfig";
import { parseAbi, decodeEventLog } from "viem";
import { setHash } from "../redux/slices/hashReducer";

type RootState = {
  hash: {
    myhash: `0x${string}` | null;
  };
};

type ReadATransactionProps = {
  expandedTool: "send" | "read" | "graph" | "swap" | "balance" | null;
  handleToolClick: (
    tool: "send" | "read" | "graph" | "swap" | "balance"
  ) => void;
  setAnchorEl: (el: HTMLElement | null) => void;
};

interface ReadTransactionProps {
  myhash: `0x${string}` | null;
}

interface TokenTransfer {
  tokenAddress: string;
  from: string;
  to: string;
  value: string;
}

type TransactionData = GetTransactionReturnType;

function ReadTransaction({ myhash }: ReadTransactionProps) {
  return (
    <Box>
      {!myhash ? (
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          No transaction hash available
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
}

const ReadATransaction = ({
  expandedTool,
  handleToolClick,
  setAnchorEl,
}: ReadATransactionProps) => {
  const hash = useSelector((state: RootState) => state.hash.myhash);
  const dispatch = useDispatch();
  const [showDiv, setShowDiv] = useState(false);
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  const [tokenTransfer, setTokenTransfer] = useState<TokenTransfer | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Redux hash:", hash);
  }, [hash]);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const transferEventAbi = parseAbi([
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ]);

  const fetchTokenTransfer = async (hash: `0x${string}`) => {
    try {
      const receipt = await getTransactionReceipt(wagmiconfig, { hash });
      console.log("Transaction receipt:", receipt);

      for (const log of receipt.logs) {
        try {
          const decodedLog = decodeEventLog({
            abi: transferEventAbi,
            data: log.data,
            topics: log.topics,
          }) as {
            eventName: string;
            args: { from: string; to: string; value: bigint };
          };

          if (decodedLog.eventName === "Transfer") {
            const { from, to, value } = decodedLog.args;
            const decimals = 6;
            const formattedValue = (Number(value) / 10 ** decimals).toFixed(6);
            return {
              tokenAddress: log.address,
              from,
              to,
              value: formattedValue,
            };
          }
        } catch (e) {
          console.warn("Skipping non-Transfer log:", e);
          continue;
        }
      }
      return null;
    } catch (err) {
      console.error("Error fetching receipt:", err);
      throw err;
    }
  };

  const triggerTodoAction = async () => {
    console.log("Todo action triggered with hash:", hash);

    if (!hash) {
      console.log("No hash available for processing");
      setError("No transaction hash provided");
      setShowDiv(true);
      return;
    }

    try {
      setError(null);
      const transaction = await getTransaction(wagmiconfig, { hash });
      console.log("Fetched transaction:", transaction);

      setTransactionData(transaction);
      const tokenData = await fetchTokenTransfer(hash);
      setTokenTransfer(tokenData);
      setShowDiv(true);
    } catch (err) {
      console.error("Error fetching transaction:", err);
      setError("Failed to fetch transaction details");
      setShowDiv(true);
    }
  };

  const handleHashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHash = event.target.value as `0x${string}` | "";
    dispatch(setHash(newHash || null));
  };

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: 4,
        boxShadow:
          expandedTool === "read"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: expandedTool === "read" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        zIndex: expandedTool === "read" ? 2 : 1,
        cursor: "pointer",
        width: { xs: "100%", sm: "400px" },
        maxWidth: "100%",
        "&:hover": {
          transform: expandedTool !== "read" ? "scale(1.05)" : "scale(1.02)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      }}
      onClick={() => handleToolClick("read")}
    >
      <CardHeader
        title={
          <Box width="100%" textAlign="center">
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <IconButton
                onClick={handleIconClick}
                sx={{
                  color: "#ffffff",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  mr: 1,
                }}
                aria-label="Transaction info"
              ></IconButton>
              Read a Transaction
            </Typography>
            <Collapse in={expandedTool === "read"}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Read transaction details on SepoliaETH testnet
              </Typography>
            </Collapse>
          </Box>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: "center",
        }}
      />
      <Collapse in={expandedTool === "read"}>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <TextField
                label="Transaction Hash"
                variant="outlined"
                value={hash || ""}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={handleHashChange}
                fullWidth
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
                  borderRadius: 2,
                }}
              />
              <ReadTransaction myhash={hash} />
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  borderRadius: 2,
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
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  triggerTodoAction();
                }}
              >
                Search by Hash
              </Button>
              {showDiv && (
                <Box sx={{ mt: 2 }}>
                  {error ? (
                    <Typography variant="body2" sx={{ color: "#f44336" }}>
                      {error}
                    </Typography>
                  ) : transactionData ? (
                    <Box>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        From: {transactionData.from}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        To: {transactionData.to || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Native Value: {transactionData.value.toString()} wei
                      </Typography>
                      {tokenTransfer ? (
                        <>
                          <Typography variant="body2" sx={{ color: "#ffffff" }}>
                            Token Contract: {tokenTransfer.tokenAddress}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#ffffff" }}>
                            Token Amount: {tokenTransfer.value} tokens
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#ffffff" }}>
                            Token From: {tokenTransfer.from}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#ffffff" }}>
                            Token To: {tokenTransfer.to}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          No token transfer found in this transaction
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Block Number:{" "}
                        {transactionData.blockNumber?.toString() || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ffffff" }}>
                        Chain ID: {transactionData.chainId?.toString() || "N/A"}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      Loading transaction details...
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default ReadATransaction;
