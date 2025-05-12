import { useState, useRef, useEffect, lazy, Suspense } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Popover,
  Typography,
  Button,
  CircularProgress,
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
import "@rainbow-me/rainbowkit/styles.css";
import "./App.css";
import { store } from "./redux/store";
import { SnackbarProvider } from "notistack";
import ButtonAppBar from "./components/AppBar";
import Squares from "./animations/Squares";

// Lazy load components for better performance
const SendUSDC = lazy(() => import("./components/SendUSDCProps"));
const InfoSection = lazy(() => import("./components/InfoSection"));
const ReadATransaction = lazy(() => import("./components/ReadATransaction"));
const TokenSwap = lazy(() => import("./components/TokenSwap"));
const WalletBalance = lazy(() => import("./components/WalletBalance"));
const GraphACoin = lazy(() => import("./components/GraphACoin"));

const queryClient = new QueryClient();

// Styled Container with minimal glassmorphism
const GlassContainer = styled(Container)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(8px)",
  borderRadius: theme.shape.borderRadius,
  border: "1px solid rgba(255, 255, 255, 0.15)",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    maxWidth: "100%",
    margin: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
    maxWidth: "600px",
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
    initial: {
      opacity: 0,
      scale: 0.95, // Start with a slight scale down for smooth entry
    },
    animate: {
      opacity: 1,
      scale: 1, // Scale to normal size
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: 0.2, // Small delay to stagger animation
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95, // Fade out with scale down
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
    hover: {
      scale: 1.05, // Slightly scale up on hover for interactivity
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const name = "Sebastien Coponat";
  const qualificationsTitle = "Web3 Frontend Developer";

  const stackList = [
    "React",
    "TypeScript",
    "Wagmi",
    "RainbowKit",
    "ZeroX API & Permit2",
    "Permit2",
    "ethers.js v6",
    "Viem",
    "Binance WebSocket",
    "Redux",
    "MUI",
    "Framer Motion",
    "Prettier",
    "Git & GitHub",
    "@tanstack/react-query",
    "notistack",
  ];

  const techLinks: { [key: string]: string } = {
    React: "https://react.dev",
    TypeScript: "https://www.typescriptlang.org",
    Wagmi: "https://wagmi.sh",
    RainbowKit: "https://www.rainbowkit.com",
    "ZeroX API & Permit2": "https://0x.org",
    "ethers.js v6": "https://docs.ethers.org",
    Viem: "https://viem.sh",
    "Binance WebSocket":
      "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams",
    Redux: "https://redux.js.org",
    MUI: "https://mui.com",
    "Framer Motion": "https://www.framer.com/motion",
    Prettier: "https://prettier.io",
    "Git & GitHub": "https://github.com",
    "@tanstack/react-query": "https://tanstack.com/query",
    notistack: "https://notistack.com",
  };

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
                    justifyContent: "flex-start",
                    alignItems: "center",
                    background: "transparent",
                    overflowX: "hidden",
                  }}
                >
                  <ButtonAppBar />
                  <Box
                    sx={{
                      zIndex: 0,
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      width: "100%",
                      p: { xs: 0, sm: 2 },
                    }}
                  >
                    <Squares
                      direction="diagonal"
                      speed={0.3}
                      squareSize={15}
                      fadeDuration={1200}
                      hoverStrength={0.8}
                      gravityStrength={1000}
                      gravityRadius={1000}
                      squareFillOpacity={0.1}
                      squareBorderOpacity={0.01}
                      hoverFillColor="#6f00ff"
                      borderColor="#00f7ff"
                      particleCount={1}
                    />
                    <GlassContainer
                      sx={{
                        justifyContent: "center",
                        zIndex: 2,
                        width: { xs: "100%", sm: "600px" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: { xs: 1.5, sm: 2 },
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
                            fontSize: {
                              xs: "clamp(1.2rem, 5vw, 1.5rem)",
                              sm: "1.75rem",
                            },
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
                            textAlign: "center",
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          <Button
                            href="https://www.linkedin.com/in/vacher-coponat/?locale=en_US"
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={
                              <LinkedInIcon sx={{ fontSize: "1.25rem" }} />
                            }
                            sx={{
                              color: "#00f7ff",
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              fontWeight: 400,
                              textTransform: "none",
                              "&:hover": {
                                color: "#1acccc",
                                textShadow: "0 0 6px rgba(0, 247, 255, 0.4)",
                              },
                              "&:active": {
                                color: "#1acccc",
                              },
                            }}
                          >
                            LinkedIn
                          </Button>
                          {qualificationsTitle}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: { xs: 0.5, sm: 1 },
                            mt: 1,
                          }}
                        >
                          {stackList.map((tech) => (
                            <motion.div
                              key={tech}
                              whileHover={{
                                scale: 1.1,
                                transition: { duration: 0.3, ease: "easeOut" },
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                href={techLinks[tech]}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  px: { xs: 1, sm: 1.5 },
                                  py: { xs: 0.4, sm: 0.5 },
                                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                  background: "rgba(255, 255, 255, 0.1)",
                                  borderRadius: 1,
                                  color: "#00f7ff",
                                  border: "1px solid rgba(0, 247, 255, 0.4)",
                                  boxShadow: "0 0 6px rgba(0, 247, 255, 0.2)",
                                  backdropFilter: "blur(6px)",
                                  textTransform: "none",
                                  position: "relative",
                                  overflow: "hidden",
                                  minWidth: "60px",
                                  "&:hover": {
                                    color: "#1acccc",
                                    background:
                                      "linear-gradient(90deg, rgba(111, 0, 255, 0.47), rgba(0, 247, 255, 0.51), rgba(111, 0, 255, 0.51))",
                                    backgroundSize: "200%",
                                    animation:
                                      "moveGradient 3s linear infinite",
                                    boxShadow:
                                      "0 0 12px rgba(0, 247, 255, 0.6)",
                                    border: "1px solid rgba(0, 247, 255, 0.8)",
                                    textShadow:
                                      "0 0 6px rgba(0, 247, 255, 0.5)",
                                  },
                                  "&:active": {
                                    background: "rgba(0, 247, 255, 0.3)",
                                  },
                                  "@keyframes moveGradient": {
                                    "0%": { backgroundPosition: "0% 50%" },
                                    "100%": { backgroundPosition: "200% 50%" },
                                  },
                                }}
                              >
                                {tech}
                              </Button>
                            </motion.div>
                          ))}
                        </Box>
                      </motion.div>

                      {/* Tools */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: { xs: 1, sm: 1.5 },
                          width: "100%", // Full width for the Box itself
                          maxWidth: "100%", // Prevents overflow
                          alignItems: "center", // Always center child elements horizontally
                          boxSizing: "border-box", // Ensures no overflow from padding/margins
                          "& > *": {
                            width: { xs: "100%", sm: "auto" }, // Full width on small screens, auto on larger
                            maxWidth: "100%", // Prevents child elements from overflowing
                          },
                        }}
                      >
                        <Suspense fallback={<CircularProgress />}>
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
                          <motion.div
                            variants={itemVariants}
                            style={{
                              width: expandedTool === Tool.GRAPH ? "100%" : "",
                            }}
                          >
                            {" "}
                            <GraphACoin
                              expandedTool={expandedTool}
                              handleToolClick={handleToolClick}
                            />
                          </motion.div>
                        </Suspense>
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: { xs: 1, sm: 1.5 },
                              width: "100%", // Full width for the Box itself
                              maxWidth: "100%", // Prevents overflow
                              alignItems: "center", // Always center child elements horizontally
                              justifyContent: "center", // Ensure vertical centering if needed
                              boxSizing: "border-box", // Ensures no overflow from padding/margins
                              "& > *": {
                                width: { xs: "100%", sm: "auto" }, // Full width on small screens for children, auto on larger
                                maxWidth: { xs: "100%", sm: "300px" }, // Full width on small, constrained on larger
                              },
                            }}
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
                                borderRadius: 1,
                                background:
                                  "linear-gradient(90deg, #6f00ff, #00f7ff)",
                                color: "#ffffff",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #8b3bff, #1acccc)",
                                  boxShadow:
                                    "0 4px 16px rgba(111, 0, 255, 0.3)",
                                },
                                "&:active": {
                                  background:
                                    "linear-gradient(90deg, #8b3bff, #1acccc)",
                                },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                fontWeight: 500,
                                textTransform: "none",
                                py: { xs: 0.8, sm: 1 },
                                px: { xs: 2, sm: 3 },
                                mt: 1.5,
                                width: { xs: "auto", sm: "auto" }, // Override Box's full-width, use natural width
                                minWidth: { xs: "150px", sm: "150px" }, // Consistent minWidth, not 50%
                                maxWidth: { xs: "300px", sm: "300px" }, // Constrain width on all screens
                                alignSelf: "center", // Reinforce centering
                                display: "flex", // Ensure Button's content is centered internally
                                justifyContent: "center", // Center Button's content
                              }}
                            >
                              View Source on GitHub
                            </Button>
                          </Box>
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
                            maxWidth: { xs: "85vw", sm: "400px" },
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(8px)",
                            borderRadius: 1,
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#ffffff",
                            overflowY: "auto",
                          },
                        }}
                      >
                        <Suspense
                          fallback={<Typography>Loading...</Typography>}
                        >
                          <Typography
                            sx={{
                              p: { xs: 1, sm: 2 },
                              textAlign: "center",
                              color: "#ffffff",
                              fontWeight: 400,
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                            component="div"
                          >
                            <InfoSection item={popoverRef} />
                          </Typography>
                        </Suspense>
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
