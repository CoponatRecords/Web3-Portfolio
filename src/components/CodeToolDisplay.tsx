// src/components/CodeToolDisplay.tsx
import React, { useState, Suspense } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  styled,
  CircularProgress,
  Grid,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

// For proper syntax highlighting (optional, requires installation):
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define the PortfolioTool enum (must be consistent with Home.tsx)
export enum PortfolioTool {
  SEND = "send",
  GRAPH = "graph",
  SWAP = "swap",
  READ = "read",
  BALANCE = "balance",
  STUDIO_SITE = "studioSite",
  ATEM_MINI = "atemMini",
  SEAT_BOOKING = "seatBooking",
}

// Common props interface for the lazy-loaded tool components
export interface CommonToolProps {
  // When a tool is "open", it might need to know if it's the currently expanded one
  expandedTool: PortfolioTool | null;
  // If a tool has internal clicks that should 're-expand' it or trigger something, it can use this.
  // In this new design, the 'handleToolClick' might be less direct for expansion,
  // but still useful for internal tool logic that impacts the parent state.
  handleToolClick: (tool: PortfolioTool) => void;
  setAnchorEl?: (element: HTMLElement | null) => void;
  toolEnum: PortfolioTool;
}

// Interface for the combined tool data
export interface ToolData {
  Component: React.ComponentType<CommonToolProps>;
  codeContent: string;
  name: string;
  toolEnum: PortfolioTool;
}

// Styled component for the code display area
const CodeDisplayBox = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[900], // Dark background for code
  color: theme.palette.success.light, // Greenish text for code
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflowX: "auto", // Enable horizontal scrolling for long lines
  fontFamily: "monospace",
  fontSize: "0.85rem",
  minHeight: "200px", // Ensure it has some height even if content is short
  whiteSpace: "pre-wrap", // Preserve whitespace and wrap long lines
  wordBreak: "break-word", // Break words if they are too long
  flexGrow: 1, // Allow it to take available height
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": {
    height: "8px",
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[700],
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.grey[800],
  },
}));

// Re-defining ToolCard here for CodeToolDisplay's internal use,
// ensuring consistent styling for the interactive tool part.
const ToolCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  color: theme.palette.text.primary,
  minHeight: "150px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 8px 25px rgba(0, 0, 0, 0.4), 0 0 20px ${theme.palette.primary.main}`,
    background: "rgba(255, 255, 255, 0.12)",
  },
  flexGrow: 1, // Allow card to fill height
}));

interface CodeToolDisplayProps {
  toolData: ToolData; // Now receives a single ToolData object
  expandedTool: PortfolioTool | null; // From Home.tsx, which tool is currently globally expanded
  handleToolClick: (tool: PortfolioTool) => void; // From Home.tsx, to manage global expansion
  setAnchorEl?: (element: HTMLElement | null) => void;
  onClose: () => void; // New prop to close the expanded view
}

const CodeToolDisplay: React.FC<CodeToolDisplayProps> = ({
  toolData,
  expandedTool,
  handleToolClick,
  setAnchorEl,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("md"));
  const [showCode, setShowCode] = useState<boolean>(false); // State for mobile toggle

  // Check if this specific tool is the one currently expanded
  const isOpen: boolean = expandedTool === toolData.toolEnum;

  // Handle click on the "Open Tool" button within the card view
  const handleOpenTool = (): void => {
    handleToolClick(toolData.toolEnum); // Tell parent to expand this tool
  };

  const toggleView = (): void => {
    setShowCode((prev) => !prev);
  };

  // If the tool is not open, display a clickable card to open it
  if (!isOpen) {
    return (
      <ToolCard sx={{ cursor: "pointer" }} onClick={handleOpenTool}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: theme.palette.primary.light, fontWeight: 600, mb: 2 }}
          >
            {toolData.name}
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              background: theme.palette.secondary.main,
              "&:hover": { background: theme.palette.secondary.dark },
              fontWeight: 600,
            }}
          >
            Open Tool
          </Button>
        </CardContent>
      </ToolCard>
    );
  }

  // If the tool is open, display the tool and its code
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 1, sm: 2 },
        borderRadius: theme.shape.borderRadius * 1.5,
        background: "rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.05)",
        position: "relative", // For absolute positioning of close button
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: theme.spacing(1),
          right: theme.spacing(1),
          color: theme.palette.error.main,
          zIndex: 1,
          background: "rgba(0,0,0,0.5)",
          "&:hover": { background: "rgba(0,0,0,0.7)" },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.primary.light,
          fontWeight: 600,
          textAlign: "center",
          mb: 1,
        }}
      >
        {toolData.name}
      </Typography>

      {isMobile ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}
        >
          <Button
            variant="contained"
            onClick={toggleView}
            sx={{
              background: theme.palette.info.main,
              "&:hover": { background: theme.palette.info.dark },
              fontWeight: 600,
            }}
          >
            {showCode ? "Show Interactive Tool" : "Show Code Logic"}
          </Button>
          {showCode ? (
            <CodeDisplayBox>
              {/* If using react-syntax-highlighter */}
              {/* <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers>
                {toolData.codeContent}
              </SyntaxHiofghlighter> */}
              <pre style={{ margin: 0 }}>
                <code>{toolData.codeContent}</code>
              </pre>
            </CodeDisplayBox>
          ) : (
            <ToolCard>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress
                        size={30}
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    </Box>
                  }
                >
                  <toolData.Component
                    expandedTool={expandedTool}
                    handleToolClick={handleToolClick}
                    {...(setAnchorEl ? { setAnchorEl } : {})}
                    toolEnum={toolData.toolEnum}
                  />
                </Suspense>
              </CardContent>
            </ToolCard>
          )}
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1,
                textAlign: "center",
              }}
            >
              Interactive Tool
            </Typography>
            <ToolCard>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <CircularProgress
                        size={30}
                        sx={{ color: theme.palette.secondary.main }}
                      />
                    </Box>
                  }
                >
                  <toolData.Component
                    expandedTool={expandedTool}
                    handleToolClick={handleToolClick}
                    {...(setAnchorEl ? { setAnchorEl } : {})}
                    toolEnum={toolData.toolEnum}
                  />
                </Suspense>
              </CardContent>
            </ToolCard>
          </Grid>
          <Grid>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1,
                textAlign: "center",
              }}
            >
              Code Logic
            </Typography>
            <CodeDisplayBox>
              {/* If using react-syntax-highlighter */}
              {/* <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers>
                {toolData.codeContent}
              </SyntaxHighlighter> */}
              <pre style={{ margin: 0 }}>
                <code>{toolData.codeContent}</code>
              </pre>
            </CodeDisplayBox>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CodeToolDisplay;
