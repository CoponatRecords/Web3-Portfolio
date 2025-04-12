// App.tsx
import "./App.css";
import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import CointousdChartContainer from "../components/CointousdChartContainer";
import { SendTransaction } from "../components/wagmiTransaction";

import {
  TextField,
  Box,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Typography,
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

const queryClient = new QueryClient();

// Dark theme
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
                p: 2,
              }}
            >
              <Container maxWidth="sm">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 4,
                    backgroundColor: "background.paper",
                    borderRadius: 4,
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Send USDC on Testnet
                  </Typography>

                  <ConnectButton />

                  <TextField
                    label="Amount to send"
                    variant="outlined"
                    value={amountToSend}
                    type="number"
                    onChange={(e) =>
                      setAmountToSend(parseFloat(e.target.value))
                    }
                    fullWidth
                  />

                  <TextField
                    label="Receiver address"
                    variant="outlined"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    fullWidth
                  />

                  <SendTransaction
                    to={receiverAddress}
                    myvalue={amountToSend}
                  />
                </Box>
              </Container>
            </Box>

            <Container maxWidth="sm">
              <CointousdChartContainer />
            </Container>
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
