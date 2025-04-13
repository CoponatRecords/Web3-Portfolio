import React, { useState } from "react";
import { Box, Container, CssBaseline, Popover, Backdrop, Card, CardHeader, CardContent, Collapse, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import theme from "./theme";
import { config } from "./wagmiConfig";
import SendUSDC from "./components/SendUSDCProps";
import InfoSection from "./components/InfoSection";
import CointousdChartContainer from "./components/CointousdChartContainer";
import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const queryClient = new QueryClient();

const App = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedTool, setExpandedTool] = useState<"send" | "graph" | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToolClick = (tool: "send" | "graph") => {
    if (tool === "send") {
      if (expandedTool !== "send") {
        setExpandedTool("send");
      }
    } else {
      setExpandedTool(expandedTool === "graph" ? null : "graph");
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
      <Provider store={store}>
  
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
                <SendUSDC
                  expandedTool={expandedTool}
                  handleToolClick={handleToolClick}
                  setAnchorEl={setAnchorEl}
                />
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
    </Provider>
  );
};

export default App;