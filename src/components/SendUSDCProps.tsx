import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import InfoIcon from "@mui/icons-material/Info";
import { SendTransaction } from "./wagmiTransaction";

const SendUSDC = ({ expandedTool, handleToolClick, setAnchorEl }) => {
  const [receiverAddress, setReceiverAddress] = useState(
    "0x92FcD9d0424E3D3F3bB5a503a59A507F9A4607ee"
  );
  const [amountToSend, setAmountToSend] = useState(0.000001);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        boxShadow:
          expandedTool === "send"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: expandedTool === "send" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        zIndex: expandedTool === "send" ? 2 : 1,
        cursor: "pointer",
        width: { xs: "100%", sm: "400px" },
        "&:hover": {
          transform: expandedTool !== "send" ? "scale(1.05)" : "scale(1.02)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      }}
      onClick={() => handleToolClick("send")}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleIconClick(e);
                }}
                sx={{
                  color: "#ffffff",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  mr: 1,
                }}
              >
                <InfoIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </IconButton>
              Send USDC
            </Typography>
            <Collapse in={expandedTool === "send"}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                Send USDC on SepoliaETH testnet
              </Typography>
            </Collapse>
          </Box>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: "center",
        }}
      />
      <Collapse in={expandedTool === "send"}>
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
                label="Amount to send"
                variant="outlined"
                value={amountToSend}
                type="number"
                onChange={(e) => setAmountToSend(parseFloat(e.target.value))}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">USDC</InputAdornment>
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
                  background: "rgba(6, 5, 5, 0.1)",
                }}
              />
              <TextField
                label="Receiver address"
                variant="outlined"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
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
                }}
              />
              <SendTransaction to={receiverAddress} myvalue={amountToSend} />
            </Box>
          </CardContent>
        </motion.div>
      </Collapse>
    </Card>
  );
};

export default SendUSDC;
