import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import theme from "./theme";
import { wagmiconfig } from "./wagmiConfig";
import SendUSDC from "./components/SendUSDCProps";
import InfoSection from "./components/InfoSection";
import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";
import { store } from "./redux/store";
import { SnackbarProvider } from "notistack";
import ReadATransaction from "./components/ReadATransaction";
import ButtonAppBar from "./components/AppBar";
import TokenSwap from "./components/TokenSwap";
import WalletBalance from "./components/WalletBalance";
import { GraphACoin } from "./components/GraphACoin";
import Squares from "./animations/Squares";

const queryClient = new QueryClient();

// Styled Container with minimal glassmorphism
const GlassContainer = styled(Container)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(8px)",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid rgba(255, 255, 255, 0.15)",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

const App = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedTool, setExpandedTool] = useState<
    "send" | "read" | "graph" | "swap" | "balance" | null
  >(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setAnchorEl(null);

  enum Tool {
    SEND = "send",
    GRAPH = "graph",
    SWAP = "swap",
    READ = "read",
    BALANCE = "balance",
  }

  const handleToolClick = (tool: Tool) => {
    setExpandedTool(expandedTool !== tool ? tool : null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const itemVariants = {
    gap: { xs: 2, sm: 3 }, // Increased gap for tool spacing

    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const name = "Sebastien Coponat";
  const qualifications = "Blockchain Developer | React & Web3"; // Update with your qualifications

  return (
    <SnackbarProvider>
      <Provider store={store}>
        <WagmiProvider config={wagmiconfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 0,
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "transparent",
                  }}
                >
                  <ButtonAppBar />
                  <Box
                    sx={{
                      zIndex: 0,
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      p: { xs: 1, sm: 2 },
                    }}
                  >
                    <Squares
                      direction="diagonal"
                      speed={0.3}
                      squareSize={20}
                      fadeDuration={1200}
                      hoverStrength={0.8}
                      gravityStrength={1000}
                      gravityRadius={1000}
                      squareFillOpacity={0.1}
                      squareBorderOpacity={0.01}
                      hoverFillColor="#6f00ff"
                      borderColor="#00f7ff"
                      particleCount={2}
                    />
                    <GlassContainer
                      maxWidth="sm"
                      sx={{
                        justifyContent: "center",
                        zIndex: 2,
                        maxWidth: { xs: "95%", sm: 600 },
                        display: "flex",
                        flexDirection: "column",

                        alignItems: "center",
                        gap: { xs: 2, sm: 3 }, // Increased gap for tool spacing
                      }}
                    >
                      {/* Name, Qualifications, and LinkedIn */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            color: "#ffffff",
                            fontWeight: 600,
                            textShadow: "0 0 6px rgba(111, 0, 255, 0.4)",
                          }}
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.8)",
                            mt: 0.5,
                            fontWeight: 400,
                          }}
                        >
                          {qualifications}
                        </Typography>
                        <Button
                          href="https://www.linkedin.com/in/vacher-coponat/?locale=en_US"
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={
                            <LinkedInIcon sx={{ fontSize: "1.25rem" }} />
                          }
                          sx={{
                            mt: 1,
                            color: "#00f7ff",
                            fontSize: "0.75rem",
                            fontWeight: 400,
                            textTransform: "none",
                            "&:hover": {
                              color: "#1acccc",
                              textShadow: "0 0 6px rgba(0, 247, 255, 0.4)",
                            },
                          }}
                        >
                          LinkedIn
                        </Button>
                      </motion.div>

                      {/* Tools */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: { xs: 1, sm: 2 }, // 32px on xs, 48px on sm
                          width: "100%",
                          alignItems: "center",
                          // Debugging: Add background to visualize container
                        }}
                      >
                        <motion.div variants={itemVariants}>
                          <TokenSwap
                            expandedTool={expandedTool}
                            handleToolClick={handleToolClick}
                          />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <WalletBalance
                            expandedTool={expandedTool}
                            handleToolClick={handleToolClick}
                          />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <SendUSDC
                            expandedTool={expandedTool}
                            handleToolClick={handleToolClick}
                            setAnchorEl={setAnchorEl}
                          />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <ReadATransaction
                            expandedTool={expandedTool}
                            handleToolClick={handleToolClick}
                            setAnchorEl={setAnchorEl}
                          />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <GraphACoin
                            expandedTool={expandedTool}
                            handleToolClick={handleToolClick}
                          />
                        </motion.div>
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="contained"
                              href="https://github.com/CoponatRecords/TestProject-1"
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={
                                <GitHubIcon sx={{ fontSize: "1.25rem" }} />
                              }
                              sx={{
                                borderRadius: 2,
                                background:
                                  "linear-gradient(90deg, #6f00ff, #00f7ff)",
                                color: "#ffffff",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #8b3bff, #1acccc)",
                                  boxShadow:
                                    "0 4px 16px rgba(111, 0, 255, 0.3)",
                                },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                fontWeight: 500,
                                textTransform: "none",
                                py: 1,
                                px: 3,
                                mt: 2,
                              }}
                            >
                              View Source on GitHub
                            </Button>
                          </motion.div>
                        </motion.div>
                      </Box>
                      <Popover
                        ref={popoverRef}
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
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(8px)",
                            borderRadius: 4,
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#ffffff",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            textAlign: "center",
                            color: "#ffffff",
                            fontWeight: 400,
                          }}
                          component="div"
                        >
                          <InfoSection item={popoverRef} />
                        </Typography>
                      </Popover>
                    </GlassContainer>
                  </Box>
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
