import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Popover,
  Backdrop,
  Typography,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { motion } from "framer-motion";

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
import { GraphACoin } from "./components/GraphACoin";

const queryClient = new QueryClient();

const App = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedTool, setExpandedTool] = useState<
    "send" | "read" | "graph" | "swap" | null
  >(null);

  // Ref to detect clicks outside of Popover
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  enum Tool {
    SEND = "send",
    GRAPH = "graph",
    SWAP = "swap",
    READ = "read",
  }
  const handleToolClick = (tool: Tool) => {
    switch (tool) {
      case Tool.SEND:
        if (expandedTool !== Tool.SEND) {
          setExpandedTool(Tool.SEND);
        }
        break;

      case Tool.GRAPH:
        if (expandedTool !== Tool.GRAPH) {
          setExpandedTool(Tool.GRAPH);
        }
        break;
      case Tool.SWAP:
        if (expandedTool !== Tool.SWAP) {
          setExpandedTool(Tool.SWAP);
        }
        break;
      case Tool.READ:
        if (expandedTool !== Tool.READ) {
          setExpandedTool(Tool.READ);
        }
        break;
    }
  };

  // Detect click outside of Popover to close it
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <SnackbarProvider>
      <Provider store={store}>
        <WagmiProvider config={wagmiconfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />

                <ButtonAppBar />
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      layout
                    >
                      <SendUSDC
                        expandedTool={expandedTool}
                        handleToolClick={handleToolClick}
                        setAnchorEl={setAnchorEl}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      layout
                    >
                      <ReadATransaction
                        expandedTool={expandedTool}
                        handleToolClick={handleToolClick}
                        setAnchorEl={setAnchorEl}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      layout
                    >
                      <GraphACoin
                        expandedTool={expandedTool}
                        handleToolClick={handleToolClick}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      layout
                    >
                      <TokenSwap
                        expandedTool={expandedTool}
                        handleToolClick={handleToolClick}
                      />
                    </motion.div>
                    <Popover
                      ref={popoverRef} // Attach the ref here
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
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Typography
                          sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center" }}
                          component="div"
                        >
                          <InfoSection item={popoverRef} />
                        </Typography>
                      </motion.div>
                    </Popover>

                    <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backdropFilter: "blur(3px)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        transition: "opacity 0.3s ease-in-out",
                      }}
                      open={open}
                      onClick={handleClose}
                    />
                  </Container>
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
