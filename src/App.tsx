import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLocalStorageComponents } from '../components/useLocalStorageComponents'; // Import the custom hook
import ChartComponent from '../components/ChartComponent'; // Your component
import './App.css'; // Import the CSS file

// List of available components (map the component names to actual components)
const componentsMap = {
  ChartComponent: ChartComponent, // Example mapping (expandable if needed)
};

const App = () => {
  const [components, setComponents] = useLocalStorageComponents(); // Use the custom hook
  const [newCoin, setNewCoin] = useState<string>('');

  // Handle adding a new coin component
  const handleAddCoin = () => {
    if (newCoin.trim() !== '') {
      const newCoinComponent = {
        id: Date.now(), // Unique ID based on timestamp
        componentName: 'ChartComponent', // Component name (this can be dynamic)
        coin: newCoin.toLowerCase(), // Convert coin to lowercase
      };
      setComponents((prev) => [...prev, newCoinComponent]);
      setNewCoin('');
    }
  };

  // Handle removing a component
  const handleRemove = (idToRemove: number) => {
    setComponents((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  return (
    <div>
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <Grid>
          <TextField
            label="Enter Coin Symbol"
            variant="outlined"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            fullWidth
            className="textField" // Apply the CSS class here
          />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddCoin}>
              Add Coin
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={1}>
          {components.map(({ id, componentName, coin }) => {
            const Component = componentsMap[componentName]; // Get the actual component from the map
            return (
              <Grid key={id} sx={{alignItems: "center"}}>
                <Card elevation={6} sx={{ borderRadius: 4, p: 2, position: 'relative' }}>
                  <IconButton onClick={() => handleRemove(id)} sx={{ position: 'absolute', top: 8, right: 8,    color: '#FF7F7F' }}>
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
    </div>
  );
};

export default App;
