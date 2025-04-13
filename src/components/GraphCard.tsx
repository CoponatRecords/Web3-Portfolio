import React from "react";
import { Card, CardHeader, CardContent, Collapse, Typography } from "@mui/material";
import CointousdChartContainer from "./CointousdChartContainer";

interface Props {
  expanded: boolean;
  onClick: () => void;
}

const GraphCard: React.FC<Props> = ({ expanded, onClick }) => (
  <Card
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 4,
      boxShadow: expanded ? 6 : 3,
      transform: expanded ? "scale(1.2)" : "scale(1)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      zIndex: expanded ? 2 : 1,
      cursor: "pointer",
      width: { xs: "100%", sm: "400px" },
      ...(expanded !== true && {
        "&:hover": {
          transform: "scale(1.05)",
        },
      }),
    }}
    onClick={onClick}
  >
    <CardHeader
      title={
        <Typography variant="h6" sx={{ textAlign: "center", color: "text.primary" }}>
          Graph a Coin
        </Typography>
      }
      sx={{ textAlign: "center", p: { xs: 1.5, sm: 2 } }}
    />
    <Collapse in={expanded}>
      <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 1 }}>
        <CointousdChartContainer />
      </CardContent>
    </Collapse>
  </Card>
);

export default GraphCard;
