import {
  Card,
  CardHeader,
  Typography,
  Collapse,
  CardContent,
  Box,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import CointousdChartContainer from "./CointousdChartContainer";
import theme from "../theme";
import { memo } from "react";

type GraphACoinProps = {
  expandedTool: "send" | "read" | "graph" | "swap" | "balance" | null; // null indicates no tool is expanded
  handleToolClick: (
    tool: "send" | "read" | "graph" | "swap" | "balance"
  ) => void;
};

const GraphACoin = ({ expandedTool, handleToolClick }: GraphACoinProps) => {
  const isExpanded = expandedTool === "graph";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is xs or sm

  return (
    <motion.div
      layout
      animate={{
        width: isExpanded ? "100%" : isSmallScreen ? "100%" : "400px",
        marginLeft: isExpanded ? 0 : "auto",
        marginRight: isExpanded ? 0 : "auto",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Card
        role="button"
        tabIndex={0}
        sx={{
          transition: "transform 0.3s ease, box-shadow 0.3s ease",

          background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
          borderRadius: 1,
          boxShadow: isExpanded
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
          zIndex: isExpanded ? 2 : 1,
          cursor: "pointer",
          width: "100%",
          "&:hover": {
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            transform: expandedTool !== "graph" ? "scale(1.05)" : "scale(1.02)",
          },
        }}
        onClick={(e) => {
          handleToolClick("graph");
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleToolClick("graph");
            e.preventDefault();
          }
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
                Graph a Coin
              </Typography>
              <Collapse in={isExpanded}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontStyle: "italic",
                  }}
                >
                  View live Binance coin price in USD
                </Typography>
              </Collapse>
            </Box>
          }
          sx={{
            p: { xs: 1.5, sm: 2 },
            textAlign: "center",
          }}
        />
        <Collapse in={isExpanded}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <CardContent
              sx={{
                p: { xs: 2, sm: 3 },
                pt: 1,
                background: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <CointousdChartContainer />
            </CardContent>
          </motion.div>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default memo(GraphACoin);
