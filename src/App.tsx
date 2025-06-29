import { Routes, Route } from "react-router-dom";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import theme from "./theme";
import { wagmiconfig } from "./wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";
import { store } from "./redux/store";
import { SnackbarProvider } from "notistack";
import Home from "./Home";
import SalleCortotBooking from "./components/Cortot/cortot";
import SeatPlan from "./components/Cortot/seatplan";
import YouTubeComment from "./components/YouTubeComments";
import MyWallet from "./components/MyWallet";
import Header from "./components/AppBar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <SnackbarProvider>
      <Provider store={store}>
        <WagmiProvider config={wagmiconfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />

                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/wallet" element={<MyWallet />} />
                  <Route path="/cortot" element={<SalleCortotBooking />} />
                  <Route path="/seatplancortot" element={<SeatPlan />} />
                  <Route path="/YouTubeComment" element={<YouTubeComment />} />
                </Routes>
              </ThemeProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </SnackbarProvider>
  );
};

export default App;
