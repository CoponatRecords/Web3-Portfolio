export const tokenSwapCode = `import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useSwap } from '../hooks/useSwap'; // Example of a custom hook

const TokenSwap = () => {
  const [amount, setAmount] = useState('0.1');
  const { executeSwap, isSwapping, error } = useSwap();

  const handleSwap = () => {
    executeSwap(amount);
  };

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">Token Swap (ETH to USDC)</Typography>
      <TextField
        label="Amount in ETH"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isSwapping}
      />
      <Button
        variant="contained"
        onClick={handleSwap}
        disabled={isSwapping || !amount}
      >
        {isSwapping ? <CircularProgress size={24} /> : 'Swap'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default TokenSwap;
`;
