import './App.css'; // Import the CSS file
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import CointousdChartContainer from '../components/CointousdChartContainer';
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SendingEthereum from '../components/EthProvider';

const App = () => {

  const [receiverAddress, setReceiverAddress] = useState('0x8ad46EBF14ACa31EaBC399edbA0F4188cFf6bf04');
  const [senderAddress, setSenderAddress] = useState('0x92FcD9d0424E3D3F3bB5a503a59A507F9A4607ee');
  const [amountToSend, setAmountToSend] = useState(0.001);

  // Handle the sending of coins
  const handleSend = (amountToSend,senderAddress, receiverAddress ) => {
    SendingEthereum(amountToSend, senderAddress, receiverAddress); 
  };

  return (
    <>
      <TextField
        label="Amount to send"
        variant="outlined"
        value={amountToSend}
        type="number"
        onChange={(e) => setAmountToSend(parseFloat(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Receiver address"
        variant="outlined"
        value={receiverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Sender address"
        variant="outlined"
        value={senderAddress}
        onChange={(e) => setSenderAddress(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={() =>handleSend(amountToSend, senderAddress, receiverAddress)} // Pass the function reference, not invoke it immediately
        disabled={!(senderAddress && receiverAddress && amountToSend > 0)} // Disable if invalid values
        fullWidth
      >
        Send
      </Button>

      <Box sx={{ mt: 4 }}>
        <CointousdChartContainer />
      </Box>
    </>
  );
};

// Wrap with Provider
// eslint-disable-next-line react-refresh/only-export-components
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
