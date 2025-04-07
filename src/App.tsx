import './App.css'; // Import the CSS file
import {store} from '../redux/store';
import { Provider } from 'react-redux';
import CointousdChartContainer from '../components/CointousdChartContainer';
import Testing from '../components/EthProvider'
import React from "react";
import {

  Button,

} from '@mui/material';

  const handleClick = () => {
    console.log("Element clicked!");

    // créer la logique ici pour envoyer le wei

    // loger une valeur dans le store.  elle change quand on clique le bouton, 
    // utiliser une autre fonctiion pour envoyer le wei

  };

const App = () => {

  return (

    <Provider store={store}>
      <>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleClick} fullWidth className="cursor-pointer p-4 bg-blue-500 text-white rounded-2xl shadow-lg hover:bg-blue-600 transition">
              Send a wei
      </Button>

      <Testing Walletaddress = "0x92FcD9d0424E3D3F3bB5a503a59A507F9A4607ee" />

    <CointousdChartContainer/>
    </>
    </Provider>
  );
};

export default App;
