import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: {
      fontSize: "1.25rem",
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (max-width:600px)": {
        fontSize: "0.875rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
});

export default theme;