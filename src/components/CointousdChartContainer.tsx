import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import ChartComponent from "./ChartComponent";
import { useDispatch, useSelector } from "react-redux";
import { addCoin, removeCoin } from "../redux/slices/coinListReducer";
import { RootState } from "../redux/store";

const CointousdChartContainer = () => {
  const dispatch = useDispatch();
  const coinList = useSelector((state: RootState) => state.coinList.coins);
  const [newCoin, setNewCoin] = useState<string>("");

  const handleAddCoin = () => {
    if (newCoin.trim() !== "") {
      const coin = newCoin.toLowerCase();
      dispatch(addCoin(coin));
      setNewCoin("");
    }
  };

  const handleRemove = (idToRemove: number) => {
    dispatch(removeCoin(idToRemove));
  };

  const componentsMap: Record<string, React.FC<{ coin: string }>> = {
    ChartComponent: ChartComponent,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            label="Enter Coin Symbol"
            variant="outlined"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "#ffffff",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: 1,
            }}
          />
        </Grid>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            borderRadius: 1,
            background: "linear-gradient(90deg, #6200ea 0%, #304ffe 100%)",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(90deg, #7f39fb 0%, #3f51b5 100%)",
            },
            "&:disabled": {
              background: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.5)",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleAddCoin();
          }}
          fullWidth
        >
          Add Coin
        </Button>
      </Grid>
      <Grid size={12}>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {coinList.map((coinItem) => (
            <Typography
              key={coinItem.id}
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: "bold",
                color: "#ffffff",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              {coinItem.coin.toUpperCase()}
            </Typography>
          ))}
        </Box>
      </Grid>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {coinList.map(({ id, coin }) => {
            const Component = componentsMap["ChartComponent"];
            return (
              <Grid size={12} key={id}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <CloseIcon
                    onClick={(e) => {
                      handleRemove(id);
                      e.stopPropagation();
                    }}
                  />

                  {Component && <Component coin={coin} />}
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </motion.div>
  );
};

export default CointousdChartContainer;
