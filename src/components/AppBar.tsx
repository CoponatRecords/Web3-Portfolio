import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ButtonAppBar() {
  return (
      <AppBar position="sticky" color="transparent">
        <Toolbar >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <ConnectButton />

        </Toolbar>
      </AppBar>
  );
}