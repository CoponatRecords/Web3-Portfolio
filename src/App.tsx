import './App.css'; // Import the CSS file
import { store } from '../redux/store';
import { Provider, useDispatch } from 'react-redux';
import CointousdChartContainer from '../components/CointousdChartContainer';
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { sendCoin } from '../redux/slices/coinSendReducer';

const App = () => {
  const dispatch = useDispatch();
  const [receiverAddress, setReceiverAddress] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState(0.001);

  const handleSend = () => {
    if (!senderAddress || !receiverAddress || !amountToSend) return;

    dispatch(sendCoin({
      amount: amountToSend,
      receiver: receiverAddress,
      sender: senderAddress,
    }));
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
        onClick={handleSend}
        disabled={!(senderAddress && receiverAddress && amountToSend)}
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

// Wrap avec Provider
// eslint-disable-next-line react-refresh/only-export-components
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
