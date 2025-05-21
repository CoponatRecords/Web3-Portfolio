import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import plan from "./plan";

// Define interfaces for TypeScript
interface SeatData {
  id: string;
  seatNumber: string;
  guid: string;
  absoluteX: number;
  absoluteY: number;
  radius: number;
  categoryKey: string;
  status: "available" | "selected" | "reserved" | "sold";
}

interface Category {
  name: string;
  color: string;
}

interface Position {
  x?: number;
  y?: number;
}

interface PlanSeat {
  uuid: string;
  seat_number: string;
  seat_guid: string;
  position: { x: number; y: number };
  category?: string;
  radius?: number;
}

interface Row {
  position?: Position;
  seats: PlanSeat[];
}

interface Zone {
  position?: Position;
  rows: Row[];
}

interface PlanData {
  zones: Zone[];
  categories: Category[];
  name?: string;
}

// Define category colors with improved contrast
const categoryColors: { [key: string]: string } = {};

// Get seat display color
const getSeatDisplayColor = (
  status: string,
  seatCategoryKey: string,
  venueCategoriesMap: { [key: string]: Category },
  isLocked: boolean
): string => {
  if (isLocked) return "#ef4444"; // Red for locked
  if (status === "available") {
    const categoryDetails = venueCategoriesMap[seatCategoryKey];
    return categoryDetails ? categoryDetails.color : "#22c55e"; // Green as default
  }
  switch (status) {
    case "selected":
      return "#f97316"; // Orange
    case "reserved":
      return "#ef4444"; // Red
    case "sold":
      return "#991b1b"; // Dark red
    default:
      return "#d1d5db"; // Gray
  }
};

// Seat component
interface SeatProps {
  seat: SeatData;
  onClick: () => void;
  venueCategoriesMap: { [key: string]: Category };
  isLocked: boolean;
  isHighlighted: boolean;
}

