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
import InfoIcon from "@mui/icons-material/Info";
import { useSelector, useDispatch } from "react-redux";
import { getTransaction, getTransactionReceipt, GetTransactionReturnType } from "@wagmi/core";
import { config } from "../wagmiConfig";
import { parseAbi, decodeEventLog } from "viem";
import { setHash } from "../redux/slices/hashReducer"; // Import your Redux action (adjust path as needed)

// Define the shape of the Redux store for type safety
interface RootState {
  hash: {
    myhash: `0x${string}` | null; // Transaction hash stored in Redux
  };
}

// Props for the ReadATransaction component
interface ReadATransactionProps {
  expandedTool: "send" | "graph" | null; // Controls which tool is expanded in the UI
  handleToolClick: (tool: "send" | "graph") => void; // Callback to toggle tool expansion
  setAnchorEl: (el: HTMLElement | null) => void; // Sets anchor element for info icon
}

// Props for the ReadTransaction sub-component
interface ReadTransactionProps {
  myhash: `0x${string}` | null; // Transaction hash passed to the component
}

// Structure for token transfer data extracted from transaction logs
interface TokenTransfer {
  tokenAddress: string; // Address of the token contract
  from: string; // Sender address of the token transfer
  to: string; // Recipient address of the token transfer
  value: string; // Human-readable token amount (e.g., "100.00")
}

// Type for transaction data fetched from the blockchain
type TransactionData = GetTransactionReturnType;

