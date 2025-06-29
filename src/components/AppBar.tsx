"use client"; // Important for Next.js App Router

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
import { ThemeProvider } from "@mui/material";
import theme from "../theme"; // Ensure this path is correct

export default function Header() {
  const location = useLocation();

  // Define reusable styles for consistent buttons
  const buttonBaseSx = {
    fontWeight: 600,
    borderRadius: 1, // Slight rounding for buttons
    px: { xs: 1.5, sm: 2 }, // Responsive padding
    py: { xs: 0.8, sm: 1 }, // Responsive padding
    minWidth: { xs: "auto", sm: 80 }, // Ensure buttons don't get too small
    transition: "all 0.3s ease-in-out", // Smooth transitions
    whiteSpace: "nowrap", // Prevent text wrap
    textTransform: "none", // Prevent ALL CAPS
  };

  // Style for all inactive/default contained buttons (Connect Wallet, Account, Home, Balance when not active)
  const inactiveContainedButtonSx = {
    background: "linear-gradient(90deg, #200040 0%, #000000 100%)", // Very dark gradient
    color: theme.palette.text.primary, // Bright text
    boxShadow: "0 2px 8px rgba(0,0,0,0.6)", // Deeper shadow
    "&:hover": {
      background: "linear-gradient(90deg, #300050 0%, #050010 100%)", // Slightly lighter on hover
      boxShadow: `0 0 15px ${theme.palette.secondary.light}, inset 0 0 8px ${theme.palette.secondary.main}`,
    },
  };

  // Style for active navigation buttons (Home, Balance when active)
  const activeButtonSx = {
    background: "linear-gradient(90deg, #200040 0%, #000000 100%)", // Very dark gradient
    color: theme.palette.text.primary, // Keep text bright
    boxShadow: `0 0 15px ${theme.palette.secondary.light}, inset 0 0 8px ${theme.palette.secondary.main}`,
    "&:hover": {
      background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`, // Reverse gradient on hover
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(10, 10, 20, 0.9)", // Darker base for the glass effect
          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`, // Use theme palette for consistency
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)", // Stronger, darker shadow for depth
          backdropFilter: "blur(12px)", // Slightly more blur for a smoother glass effect
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
          {" "}
          {/* Added gap for spacing between buttons */}
          {/* App Title/Logo (left-aligned) */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                letterSpacing: "0.5px",
                color: theme.palette.text.primary,
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                display: { xs: "none", sm: "block" },
              }}
            >
              Sébastien Coponat{" "}
            </Typography>
          </Box>
          {/* Navigation Buttons (Home & Balance) - Now styled like connect button */}
          <Button
            component={RouterLink} // Use RouterLink for navigation
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              ...buttonBaseSx, // Apply base styles
              ...(location.pathname === "/"
                ? activeButtonSx
                : inactiveContainedButtonSx), // Apply active/inactive styles
              // No mr: 2 here, let Toolbar gap handle spacing
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/wallet"
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
              ...buttonBaseSx, // Apply base styles
              ...(location.pathname === "/wallet"
                ? activeButtonSx
                : inactiveContainedButtonSx), // Apply active/inactive styles
              // No mr: 2 here, let Toolbar gap handle spacing
            }}
          >
            Balance
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
                            ...inactiveContainedButtonSx, // Apply the general inactive style
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
                            background: `linear-gradient(90deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                            color: theme.palette.error.contrastText,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                            "&:hover": {
                              background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
                            },
                          }}
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {/* Chain Button (still has its unique outlined style) */}
                        <Button
                          onClick={openChainModal}
                          sx={{
                            ...buttonBaseSx,
                            borderColor: theme.palette.secondary.dark,
                            color: theme.palette.secondary.main,
                            background: "rgba(0, 247, 255, 0.05)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 247, 255, 0.15)",
                              borderColor: theme.palette.secondary.main,
                              color: theme.palette.secondary.light,
                            },
                            boxShadow: "none", // Outlined style typically doesn't have strong box-shadow
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
                                marginRight: 6,
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
                          {chain.name}
                        </Button>

                        {/* Account Button */}
                        <Button
                          onClick={openAccountModal}
                          sx={{
                            ...buttonBaseSx,
                            ...inactiveContainedButtonSx, // Apply the general inactive style
                          }}
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      </Box>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
