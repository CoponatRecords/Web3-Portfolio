import { Card, CardHeader, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

type TokenSwapProps = {
  expandedTool:
    | "send"
    | "read"
    | "graph"
    | "swap"
    | "balance"
    | "studio"
    | "docker"
    | null;
  handleToolClick: (
    tool: "send" | "read" | "graph" | "swap" | "studio" | "balance" | "docker"
  ) => void;
};

const StudioSite: React.FC<TokenSwapProps> = ({
  expandedTool,
  handleToolClick,
}) => {
  return (
    <motion.a
      href="https://www.coponatrecords.com"
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
          borderRadius: 1,
          boxShadow:
            expandedTool === "studio"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 4px 16px rgba(0, 0, 0, 0.2)",
          transform: expandedTool === "studio" ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          zIndex: expandedTool === "studio" ? 2 : 1,
          width: { xs: "100%", sm: "400px" },
          "&:hover": {
            transform:
              expandedTool !== "studio" ? "scale(1.05)" : "scale(1.02)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            cursor: "pointer",
          },
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleToolClick("studio");
        }}
      >
        <CardHeader
          title={
            <Box width="100%" textAlign="center">
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.125rem", sm: "1.25rem" },
                  fontWeight: "bold",
                  color: "#ffffff",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                www.coponatrecords.com
              </Typography>
            </Box>
          }
        />
      </Card>
    </motion.a>
  );
};

export default StudioSite;
