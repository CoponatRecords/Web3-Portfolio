import { Box, Card, CardContent, CardHeader, Collapse, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SendTransaction } from "./wagmiTransaction";

interface SendUSDCProps {
  expandedTool: "send" | "graph" | null;
  handleToolClick: (tool: "send" | "graph") => void;
  setAnchorEl: (el: HTMLElement | null) => void;
}

const SendUSDC = ({ expandedTool, handleToolClick, setAnchorEl }: SendUSDCProps) => {
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
        backgroundColor: "background.paper",
        borderRadius: 4,
        boxShadow: expandedTool === "send" ? 6 : 3,
        transform: expandedTool === "send" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        zIndex: expandedTool === "send" ? 2 : 1,
        cursor: "pointer",
        width: { xs: "100%", sm: "400px" },
        ...(expandedTool !== "send" && {
          "&:hover": {
            transform: "scale(1.05)",
          },
        }),
      }}
      onClick={() => handleToolClick("send")}
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
            <IconButton
              onClick={handleIconClick}
              sx={{
                color: "primary.main",
                "&:hover": {
                  color: "secondary.main",
                },
              }}
            >
              <InfoIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>
Read a Block          </Typography>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: "center",
        }}
      />
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
            <ConnectButton />
            <TextField
              label="Amount to send"
              variant="outlined"
              value={amountToSend}
              type="number"
              onChange={(e) => setAmountToSend(parseFloat(e.target.value))}
              fullWidth
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <TextField
              label="Receiver address"
              variant="outlined"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              fullWidth
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              }}
            />
            <SendTransaction to={receiverAddress} myvalue={amountToSend}/>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default SendUSDC;