// Sub-component to display a message if no transaction hash is available
function ReadTransaction({ myhash }: ReadTransactionProps) {
  return (
    <Box>
      {!myhash ? (
        <Typography variant="body2" color="text.secondary">
          No transaction hash available
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
}

// Main component to read and display transaction details
const ReadATransaction = ({
  expandedTool,
  handleToolClick,
  setAnchorEl,
}: ReadATransactionProps) => {
  // Retrieve the transaction hash from Redux store
  const hash = useSelector((state: RootState) => state.hash.myhash);
  const dispatch = useDispatch(); // Initialize Redux dispatch

  // State to control visibility of transaction details
  const [showDiv, setShowDiv] = useState(false);
  // State to store transaction data (e.g., from, to, value in wei)
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);
  // State to store token transfer details (e.g., token amount)
  const [tokenTransfer, setTokenTransfer] = useState<TokenTransfer | null>(null);
  // State to handle errors during transaction fetching
  const [error, setError] = useState<string | null>(null);

  // Log the hash for debugging whenever it changes
  useEffect(() => {
    console.log("Redux hash:", hash);
  }, [hash]);

  // Handle click on the info icon to show additional details
  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click from triggering
    setAnchorEl(event.currentTarget); // Set anchor for info popup
  };

  // Define the ABI for the ERC-20 Transfer event to parse logs
  const transferEventAbi = parseAbi([
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ]);

  // Function to fetch and parse token transfer details from transaction logs
  const fetchTokenTransfer = async (hash: `0x${string}`) => {
    try {
      // Fetch the transaction receipt containing event logs
      const receipt = await getTransactionReceipt(config, { hash });
      console.log("Transaction receipt:", receipt);

      // Iterate through logs to find ERC-20 Transfer events
      for (const log of receipt.logs) {
        try {
          // Decode the log as a Transfer event using the ABI
          const decodedLog = decodeEventLog({
            abi: transferEventAbi,
            data: log.data, // Non-indexed event data (e.g., value)
            topics: log.topics, // Indexed event data (e.g., from, to)
          }) as { eventName: string; args: { from: string; to: string; value: bigint } };

          // Check if the log is a Transfer event
          if (decodedLog.eventName === "Transfer") {
            const { from, to, value } = decodedLog.args;
            // Assuming 6 decimals for tokens like USDT; ideally, fetch dynamically
            const decimals = 6;
            // Convert raw value (in wei-like units) to human-readable format
            const formattedValue = (Number(value) / 10 ** decimals).toFixed(6);
            return {
              tokenAddress: log.address, // Token contract address
              from, // Sender address
              to, // Recipient address
              value: formattedValue, // Formatted token amount
            };
          }
        } catch (e) {
          // Skip logs that don't match the Transfer event
          console.warn("Skipping non-Transfer log:", e);
          continue;
        }
      }
      return null; // No Transfer event found in the transaction
    } catch (err) {
      console.error("Error fetching receipt:", err);
      throw err; // Rethrow to handle in the caller
    }
  };

  // Function to fetch transaction details when the Search button is clicked
  const triggerTodoAction = async () => {
    console.log("Todo action triggered with hash:", hash);

    // Check if a valid hash is available
    if (!hash) {
      console.log("No hash available for processing");
      setError("No transaction hash provided");
      setShowDiv(true);
      return;
    }

    try {
      setError(null); // Clear any previous errors
      // Fetch basic transaction details (e.g., from, to, value in wei)
      const transaction = await getTransaction(config, { hash });
      console.log("Fetched transaction:", transaction);

      setTransactionData(transaction); // Store transaction data

      // Fetch and parse token transfer details
      const tokenData = await fetchTokenTransfer(hash);
      setTokenTransfer(tokenData); // Store token transfer data
      setShowDiv(true); // Show the transaction details UI
    } catch (err) {
      console.error("Error fetching transaction:", err);
      setError("Failed to fetch transaction details");
      setShowDiv(true); // Show error message in UI
    }
  };

  // Handle changes to the transaction hash input
  const handleHashChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHash = event.target.value as `0x${string}` | "";
    dispatch(setHash(newHash || null)); // Dispatch action to update hash in Redux store
  };

  return (
    // Card component for the transaction reader UI
    <Card
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 4,
        boxShadow: expandedTool === "send" ? 6 : 3, // Elevate when expanded
        transform: expandedTool === "send" ? "scale(1.02)" : "scale(1)", // Slight zoom effect
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        zIndex: expandedTool === "send" ? 2 : 1, // Bring to front when expanded
        cursor: "pointer",
        width: { xs: "100%", sm: "400px" }, // Responsive width
        maxWidth: "100%",
        ...(expandedTool !== "send" && {
          "&:hover": {
            transform: "scale(1.05)", // Hover effect when not expanded
          },
        }),
      }}
      onClick={() => handleToolClick("send")} // Toggle expansion on click
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.primary",
              width: "100%",
            }}
          >
            {/* Info icon to trigger additional details */}
            <IconButton
              onClick={handleIconClick}
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "secondary.main",
                },
              }}
              aria-label="Transaction info"
            >
              <InfoIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
            Read a Transaction
          </Typography>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: "center",
        }}
      />
      {/* Collapsible section for transaction details */}
      <Collapse in={expandedTool === "send"}>
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            pt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {/* Display the transaction hash in an editable text field */}
            <TextField
              label="Transaction Hash"
              variant="outlined"
              value={hash || ""}
              onChange={handleHashChange}
              fullWidth
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <ReadTransaction myhash={hash} />
            {/* Button to trigger transaction fetching */}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={triggerTodoAction}
            >
              Search by Hash
            </Button>
            {/* Display transaction details or error message */}
            {showDiv && (
              <Box sx={{ mt: 2 }}>
                {error ? (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                ) : transactionData ? (
                  <Box>
                    <Typography variant="body2" color="text.primary">
                      From: {transactionData.from}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      To: {transactionData.to || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Native Value: {transactionData.value.toString()} wei
                    </Typography>
                    {tokenTransfer ? (
                      <>
                        <Typography variant="body2" color="text.primary">
                          Token Contract: {tokenTransfer.tokenAddress}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          Token Amount: {tokenTransfer.value} tokens
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          Token From: {tokenTransfer.from}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          Token To: {tokenTransfer.to}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No token transfer found in this transaction
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.primary">
                      Block Number:{" "}
                      {transactionData.blockNumber?.toString() || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Chain ID: {transactionData.chainId?.toString() || "N/A"}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Loading transaction details...
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ReadATransaction;