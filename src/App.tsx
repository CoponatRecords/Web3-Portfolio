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
            fontWeight: "bold", // Make it bold for contrast
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
    h5: {
      fontSize: "1.5rem",
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
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

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "background.default",
                p: { xs: 1, sm: 2 }, // Responsive padding
              }}
            >
              <Container
                maxWidth="sm"
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: 600 }, // Full width on mobile
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 1.5, sm: 2 }, // Smaller gap on mobile
                    p: { xs: 2, sm: 4 }, // Less padding on mobile
                    backgroundColor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap", // Prevent overflow
                    }}
                  >
                    <IconButton
                      onClick={handleIconClick}
                      sx={{
                        position: "relative",
                        right: { xs: 8, sm: 10 }, // Adjust spacing
                        color: "primary.main",
                        transition: "transform 0.2s ease, color 0.2s ease",
                        "&:hover": {
                          color: "secondary.main",
                          transform: { xs: "scale(1.2)", sm: "scale(1.5)" }, // Smaller scale on mobile
                        },
                      }}
                    >
                      <InfoIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> {/* Smaller icon on mobile */}
                    </IconButton>
                    Send USDC on Testnet
                  </Typography>

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
                        maxWidth: { xs: "90vw", sm: "400px" }, // Responsive width
                        width: "100%",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        p: { xs: 1.5, sm: 2 }, // Less padding on mobile
                        textAlign: "center",
                      }}
                      component="div"
                    >
                      <InfoSection/>
                    </Typography>
                  </Popover>

                  <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                  />

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
                        fontSize: { xs: "0.875rem", sm: "1rem" }, // Smaller input text on mobile
                    }}}
                    
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
              </Container>

              <Container
                maxWidth="sm"
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: 600 },
                  mt: { xs: 2, sm: 4 }, // Responsive margin-top
                }}
              >
                <CointousdChartContainer />
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