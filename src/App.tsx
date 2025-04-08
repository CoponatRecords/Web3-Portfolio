import './App.css'; // Import the CSS file
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import CointousdChartContainer from '../components/CointousdChartContainer';
import Testing from '../components/EthProvider';
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { TextField, Button, Box } from '@mui/material';
import { sendCoin } from '../redux/slices/coinSendReducer';

const App = () => {
  const dispatch = useDispatch();
  const [receiveraddress, setNewReceiverAddress] = useState<string>('');
  const [senderadress, setNewSenderAddress] = useState<string>('');
  const [amounttosend, setAmount] = useState<number>(0.001);

  const handleSend = () => {
    if (!senderadress) return;
    dispatch(sendCoin({
      amount: amounttosend,
      receiver: receiveraddress,
      sender: senderadress,
    }));
  };

  return (
    <>
            <TextField
          label="amount to send"
          variant="outlined"
          value={amounttosend}
          onChange={(amounttosend) => setAmount(parseFloat(amounttosend.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label={`Send ${amounttosend} to this address`}
          variant="outlined"
          value={receiveraddress}
          onChange={(receiveraddress) => setNewReceiverAddress(receiveraddress.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
          <TextField
          label={`Send ${amounttosend} from this address`}
          variant="outlined"
          value={senderadress}
          onChange={(senderadress) => setNewSenderAddress(senderadress.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!(senderadress&&receiveraddress&&amounttosend)}
          fullWidth
        >
          Send
        </Button>

        <Box sx={{ mt: 4 }}>
          <Testing Walletaddress="0x92FcD9d0424E3D3F3bB5a503a59A507F9A4607ee" />
        </Box>

        <Box sx={{ mt: 4 }}>
          <CointousdChartContainer />
        </Box>
    </>
  );
};

// Tu gardes ton Provider ici comme demandé
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
