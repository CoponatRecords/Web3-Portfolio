import { createTheme, darken, lighten } from "@mui/material/styles";

// Define your primary and accent colors
const primaryMain = "#6200ea"; // A deep purple for primary actions
const accentMain = "#00f7ff"; // A vibrant cyan for highlights and interactivity
const errorMain = "#f44336"; // Standard error red
const successMain = "#03dac6"; // A vibrant green for success

const theme = createTheme({
  // 1. Palette: Define your color scheme
  palette: {
    mode: "dark", // Set the default mode to dark
    primary: {
      main: primaryMain,
      light: lighten(primaryMain, 0.2),
      dark: darken(primaryMain, 0.2),
      contrastText: "#ffffff", // Always white for good contrast
    },
    secondary: {
      main: accentMain,
      light: lighten(accentMain, 0.2),
      dark: darken(accentMain, 0.2),
      contrastText: "#1a1a2e", // Dark background for contrast
    },
    error: {
      main: errorMain,
    },
    success: {
      main: successMain,
    },
    background: {
      default: "#0a0a1a", // Even darker default background
      paper: "#1a1a2e", // Darker background for Cards, Paper, etc.
    },
    text: {
      primary: "#e0e0e0", // Lighter general text
      secondary: "rgba(255, 255, 255, 0.7)", // Softer secondary text
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    action: {
      disabledBackground: "rgba(255, 255, 255, 0.12)", // Subtle disabled background
      disabled: "rgba(255, 255, 255, 0.4)", // Subtle disabled text
    },
  },

  // 2. Typography: Set global font styles
  typography: {
    fontFamily: ['"Inter"', "sans-serif"].join(","), // Assuming Inter or similar sleek font
    h5: {
      fontWeight: 700,
      fontSize: "1.5rem",
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
      color: "#ffffff",
    },
    body1: {
      fontSize: "1rem",
      color: "#e0e0e0",
    },
    body2: {
      fontSize: "0.875rem",
      color: "rgba(255, 255, 255, 0.7)",
    },
    caption: {
      fontSize: "0.75rem",
      color: "rgba(255, 255, 255, 0.5)",
      fontStyle: "italic",
    },
    button: {
      textTransform: "none", // Remove uppercase default
      fontWeight: 600,
    },
  },

  // 3. Components: Override default MUI component styles
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0, // Control elevation centrally
      },
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%)",
          border: "1px solid rgba(0, 247, 255, 0.1)", // Subtle light border
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.4)",
          transition:
            "transform 0.4s ease, box-shadow 0.4s ease, border 0.4s ease",
          "&:hover": {
            boxShadow:
              "0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 247, 255, 0.2)",
            // No transform here, let the individual component handle its expanded state
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          background: "linear-gradient(45deg, #0f3460 30%, #1a1a2e 90%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          cursor: "pointer",
          // The specific active border will still be in the component due to `expandedTool`
        },
        title: {
          color: "#e0e0e0",
          textShadow: "0 0 8px rgba(0, 247, 255, 0.5)",
        },
        // MuiCardHeader has no direct subtitle, it's part of content, adjust as needed
        // For the caption in your example, you'd apply Typography variant="body2" within title/subheader
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "32px", // Default increased padding
          background: "rgba(30, 30, 40, 0.8)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "#e0e0e0",
            padding: "12px 14px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.2)",
            transition: "border-color 0.3s ease",
            borderRadius: 8, // Rounded text fields
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 247, 255, 0.4)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: accentMain,
            borderWidth: "2px",
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: accentMain,
          },
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.12)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained", // All buttons contained by default?
      },
      styleOverrides: {
        root: {
          borderRadius: 8, // Consistent rounded buttons
          fontWeight: 600,
          padding: "12px 24px",
          background: "linear-gradient(90deg, #6200ea 0%, #00f7ff 100%)", // Your vibrant gradient
          color: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 247, 255, 0.4)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            background: "linear-gradient(90deg, #7f39fb 0%, #1acccc 100%)",
            boxShadow: "0 6px 25px rgba(0, 247, 255, 0.6)",
            transform: "translateY(-2px)",
          },
          "&:disabled": {
            background: "rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.4)",
            boxShadow: "none",
            transform: "none",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #6200ea 0%, #00f7ff 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 15px rgba(0, 247, 255, 0.3)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            background: "linear-gradient(45deg, #7f39fb 0%, #1acccc 100%)",
            boxShadow: "0 6px 20px rgba(0, 247, 255, 0.5)",
            transform: "scale(1.15)", // Default hover scale for all icon buttons
          },
          "&:disabled": {
            background: "rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.4)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: 8, // Rounded list items
          marginBottom: 8,
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: "48px", // Adjust spacing
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #6200ea 0%, #304ffe 100%)",
          color: "#ffffff",
          width: 40,
          height: 40,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease",
          "& img": {
            borderRadius: "50%",
            objectFit: "contain",
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          // Global snackbar positioning or width
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          width: "100%",
          minWidth: "280px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          borderRadius: 12, // Consistent border radius
          fontSize: "0.95rem",
          "& .MuiAlert-icon": {
            color: "rgba(255,255,255,0.8) !important", // Ensure icon color is white
          },
          ...(ownerState.severity === "success" && {
            background: `linear-gradient(45deg, ${
              theme.palette.success.main
            } 30%, ${lighten(theme.palette.success.main, 0.2)} 90%)`,
            color: "#ffffff",
          }),
          ...(ownerState.severity === "error" && {
            background: `linear-gradient(45deg, ${
              theme.palette.error.main
            } 30%, ${lighten(theme.palette.error.main, 0.2)} 90%)`,
            color: "#ffffff",
          }),
          // Default styles applied by palette.mode: 'dark'
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: accentMain, // Default link color
          textDecoration: "underline",
          transition: "color 0.2s ease",
          "&:hover": {
            color: lighten(accentMain, 0.2), // Lighter on hover
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: accentMain, // Default color for all progress indicators
        },
      },
    },
  },
});

export default theme;
