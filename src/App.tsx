import './App.css'; // Import the CSS file
import { store } from '../redux/store';
import { Provider, useDispatch } from 'react-redux';
import CointousdChartContainer from '../components/CointousdChartContainer';
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { sendCoin } from '../redux/slices/coinSendReducer';
import SendingEthereum from '../components/EthProvider';

const App = () => {
  const dispatch = useDispatch();
  const [receiverAddress, setReceiverAddress] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState(0.001);

  function handleSend() {
    if (!senderAddress || !receiverAddress || amountToSend <= 0) return; // Ensure the amount is greater than 0

    dispatch(sendCoin({
      amount: amountToSend,
      receiver: receiverAddress,
      sender: senderAddress,
    }));

    // If SendingEthereum is a component, it should be used in JSX
    // If it's a function, it should be invoked properly like this:
    SendingEthereum(); // Assuming it's a function, if it's a component, use it as <SendingEthereum />
  }

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
