import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import plan from "./plan";

// Define MUI theme to match Sarah Coponat's shop style
const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", sans-serif',
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      color: "#333333",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    subtitle1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
      color: "#666666",
      lineHeight: 1.8,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      color: "#333333",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    body2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
      color: "#666666",
    },
    caption: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
      color: "#333333",
    },
  },
  palette: {
    primary: {
      main: "#D4A017", // Muted gold
      dark: "#B88E14", // Darker gold for hover
    },
    background: {
      default: "#F7F7F7", // Soft white
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 600,
          borderRadius: "25px",
          padding: "10px 24px",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#B88E14",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontFamily: '"Montserrat", sans-serif',
            borderRadius: "8px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D4A017",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B88E14",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

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

// Legend item component
interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1.5 }}>
    <Box
      sx={{
        width: 20,
        height: 20,
        backgroundColor: color,
        borderRadius: "4px",
        marginRight: 1.5,
        border: color === "transparent" ? "1px solid #d1d5db" : "none",
      }}
    />
    <Typography
      sx={{
        fontFamily: '"Montserrat", sans-serif',
        fontWeight: 500,
        color: "#666666",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// Main component
const SalleCortotBooking: React.FC = () => {
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [venueCategories, setVenueCategories] = useState<Category[]>([]);
  const [chartName] = useState<string>("Sarah Coponat: Le Grand Concert");
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 1000,
    height: 800,
  });
  const [searchIds, setSearchIds] = useState<string>("");
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

  const selectedSeatIds = useMemo(() => {
    return seats
      .filter((seat) => seat.status === "selected")
      .map((seat) => seat.id);
  }, [seats]);

  const parsedSearchIds = useMemo(() => {
    return searchIds
      .split(/,| and /)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);
  }, [searchIds]);

  const handleCopySelectedIds = () => {
    navigator.clipboard.writeText(selectedSeatIds.join(", "));
    alert("IDs des sièges copiés dans le presse-papiers !");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchIds(event.target.value);
  };

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
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: "100%",
          mx: "auto",
          "@media (max-width: 600px)": {
            p: 3,
            mt: 8,
          },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" align="center" color="black">
            {chartName}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              maxWidth: "32rem",
              mx: "auto",
              mt: 3,
              mb: 2,
              textAlign: "center",
            }}
          >
            Choisissez votre place pour le grand concert de Sarah Coponat à la
            Salle Cortot, le 4 octobre 2025 !
          </Typography>
        </Box>
        <Box
          sx={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: "100%",
            backgroundColor: "#F7F7F7",
            borderRadius: "16px",
            overflow: "auto",
            boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
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

        <Box sx={{ mb: 8, maxWidth: "600px", mx: "auto" }}>
          <Box sx={{ mb: 8, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" sx={{ mb: 3, mt: 4, fontWeight: 600 }}>
              Places Sélectionnées
            </Typography>

            {selectedSeatIds.length > 0 ? (
              <Box>
                <Box
                  sx={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    pb: 1,
                    mb: 3,
                    mt: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {selectedSeatIds.join(", ")}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleCopySelectedIds}
                  sx={{
                    backgroundColor: "#D4A017",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#B88E14",
                    },
                  }}
                >
                  Copier les IDs des places
                </Button>
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1 }}
              >
                Aucune place sélectionnée.
              </Typography>
            )}
          </Box>

          <Typography variant="h6" sx={{ mb: 3, mt: 2 }}>
            Catégories
          </Typography>
          <Box sx={{ mb: 5 }}>
            {venueCategories.map((cat) => (
              <LegendItem key={cat.name} color={cat.color} label={cat.name} />
            ))}
            <LegendItem color="#ef4444" label="Réservé" />
          </Box>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Rechercher des places
          </Typography>
          <Box sx={{ mb: 4, maxWidth: "400px", mx: "auto" }}>
            <TextField
              label="Rechercher par ID"
              value={searchIds}
              onChange={handleSearchChange}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default SalleCortotBooking;
