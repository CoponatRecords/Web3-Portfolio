"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import {
  Box,
  Container,
  Popover,
  Typography,
  Button,
  CircularProgress, // Keep for Suspense fallback
  styled,
} from "@mui/material";

import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Local Component Imports (ensure these paths are correct)
import Squares from "./animations/Squares";
import StudioSite from "./components/StudioSite";
import AtemMini from "./components/AtemMini";
import SeatBooking from "./components/SeatBooking";
// import DockerErigonStatus from "./components/DockerErigonStatus"; // Uncomment if you use it
import GraphACoin from "./components/GraphACoin";
import InfoSection from "./components/InfoSection";
import ReadATransaction from "./components/ReadATransaction";
import SendUSDC from "./components/SendUSDCProps";
import TokenSwap from "./components/TokenSwap/TokenSwap";
import WalletBalance from "./components/WalletBalance";

// --- Enums and Types ---
// Define your tools as an enum for better type safety and readability
enum Tool {
  SEND = "send",
  GRAPH = "graph",
  SWAP = "swap",
  READ = "read",
  BALANCE = "balance",
  DOCKER = "docker", // Keep if you plan to use DockerErigonStatus
  STUDIO_SITE = "studioSite", // Example for other tools
  ATEM_MINI = "atemMini",
  SEAT_BOOKING = "seatBooking",
  INFO = "info", // For the Popover content
}

// --- Styled Components ---
// GlassContainer using the theme for consistent borderRadius and padding
const GlassContainer = styled(Container)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(8px)",
  borderRadius: theme.shape.borderRadius, // Use theme's border radius
  border: "1px solid rgba(255, 255, 255, 0.15)",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    margin: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

