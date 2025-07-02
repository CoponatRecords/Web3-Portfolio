// src/Header.tsx
"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  ThemeProvider,
  useTheme as useMuiTheme,
  styled,
  useMediaQuery,
} from "@mui/material"; // Ensure useMediaQuery is imported

import theme from "../theme"; // Assuming your theme is correctly imported

// --- Styled AppBar for consistent background and effects ---
const StyledAppBar = styled(AppBar)(({ theme: muiTheme }) => ({
  top: 0,
  backgroundColor: "rgba(10, 10, 20, 0.9)", // Fallback
  background: `linear-gradient(90deg, ${muiTheme.palette.background.paper} 0%, ${muiTheme.palette.background.default} 100%)`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(12px)",
  width: "100vw",
  overflowX: "hidden", // Important for mobile to prevent horizontal scroll
  left: 0,
  right: 0,
  zIndex: muiTheme.zIndex.appBar,
}));

// --- Main Header Component ---
export default function Header() {
  const location = useLocation();
  const muiTheme = useMuiTheme();

  // Optimized breakpoint check: Only one useMediaQuery call
  const isXs = useMediaQuery(muiTheme.breakpoints.down("sm")); // Directly use the media query

  // Memoize button base styles
  const buttonBaseSx = React.useMemo(
    () => ({
      fontWeight: 600,
      borderRadius: 1,
      transition: "all 0.3s ease-in-out",
      textTransform: "none",
      flexShrink: 0,
      minWidth: 0, // Allow buttons to shrink on small screens
      px: { xs: 0.5, sm: 1, md: 2 }, // Reduced padding for xs
      py: { xs: 0.4, sm: 0.6, md: 1 }, // Reduced padding for xs
      fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.875rem" }, // Smaller font for xs
    }),
    []
  );

  // Memoize inactive/default contained button styles
  const inactiveContainedButtonSx = React.useMemo(
    () => ({
      background: "linear-gradient(90deg, #200040 0%, #000000 100%)",
      color: muiTheme.palette.text.primary,
      boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
      "&:hover": {
        background: "linear-gradient(90deg, #300050 0%, #050010 100%)",
        boxShadow: `0 0 15px ${muiTheme.palette.secondary.light}, inset 0 0 8px ${muiTheme.palette.secondary.main}`,
      },
    }),
    [
      muiTheme.palette.text.primary,
      muiTheme.palette.secondary.light,
      muiTheme.palette.secondary.main,
    ] // Explicit dependencies
  );

  // Memoize active navigation button styles (depends on theme for hover effect)
  const activeButtonSx = React.useMemo(
    () => ({
      background: "linear-gradient(90deg, #00F7FF 0%, #00BFFF 100%)",
      color: "#111", // Dark text for active bright background
      boxShadow:
        "0 0 15px rgba(0, 247, 255, 0.8), inset 0 0 8px rgba(0, 247, 255, 0.5)",
      "&:hover": {
        background: "linear-gradient(90deg, #00DDEE 0%, #00AACC 100%)",
      },
    }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <StyledAppBar position="fixed">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: { xs: 0.5, sm: 1, md: 2 },
            px: { xs: 1, sm: 1.5, md: 2 },
            minHeight: { xs: 48, sm: 56, md: 64 },
            // Removed: overflowX: "hidden", (already on StyledAppBar)
          }}
        >
          {/* App Title/Logo (left-aligned) */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                letterSpacing: "0.5px",
                color: muiTheme.palette.text.primary,
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap",
                fontSize: { xs: "0.8rem", sm: "1rem", md: "1.25rem" },
              }}
            >
              Sébastien Coponat
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Button
            component={RouterLink}
            to="/"
            startIcon={
              <HomeIcon
                sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" } }}
              />
            }
            sx={{
              ...buttonBaseSx,
              ...(location.pathname === "/"
                ? activeButtonSx
                : inactiveContainedButtonSx),
            }}
          >
            {isXs ? "" : "Home"}
          </Button>
          <Button
            component={RouterLink}
            to="/wallet"
            startIcon={
              <AccountBalanceWalletIcon
                sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" } }}
              />
            }
            sx={{
              ...buttonBaseSx,
              ...(location.pathname === "/wallet"
                ? activeButtonSx
                : inactiveContainedButtonSx),
            }}
          >
            {isXs ? "" : "Balance"}
          </Button>

          {/* Custom RainbowKit Connect Button */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          sx={{
                            ...buttonBaseSx,
                            ...inactiveContainedButtonSx,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button
                          onClick={openChainModal}
                          sx={{
                            ...buttonBaseSx,
                            background: `linear-gradient(90deg, ${muiTheme.palette.error.dark} 0%, ${muiTheme.palette.error.main} 100%)`,
                            color: muiTheme.palette.error.contrastText,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                            "&:hover": {
                              background: `linear-gradient(90deg, ${muiTheme.palette.error.main} 0%, ${muiTheme.palette.error.dark} 100%)`,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
                            },
                            whiteSpace: "nowrap",
                          }}
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <Box
                        sx={{
                          display: "flex",
                          gap: { xs: 0.5, sm: 0.8, md: 1 },
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Button
                          onClick={openChainModal}
                          sx={{
                            ...buttonBaseSx,
                            borderColor: muiTheme.palette.secondary.dark,
                            color: muiTheme.palette.secondary.main,
                            background: "rgba(0, 247, 255, 0.05)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 247, 255, 0.15)",
                              borderColor: muiTheme.palette.secondary.main,
                              color: muiTheme.palette.secondary.light,
                            },
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            "& .MuiButton-startIcon": {
                              marginRight: isXs ? 0 : 6,
                            },
                          }}
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 14,
                                height: 14,
                                borderRadius: 999,
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 14, height: 14 }}
                                />
                              )}
                            </div>
                          )}
                          {isXs ? "" : chain.name}
                        </Button>

                        <Button
                          onClick={openAccountModal}
                          sx={{
                            ...buttonBaseSx,
                            ...inactiveContainedButtonSx,
                            maxWidth: { xs: 80, sm: 110, md: "unset" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {isXs
                            ? account.displayName?.slice(0, 4) + "..."
                            : account.displayName +
                              (account.displayBalance
                                ? ` (${account.displayBalance})`
                                : "")}
                        </Button>
                      </Box>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </Toolbar>
      </StyledAppBar>
    </ThemeProvider>
  );
}
