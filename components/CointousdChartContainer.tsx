import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChartComponent from "./ChartComponent";
import { useDispatch, useSelector } from "react-redux";
import { addCoin, removeCoin } from "../redux/slices/coinListReducer";
import { RootState } from "../redux/store";

function CointousdChartContainer() {
  const dispatch = useDispatch();
  const coinList = useSelector((state: RootState) => state.coinList.coins); // le retrigger est automatique
  const [newCoin, setNewCoin] = useState<string>("");

  // Log coinList every time it changes
  useEffect(() => {
    console.log("Updated coinList:", JSON.parse(JSON.stringify(coinList)));
  }, [coinList]);

  const handleAddCoin = () => {
    if (newCoin.trim() !== "") {
      const coin = newCoin.toLowerCase();

      dispatch(addCoin(coin)); // add the component with coin symbol
      setNewCoin("");
    }
  };

  const handleRemove = (idToRemove: number) => {
    dispatch(removeCoin(idToRemove)); // Remove coin from the list
  };

  const componentsMap: Record<string, React.FC<{ coin: string }>> = {
    ChartComponent: ChartComponent, // Mapping the ChartComponent
  };

  return (
    <>
      <Box
        sx={{
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 1,
          p: 4,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "background.paper",

        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Graph a Coin
        </Typography>{" "}
        <Container>
          <Grid container>
              <TextField
                label="Enter Coin Symbol"
                variant="outlined"
                value={newCoin}
                onChange={(e) => setNewCoin(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleAddCoin}
                fullWidth
              >
                Add Coin
              </Button>
              <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "row",
              gap: 2, // spacing between items
              flexWrap: "wrap", // optional: wrap to next line if needed
            }}
          >
            {coinList.map((coinItem) => (
              <Typography key={coinItem.id}>
                {coinItem.coin.toUpperCase()}
              </Typography>
            ))}
          </Box>
            
          </Grid>
        </Container>

        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Grid container spacing={2}>
            {coinList.map(({ id, coin }) => {
              const Component = componentsMap["ChartComponent"]; // Dynamically use the correct component
              return (
                <Grid size={12} key={id}>
                  <Card
                    elevation={6}
                    sx={{ borderRadius: 4, p: 2, position: "relative" }}
                  >
                    <IconButton
                      onClick={() => handleRemove(id)} // Simplified to a single dispatch call
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#FF7F7F",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <CardContent>
                      {Component && <Component coin={coin} />}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default CointousdChartContainer;
