import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import plan from "./plan"; // Placeholder for your plan data
import salleCortot from "./salle-cortot.jpg";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebasedb";
// Hardcoded password
const PASSWORD = import.meta.env.VITE_CORTOTPASSWORD;

// Incorporer Postgress SQL

// Define MUI theme for a luxurious, concert-themed aesthetic
const theme = createTheme({
  typography: {
    fontFamily: '"Playfair Display", serif',
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      color: "#2B2A4C",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      fontSize: "2.5rem",
    },
    subtitle1: {
      fontFamily: '"Lora", serif',
      fontWeight: 400,
      color: "#5A5A5A",
      lineHeight: 1.9,
      fontSize: "1.1rem",
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      color: "#2B2A4C",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    body2: {
      fontFamily: '"Lora", serif',
      fontWeight: 400,
      color: "#5A5A5A",
    },
    caption: {
      fontFamily: '"Lora", serif',
      fontWeight: 500,
      color: "#2B2A4C",
    },
  },
  palette: {
    primary: {
      main: "#C19A6B",
      dark: "#A67B5B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2B2A4C",
      dark: "#1A1A2E",
    },
    background: {
      default: "#F9F6F2",
      paper: "rgba(255, 255, 255, 0.97)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: '"Lora", serif',
          fontWeight: 600,
          borderRadius: "30px",
          padding: "12px 28px",
          background: "linear-gradient(135deg, #C19A6B 0%, #A67B5B 100%)",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #A67B5B 0%, #8B5A2B 100%)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontFamily: '"Lora", serif',
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            transition: "all 0.3s ease",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#C19A6B",
            borderWidth: "2px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#A67B5B",
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2B2A4C",
            boxShadow: "0 0 8px rgba(43, 42, 76, 0.3)",
          },
          "& .MuiInputLabel-root": {
            fontFamily: '"Lora", serif',
            color: "#5A5A5A",
            "&.Mui-focused": {
              color: "#2B2A4C",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "24px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9F6F2 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1px solid rgba(193, 154, 107, 0.2)",
        },
      },
    },
  },
});

// Define interfaces
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

// Category colors
const categoryColors: { [key: string]: string } = {
  "Category I": "#C19A6B",
  "Category II": "#8B5A2B",
  "Category III": "#6B7280",
  "Category IV": "#4B5EAA",
  "Category V": "#2B2A4C",
};