const Seat: React.FC<SeatProps> = ({
  seat,
  onClick,
  venueCategoriesMap,
  isLocked,
  isHighlighted,
}) => {
  const backgroundColor = getSeatDisplayColor(
    seat.status,
    seat.categoryKey,
    venueCategoriesMap,
    isLocked
  );
  const seatSize = seat.radius * 3;

  return (
    <Box
      onClick={() => !isLocked && onClick()}
      sx={{
        width: seatSize,
        height: seatSize,
        backgroundColor,
        margin: 0.5,
        borderRadius: "50%",
        cursor: isLocked ? "not-allowed" : "pointer",
        position: "absolute",
        top: seat.absoluteY,
        left: seat.absoluteX,
        transform: "translate(-50%, -50%)",
        border: isHighlighted ? "3px solid #D4A017" : "1.5px solid #FFFFFF",
        boxShadow: isHighlighted
          ? "0 0 12px rgba(212, 160, 23, 0.7)"
          : "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s, border 0.2s",
        "&:hover": {
          transform: !isLocked
            ? "translate(-50%, -50%) scale(1.1)"
            : "translate(-50%, -50%)",
          boxShadow: !isLocked
            ? "0 4px 12px rgba(0,0,0,0.3)"
            : "0 2px 8px rgba(0,0,0,0.15)",
        },
      }}
      title={`Siège: ${seat.seatNumber}\nCatégorie: ${
        seat.categoryKey || "N/A"
      }\nStatut: ${seat.status}`}
    >
      <Typography
        sx={{
          color: backgroundColor === "#DAA520" ? "#333333" : "#FFFFFF",
          fontSize: `${seatSize * 0.4}px`,
          fontWeight: 600,
          textShadow:
            backgroundColor === "#DAA520"
              ? "none"
              : "0 1px 2px rgba(0,0,0,0.5)",
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        {seat.seatNumber}
      </Typography>
    </Box>
  );
};

// Main component
const SeatPlan: React.FC = () => {
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [venueCategories, setVenueCategories] = useState<Category[]>([]);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 1000,
    height: 800,
  });
  const [searchIds] = useState<string>("");
  const [lockedSeatIds, setLockedSeatIds] = useState<string[]>([]);

  // Fetch locked seats from JSON
  useEffect(() => {
    const fetchLockedSeats = async () => {
      try {
        const response = await fetch("/lockedseats.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: string[] = await response.json();
        setLockedSeatIds(data);
      } catch (error) {
        console.error("Error fetching locked seats:", error);
        alert("Erreur lors du chargement des sièges réservés.");
      }
    };

    fetchLockedSeats();
  }, []);

  const venueCategoriesMap = useMemo(() => {
    const map: { [key: string]: Category } = {};
    venueCategories.forEach((cat) => {
      map[cat.name] = { ...cat, color: categoryColors[cat.name] || cat.color };
    });
    return map;
  }, [venueCategories]);

  const parsedSearchIds = useMemo(() => {
    return searchIds
      .split(/,| and /)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }, [searchIds]);

  useEffect(() => {
    if (plan && plan[0]?.zones && plan[0]?.categories) {
      const processedSeats: SeatData[] = [];
      let minX = Infinity,
        maxX = -Infinity;
      let minY = Infinity,
        maxY = -Infinity;

      const planData = plan[0] as PlanData;
      planData.zones.forEach((zone: Zone) => {
        zone.rows.forEach((row: Row) => {
          row.seats.forEach((seat: PlanSeat) => {
            const absoluteX =
              (zone.position?.x || 0) +
              (row.position?.x || 0) +
              seat.position.x;
            const absoluteY =
              (zone.position?.y || 0) +
              (row.position?.y || 0) +
              seat.position.y;

            minX = Math.min(minX, absoluteX);
            maxX = Math.max(maxX, absoluteX);
            minY = Math.min(minY, absoluteY);
            maxY = Math.max(maxY, absoluteY);

            let categoryKey = seat.category;
            if (!categoryKey) {
              const seatNum = parseInt(seat.seat_number);
              if (seatNum <= 110) categoryKey = "Category I";
              else if (seatNum <= 120) categoryKey = "Category II";
              else if (seatNum <= 130) categoryKey = "Category III";
              else if (seatNum <= 140) categoryKey = "Category IV";
              else categoryKey = "Category V";
            }

            processedSeats.push({
              id: seat.uuid,
              seatNumber: seat.seat_number,
              guid: seat.seat_guid,
              absoluteX,
              absoluteY,
              radius: seat.radius || 5,
              categoryKey,
              status: lockedSeatIds.includes(seat.uuid)
                ? "reserved"
                : "available",
            });
          });
        });
      });

      // Calculate chart dimensions
      const chartWidth = maxX - minX + 100; // Add padding
      const chartHeight = maxY - minY + 100; // Add space for title, subtitle, piano

      // Center seats
      const offsetX = (chartWidth - (maxX - minX)) / 2 - minX;
      const offsetY = (chartHeight - (maxY - minY)) / 2 - minY + 5; // Shift down for title/subtitle

      const centeredSeats = processedSeats.map((seat) => ({
        ...seat,
        absoluteX: seat.absoluteX + offsetX,
        absoluteY: seat.absoluteY + offsetY,
      }));

      setSeats(centeredSeats);
      setVenueCategories(
        planData.categories.map((cat: Category) => ({
          ...cat,
          color: categoryColors[cat.name] || cat.color,
        }))
      );
      setDimensions({ width: chartWidth, height: chartHeight });
    }
  }, [lockedSeatIds]); // Re-run when lockedSeatIds changes

  const handleSeatClick = (id: string) => {
    if (lockedSeatIds.includes(id)) return;
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === id
          ? {
              ...seat,
              status:
                seat.status === "available"
                  ? "selected"
                  : seat.status === "selected"
                  ? "available"
                  : seat.status,
            }
          : seat
      )
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: "white",

        maxWidth: "100%",
        mx: "auto",
        "@media (max-width: 600px)": {
          mt: 8,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: "100%",
          backgroundColor: "white",
          borderRadius: "16px",
          overflow: "auto",
          margin: "auto auto",
          "@media (max-width: 600px)": {
            width: "100%",
            pt: 1,
          },
        }}
      >
        {seats.map((seat) => {
          const isLocked = lockedSeatIds.includes(seat.id);
          const isHighlighted = parsedSearchIds.includes(seat.id);
          return (
            <Seat
              key={seat.id}
              seat={seat}
              onClick={() => handleSeatClick(seat.id)}
              venueCategoriesMap={venueCategoriesMap}
              isLocked={isLocked}
              isHighlighted={isHighlighted}
            />
          );
        })}
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            bottom: 0,
            left: "52%",
            transform: "translateX(-50%)",
            color: "#333333",
            fontWeight: 900,
          }}
        >
          PIANO
        </Typography>
      </Box>
    </Paper>
  );
};

export default SeatPlan;
