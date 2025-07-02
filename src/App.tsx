import { Routes, Route, useLocation } from "react-router-dom"; // Import useLocation

import { Box, CssBaseline } from "@mui/material";
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
  const location = useLocation(); // Get the current location

  // Determine if the header should be shown
  const showHeader = location.pathname !== "/cortot";

  return (
    <SnackbarProvider>
      <Provider store={store}>
        <WagmiProvider config={wagmiconfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {showHeader && <Header />} {/* Conditionally render Header */}
                <Box
                  component="main" // semantic HTML for main content
                  sx={{
                    flexGrow: 1, // Allows the main content to take up available space
                    // Adjust padding-top to account for the fixed header's height.
                    // These values are based on AppBar's minHeight, plus a bit extra for safety
                    // (e.g., AppBar's default padding, shadows, and your fixed load time display).
                    pt: { xs: "50px", sm: "78px", md: "85px" }, // **Adjust these values as needed**
                    minHeight: "100vh", // Ensure content takes at least full viewport height
                    width: "100vw", // Ensure it spans full width
                    overflowX: "hidden", // Prevent horizontal scroll
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/wallet" element={<MyWallet />} />
                    <Route path="/cortot" element={<SalleCortotBooking />} />
                    <Route path="/seatplancortot" element={<SeatPlan />} />
                    <Route
                      path="/YouTubeComment"
                      element={<YouTubeComment />}
                    />
                  </Routes>
                </Box>
              </ThemeProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </SnackbarProvider>
  );
};

export default App;
