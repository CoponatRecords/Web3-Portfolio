import "./App.css";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import CointousdChartContainer from "../components/CointousdChartContainer";
import { SendTransaction } from "../components/wagmiTransaction";
import InfoIcon from "@mui/icons-material/Info";
import {
  TextField,
  Box,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Typography,
  Popover,
  IconButton,
  Backdrop,
  Card,
  CardHeader,
  CardContent,
  Collapse,
} from "@mui/material";

import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Setup RainbowKit & wagmi config
const config = getDefaultConfig({
  appName: "testproject",
  projectId: "4e1a22e6483b1ca350afcdb6b729108f",
  chains: [sepolia],
  ssr: false,
});

const InfoSection = () => {
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
        Tool Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Send tokens from{" "}
        <span style={{ color: "#f6851b", fontWeight: "bold" }}>MetaMask</span> to a wallet via a smart contract.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Uses{" "}
        <span
          style={{
            backgroundImage:
              "linear-gradient(to right, #FFB6C1, #FFD700, #98FB98, #87CEFA, #DDA0DD, #FFB6C1, #FF69B4)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontWeight: "bold",
          }}
        >
          RainbowKit
        </span>{" "}
        for MetaMask connection and{" "}
        <span style={{ fontWeight: "bold", color: "#0066cc" }}>Wagmi</span> for contract interaction.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Deployed on SepoliaETH Testnet with{" "}
        <span style={{ color: "#1e73d2", fontWeight: "bold" }}>USDC</span> token.
      </Typography>
    </div>
  );
};

const queryClient = new QueryClient();

// Dark theme with responsive typography
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontSize: "1.25rem",
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (max-width:600px)": {
        fontSize: "0.875rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
});

const App = () => {
  const [receiverAddress, setReceiverAddress] = useState(
    "0x92FcD9d0424E3D3F3bB5a503a59A507F9A4607ee"
  );
  const [amountToSend, setAmountToSend] = useState(0.000001);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedTool, setExpandedTool] = useState<"send" | "graph" | null>(null);

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToolClick = (tool: "send" | "graph") => {
    if (tool === "send") {
      // For Send USDC: Expand if not already expanded, do nothing if expanded
      if (expandedTool !== "send") {
        setExpandedTool("send");
      }
    } else {
      // For Graph a Coin: Toggle as before
      setExpandedTool(expandedTool === "graph" ? null : "graph");
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                p: { xs: 1, sm: 2 },
              }}
            >
              <Container
                maxWidth="sm"
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: 600 },
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                {/* Send USDC Card */}
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
                        Send USDC
                      </Typography>
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
                        <SendTransaction to={receiverAddress} myvalue={amountToSend} />
                      </Box>
                    </CardContent>
                  </Collapse>
                </Card>

                {/* Graph a Coin Card */}
                <Card
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 4,
                    boxShadow: expandedTool === "graph" ? 6 : 3,
                    transform: expandedTool === "graph" ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    zIndex: expandedTool === "graph" ? 2 : 1,
                    cursor: "pointer",
                    width: { xs: "100%", sm: "400px" },
                    ...(expandedTool !== "graph" && {
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }),
                  }}
                  onClick={() => handleToolClick("graph")}
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
                        Graph a Coin
                      </Typography>
                    }
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      textAlign: "center",
                    }}
                  />
                  <Collapse in={expandedTool === "graph"}>
                    <CardContent
                      sx={{
                        p: { xs: 2, sm: 3 },
                        pt: 1,
                      }}
                    >
                      <CointousdChartContainer />
                    </CardContent>
                  </Collapse>
                </Card>

                {/* Popover for Info */}
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorReference="anchorPosition"
                  anchorPosition={{
                    top: window.innerHeight / 2,
                    left: window.innerWidth / 2,
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                  PaperProps={{
                    sx: {
                      maxWidth: { xs: "90vw", sm: "400px" },
                      width: "100%",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      textAlign: "center",
                    }}
                    component="div"
                  >
                    <InfoSection />
                  </Typography>
                </Popover>

                <Backdrop
                  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={open}
                  onClick={handleClose}
                />
              </Container>
            </Box>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// Export wrapped with Redux Provider
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);