// --- Main Home Component ---
const Home = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // Type explicitly
  const [expandedTool, setExpandedTool] = useState<Tool | null>(null); // Use the Tool enum
  const popoverRef = useRef<HTMLDivElement>(null);

  // Memoize handleClose if it doesn't depend on state that changes frequently
  const handleClose = () => {
    setAnchorEl(null);
    setExpandedTool(null); // Optionally collapse any expanded tool when popover closes
  };

  // Use the Tool enum directly for the handler
  const handleToolClick = (tool: Tool) => {
    setExpandedTool(expandedTool !== tool ? tool : null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close popover if click is outside and popover is open
      if (
        anchorEl &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
      // Optionally, close expanded tool if click is outside any tool card.
      // This would require passing refs to each tool card, which can get complex.
      // For now, only popover is handled with click outside.
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl]); // Add anchorEl to dependencies to ensure effect re-runs if anchorEl changes

  // Use a stable ID for the popover for accessibility
  const open = Boolean(anchorEl);

  const popoverId = open ? "tool-info-popover" : undefined;

  // Framer Motion Variants (cleaner definition)
  const itemVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" },
    },
    hover: { scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }, // Slightly less aggressive hover
  };

  // Define personal info and tech stack
  const name = "Sebastien Coponat";
  const qualificationsTitle = "Web3 Frontend Developer";

  const stackList = [
    "React",
    "TypeScript",
    "Wagmi",
    "RainbowKit",
    "ZeroX API & Permit2",
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

  // Using a Record type for better type safety with string keys
  const techLinks: Record<string, string> = {
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
        overflowX: "hidden", // Prevent horizontal scroll
        py: { xs: 2, sm: 4 }, // Add some vertical padding to the main box
      }}
    >
      {/* Background Animation */}
      <Box
        sx={{
          position: "absolute", // Absolute positioning for background
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, // Ensure it's behind content
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
      </Box>

      {/* Main Content Container (GlassContainer) */}
      <GlassContainer
        sx={{
          justifyContent: "center",
          zIndex: 2, // Ensure content is above background
          width: { xs: "100%", sm: "70%" }, // Responsive width
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 2, sm: 3 }, // Increased overall gap for better spacing
          mt: { xs: 2, sm: 4 }, // Add top margin to push content down from top edge
          mb: { xs: 2, sm: 4 }, // Add bottom margin
        }}
      >
        {/* Name, Qualifications, and Social/Tech Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: "100%", textAlign: "center" }} // Ensure text is centered properly
        >
          <Typography
            variant="h4" // Slightly larger for main name
            sx={{
              color: "#ffffff",
              fontWeight: 700, // Bolder
              textShadow: "0 0 8px rgba(111, 0, 255, 0.6)", // More intense shadow
              fontSize: {
                xs: "clamp(1.5rem, 6vw, 2rem)", // Larger on small screens
                sm: "2.5rem",
              },
              pb: 0.5,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="subtitle1" // Use subtitle1 for qualifications
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              mt: 0.5,
              fontWeight: 500,
              textAlign: "center",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              pb: 1, // Padding below for buttons
            }}
          >
            {qualificationsTitle}
            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "center",
                gap: 1, // Gap between social buttons
              }}
            >
              <Button
                href="https://t.me/Sebcoponat"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<TelegramIcon />}
                sx={{
                  color: "#00f7ff",
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 600,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "#1acccc",
                    textShadow: "0 0 6px rgba(0, 247, 255, 0.4)",
                    backgroundColor: "rgba(0, 247, 255, 0.05)",
                  },
                }}
              >
                Telegram
              </Button>
              <Button
                href="https://www.linkedin.com/in/vacher-coponat/?locale=en_US"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LinkedInIcon />}
                sx={{
                  color: "#00f7ff",
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: 600,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "#1acccc",
                    textShadow: "0 0 6px rgba(0, 247, 255, 0.4)",
                    backgroundColor: "rgba(0, 247, 255, 0.05)",
                  },
                }}
              >
                LinkedIn
              </Button>
            </Box>
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 0.8, sm: 1.5 }, // Increased gap for tech buttons
              mt: 2, // More space after name/socials
            }}
          >
            {stackList.map((tech) => (
              <motion.div
                key={tech} // Using 'tech' as key, assuming it's unique and stable
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 16px rgba(0, 247, 255, 0.8)",
                }} // Enhanced hover effect
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Button
                  href={techLinks[tech]}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    px: { xs: 1.2, sm: 2 }, // Increased padding
                    py: { xs: 0.6, sm: 0.8 }, // Increased padding
                    fontSize: { xs: "0.7rem", sm: "0.85rem" }, // Slightly larger font
                    background: "rgba(255, 255, 255, 0.15)", // Slightly more opaque
                    borderRadius: 2, // More rounded corners
                    color: "#00f7ff",
                    border: "1px solid rgba(0, 247, 255, 0.5)", // More prominent border
                    boxShadow: "0 0 8px rgba(0, 247, 255, 0.3)", // More prominent shadow
                    backdropFilter: "blur(8px)",
                    textTransform: "none",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: "unset", // Allow content to dictate width
                    "&:hover": {
                      color: "#ffffff", // White text on hover
                      background:
                        "linear-gradient(90deg, rgba(111, 0, 255, 0.6), rgba(0, 247, 255, 0.7), rgba(111, 0, 255, 0.6))", // Richer gradient
                      backgroundSize: "300%", // Larger background size for more motion
                      animation: "moveGradient 6s linear infinite", // Slower animation
                      boxShadow: "0 0 16px rgba(0, 247, 255, 0.8)",
                      border: "1px solid rgba(0, 247, 255, 1)", // Solid border on hover
                      textShadow: "0 0 8px rgba(255, 255, 255, 0.8)", // White text shadow
                    },
                    "@keyframes moveGradient": {
                      "0%": { backgroundPosition: "0% 50%" },
                      "100%": { backgroundPosition: "100% 50%" }, // Simple left-to-right movement
                    },
                  }}
                >
                  {tech}
                </Button>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Tools Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2.5 }, // Consistent spacing between tools
            width: "100%",
            alignItems: "center",
            boxSizing: "border-box",
            "& > div": {
              // Target direct motion.div children for consistent tool width
              width: { xs: "100%" },
            },
            "& > div > .MuiCard-root": {
              // Ensure tools' internal cards also respect max width if they use it
              width: "100%",
            },
          }}
        >
          {/* Category 1: My Web3 Tools Developed for My Portfolio */}
          <Typography
            variant="h5" // Consistent heading size
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              textShadow: "0 0 6px rgba(111, 0, 255, 0.4)",
              fontSize: {
                xs: "clamp(1.1rem, 4.5vw, 1.4rem)",
                sm: "1.6rem",
              },
              mt: 3, // More space before this category
              mb: 1, // Space below heading
              textAlign: "center",
            }}
          >
            My Web3 Tools Developed for My Portfolio
          </Typography>
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
          >
            <TokenSwap
              expandedTool={expandedTool}
              handleToolClick={handleToolClick}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
          >
            <WalletBalance
              expandedTool={expandedTool}
              handleToolClick={handleToolClick}
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
          >
            <SendUSDC
              expandedTool={expandedTool}
              handleToolClick={handleToolClick}
              setAnchorEl={setAnchorEl}
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
          >
            <ReadATransaction
              expandedTool={expandedTool}
              handleToolClick={handleToolClick}
              setAnchorEl={setAnchorEl}
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            // Ensure graph tool takes full width when expanded if it needs more space
          >
            <GraphACoin
              expandedTool={expandedTool}
              handleToolClick={handleToolClick}
            />
          </motion.div>

          {/* Category 2: Other Works I've Made for Other Projects */}
          <Typography
            variant="h5" // Consistent heading size
            sx={{
              color: "#ffffff",
              fontWeight: 600,
              textShadow: "0 0 6px rgba(111, 0, 255, 0.4)",
              fontSize: {
                xs: "clamp(1.1rem, 4.5vw, 1.4rem)",
                sm: "1.6rem",
              },
              mt: 4, // More space before this category
              mb: 1, // Space below heading
              textAlign: "center",
            }}
          >
            Other Works I've Made for Other Projects
          </Typography>
          {/* Suspense fallback outside motion.div for cleaner animation of content */}
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={30} sx={{ color: "#00f7ff" }} />
              </Box>
            }
          >
            <motion.div
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
            >
              <StudioSite
                expandedTool={expandedTool}
                handleToolClick={handleToolClick}
              />
            </motion.div>
            <motion.div
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
            >
              <AtemMini
                expandedTool={expandedTool}
                handleToolClick={handleToolClick}
              />
            </motion.div>
            <motion.div
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
            >
              <SeatBooking
                expandedTool={expandedTool}
                handleToolClick={handleToolClick}
              />
            </motion.div>
          </Suspense>

          {/* GitHub Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }} // Slightly increased hover scale
            whileTap={{ scale: 0.95 }}
            style={{ width: "100%", display: "flex", justifyContent: "center" }} // Center the button container
          >
            <Button
              variant="contained"
              href="https://github.com/CoponatRecords/Web3-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<GitHubIcon />} // Removed explicit fontSize, let theme handle it
              sx={{
                borderRadius: 2, // More rounded button
                background: "linear-gradient(90deg, #6f00ff, #00f7ff)",
                color: "#ffffff",
                fontSize: { xs: "0.8rem", sm: "0.95rem" }, // Larger font for button
                fontWeight: 600,
                textTransform: "none",
                py: { xs: 1, sm: 1.2 },
                px: { xs: 2.5, sm: 4 },
                mt: 3, // More space before the button
                mb: 2, // More space after the button
                minWidth: { xs: "180px", sm: "220px" }, // Slightly larger min width
                maxWidth: { xs: "350px", sm: "400px" }, // Slightly larger max width
                boxShadow: "0 4px 16px rgba(111, 0, 255, 0.4)", // Default shadow
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(90deg, #8b3bff, #1acccc)",
                  boxShadow: "0 6px 20px rgba(111, 0, 255, 0.6)", // More intense hover shadow
                },
                "&:active": {
                  background: "linear-gradient(90deg, #8b3bff, #1acccc)",
                  boxShadow: "0 2px 8px rgba(111, 0, 255, 0.2)", // Smaller shadow on active
                },
              }}
            >
              View Source on GitHub
            </Button>
          </motion.div>
        </Box>

        {/* Popover for InfoSection */}
        <Popover
          ref={popoverRef}
          id={popoverId} // Use the stable ID
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
        >
          <Suspense
            fallback={
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={30} sx={{ color: "#00f7ff" }} />
              </Box>
            }
          >
            <Typography
              sx={{
                p: { xs: 2, sm: 3 }, // More padding inside popover
                textAlign: "left", // Left align for readability
                color: "#ffffff",
                fontWeight: 400,
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
              }}
              component="div"
            >
              <InfoSection item={popoverRef} />
            </Typography>
          </Suspense>
        </Popover>
      </GlassContainer>
    </Box>
  );
};

export default Home;
