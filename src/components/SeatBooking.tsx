import { Card, CardHeader, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const MotionLink = motion(Link);

const SeatBooking = ({ expandedTool, handleToolClick }) => {
  return (
    <MotionLink
      to="/cortot" // Changed from href to 'to' for internal routing
      style={{ textDecoration: "none" }} // Keeps the link from being underlined
      // You can add framer-motion props directly to MotionLink if you want
      // e.g., whileHover, whileTap, etc.
    >
      <Card
        sx={{
          borderRadius: 1,
          boxShadow:
            expandedTool === "seatbooking"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 4px 16px rgba(0, 0, 0, 0.2)",
          transform:
            expandedTool === "seatbooking" ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          zIndex: expandedTool === "seatbooking" ? 2 : 1,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleToolClick("seatbooking");
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
                Custom Seat Booking
              </Typography>
            </Box>
          }
        />
      </Card>
    </MotionLink>
  );
};

export default SeatBooking;