// Get seat display color
const getSeatDisplayColor = (
  status: string,
  seatCategoryKey: string,
  venueCategoriesMap: { [key: string]: Category },
  isLocked: boolean
): string => {
  if (isLocked) return "#ef4444";
  if (status === "available") {
    const categoryDetails = venueCategoriesMap[seatCategoryKey];
    return categoryDetails ? categoryDetails.color : "#22c55e";
  }
  switch (status) {
    case "selected":
      return "#f97316";
    case "reserved":
      return "#ef4444";
    case "sold":
      return "#991b1b";
    default:
      return "#d1d5db";
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
  const seatSize = seat.radius * 3.5;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onClick={() => !isLocked && onClick()}
      onMouseEnter={() => !isLocked && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: seatSize,
        height: seatSize,
        backgroundColor,
        margin: 0.75,
        borderRadius: "50%",
        cursor: isLocked ? "not-allowed" : "pointer",
        position: "absolute",
        top: seat.absoluteY,
        left: seat.absoluteX,
        transform: "translate(-50%, -50%)",
        border: isHighlighted
          ? "3px solid #07d5f0"
          : "2px solid rgba(255,255,255,0.9)",
        boxShadow: isHighlighted
          ? "0 0 15px #07d5f0"
          : "0 3px 10px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
        animation:
          seat.status === "selected" && !isLocked
            ? "pulse 1.5s infinite ease-in-out"
            : "none",
        zIndex: isHovered || isHighlighted ? 10 : 1,
        "&:hover": {
          transform: isLocked
            ? "translate(-50%, -50%)"
            : "translate(-50%, -50%) scale(1.2)",
          boxShadow: isLocked
            ? "0 3px 10px rgba(0,0,0,0.2)"
            : "0 6px 20px rgba(0,0,0,0.3)",
        },
        "@keyframes pulse": {
          "0%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          "50%": {
            transform: "translate(-50%, -50%) scale(1.1)",
            opacity: 0.85,
          },
          "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        },
      }}
      role="button"
      aria-label={`Siège ${seat.seatNumber}, Catégorie ${seat.categoryKey}, Statut ${seat.status}`}
    >
      <Typography
        sx={{
          color: backgroundColor === "#C19A6B" ? "#2B2A4C" : "#FFFFFF",
          fontSize: `${seatSize * 0.45}px`,
          fontWeight: 700,
          textShadow:
            backgroundColor === "#C19A6B"
              ? "none"
              : "0 1px 3px rgba(0,0,0,0.6)",
          fontFamily: '"Lora", serif',
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.2s ease",
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
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      marginBottom: 2,
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "translateX(5px)",
      },
    }}
  >
    <Box
      sx={{
        width: 24,
        height: 24,
        backgroundColor: color,
        borderRadius: "6px",
        marginRight: 2,
        border: color === "transparent" ? "2px solid #d1d5db" : "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    />
    <Typography
      sx={{
        fontFamily: '"Lora", serif',
        fontWeight: 500,
        color: "#2B2A4C",
        fontSize: "1rem",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// Main component
const SalleCortotBooking: React.FC = () => {
  // Inside SalleCortotBooking component
  useEffect(() => {
    const fetchLockedSeats = async () => {
      setIsLoading(true);
      try {
        const eventDocRef = doc(db, "events", "sarah-coponat-2025");
        const unsubscribe = onSnapshot(eventDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const lockedIds = data.lockedSeatIds || [];
            setLockedSeatIds(lockedIds);
            setJsonInput(JSON.stringify(lockedIds, null, 2));
          } else {
            console.warn("Document does not exist");
            setLockedSeatIds([]);
            setJsonInput(JSON.stringify([], null, 2));
          }
          setIsLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
      } catch (error) {
        console.error("Error fetching locked seats:", error);
        alert("Erreur lors du chargement des sièges réservés.");
        setIsLoading(false);
      }
    };

    fetchLockedSeats();
  }, []);

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState(JSON.stringify([], null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Fetch locked seats
  useEffect(() => {
    const fetchLockedSeats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/lockedseats.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: string[] = await response.json();
        setLockedSeatIds(data);
        setJsonInput(JSON.stringify(data, null, 2)); // Initialize JSON editor with fetched data
      } catch (error) {
        console.error("Error fetching locked seats:", error);
        alert("Erreur lors du chargement des sièges réservés.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLockedSeats();
  }, []);

  // Handle password input and validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPassword(input);
    if (input === PASSWORD) {
      setIsUnlocked(true);
      setPasswordError(null);
    } else {
      setIsUnlocked(false);
      setPasswordError("Incorrect password");
    }
  };

  // Handle JSON input change and validation
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isUnlocked) return; // Prevent changes if not unlocked

    const input = e.target.value;
    setJsonInput(input);

    try {
      const parsed = JSON.parse(input);
      if (
        Array.isArray(parsed) &&
        parsed.every((id) => typeof id === "string")
      ) {
        setLockedSeatIds(parsed);
        setJsonError(null);
      } else {
        setJsonError("Invalid JSON: Must be an array of strings.");
      }
    } catch (err) {
      setJsonError("Invalid JSON: " + err.message);
    }

    try {
      const docRef = addDoc(collection(db, "cortot"), {
        seat: seats,
      });
      console.log(docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
    const textToCopy = selectedSeatIds.join(", ");

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("IDs des sièges copiés dans le presse-papiers !");
        })
        .catch((err) => {
          console.error("Clipboard copy failed:", err);
          fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
      fallbackCopyTextToClipboard(textToCopy);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        alert("IDs des sièges copiés dans le presse-papiers !");
      } else {
        alert("Échec de la copie dans le presse-papiers.");
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      alert("Erreur lors de la copie.");
    }

    document.body.removeChild(textArea);
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

      const chartWidth = maxX - minX + 100;
      const chartHeight = maxY - minY + 100;

      const offsetX = (chartWidth - (maxX - minX)) / 2 - minX;
      const offsetY = (chartHeight - (maxY - minY)) / 2 - minY + 5;

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
  }, [lockedSeatIds]);

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
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <CircularProgress sx={{ color: "#C19A6B" }} />
        </Box>
      )}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 6 },
          maxWidth: "1200px",
          mx: "auto",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9F6F2 100%)",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/concert-hall-bg.jpg')",
            backgroundSize: "cover",
            opacity: 0.05,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
            }}
          >
            {chartName}
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              maxWidth: "40rem",
              mx: "auto",
              mb: 2,
              mt: 2,
              fontStyle: "italic",
            }}
          >
            Choisissez votre place pour le grand concert de Sarah Coponat à la
            Salle Cortot, le 4 octobre 2025 !
          </Typography>

          <Box
            component="img"
            src={salleCortot}
            alt="Salle Cortot"
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: `${dimensions.width}px`,
                lg: `${dimensions.width}px`,
              },
              maxWidth: "100%",
              height: "auto",
              borderRadius: "16px",
              my: 3,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
          />
        </Box>
        <Box
          sx={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            maxWidth: "100%",
            background: "radial-gradient(circle, #FFFFFF 0%, #F9F6F2 100%)",
            borderRadius: "20px",
            overflow: "auto",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            margin: "auto",
            animation: "fadeIn 1s ease-in",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "scale(0.95)" },
              "100%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          <Grid
            justifyContent="center"
            alignItems="center"
            display="flex"
            sx={{
              position: "relative",
              width: `${dimensions.width}px`,
              minHeight: "100%",
              margin: "0 auto",
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
            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#FFFFFF",
                px: 3,
                borderRadius: "3px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                PIANO
              </Typography>
            </Box>
          </Grid>
        </Box>
        <Box sx={{ maxWidth: "600px", mx: "auto", mt: 6, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Gérer les places réservées
          </Typography>
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            variant="outlined"
            error={!!passwordError}
            helperText={passwordError}
            sx={{ mb: 3 }}
          />
          <TextField
            label="JSON des places réservées"
            value={jsonInput}
            onChange={handleJsonChange}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            disabled={!isUnlocked}
            error={!!jsonError}
            helperText={
              jsonError ||
              'Entrez un tableau JSON d\'IDs de sièges, ex: ["seat1", "seat2"]'
            }
            sx={{ mb: 3 }}
          />
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Places Sélectionnées
          </Typography>
          {selectedSeatIds.length > 0 ? (
            <Box>
              <Box
                sx={{
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  mb: 3,
                  mt: 2,
                  border: "2px solid #C19A6B",
                  borderRadius: "12px",
                  px: 3,
                  py: 2,
                  background: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#2B2A4C", fontWeight: 500 }}
                >
                  {selectedSeatIds.join(", ")}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleCopySelectedIds}
                sx={{ fontSize: "1rem", px: 4 }}
              >
                Copier les IDs des places
              </Button>
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#5A5A5A", mt: 1, fontStyle: "italic" }}
            >
              Aucune place sélectionnée.
            </Typography>
          )}
          <Typography variant="h6" sx={{ mb: 3, mt: 6, fontWeight: 600 }}>
            Catégories
          </Typography>
          <Box
            sx={{
              mb: 5,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {venueCategories.map((cat) => (
              <LegendItem key={cat.name} color={cat.color} label={cat.name} />
            ))}
            <LegendItem color="#ef4444" label="Réservé" />
          </Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Rechercher des places
          </Typography>
          <Box sx={{ mb: 4, maxWidth: "400px", mx: "auto" }}>
            <TextField
              label="Rechercher par ID"
              value={searchIds}
              onChange={handleSearchChange}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                    <SearchIcon sx={{ color: "#6bb7c1" }} />
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default SalleCortotBooking;
