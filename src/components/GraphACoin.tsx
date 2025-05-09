import {
  Card,
  CardHeader,
  Typography,
  Collapse,
  CardContent,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import CointousdChartContainer from "./CointousdChartContainer";

type GraphACoinProps = {
  expandedTool: "send" | "read" | "graph" | "swap" | "balance" | null;
  handleToolClick: (
    tool: "send" | "read" | "graph" | "swap" | "balance"
  ) => void;
};

export const GraphACoin = ({
  expandedTool,
  handleToolClick,
}: GraphACoinProps) => {
  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
        borderRadius: 4,
        boxShadow:
          expandedTool === "graph"
            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        transform: expandedTool === "graph" ? "scale(1.02)" : "scale(1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        zIndex: expandedTool === "graph" ? 2 : 1,
        cursor: "pointer",
        width: { xs: "100%", sm: "400px" },
        "&:hover": {
          transform: expandedTool !== "graph" ? "scale(1.05)" : "scale(1.02)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      }}
      onClick={(e) => {
        handleToolClick("graph");
        e.stopPropagation();
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
            <Collapse in={expandedTool === "graph"}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontStyle: "italic",
                }}
              >
                View coin price history in USD
              </Typography>
            </Collapse>
          </Box>
        }
        sx={{
          p: { xs: 1.5, sm: 2 },
          textAlign: "center",
        }}
      />
      <Collapse in={expandedTool === "graph"}>
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
  );
};
