import React from "react";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { store } from "../redux/store";
import { config } from "../wagmiConfig";
import theme from "../theme";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ReduxProvider>
  );
};

export default AppProviders;
