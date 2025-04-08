"use client";

import { useEffect, useState } from "react";
//import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

function SendingEthereum() {
  // Correctly initializing useState
  //const [balance] = useState<string | null>(null);

  const amount = useSelector((state: RootState) => state.coindSend.amount); // Automatically retriggers
  const sender = useSelector((state: RootState) => state.coindSend.sender); // Automatically retriggers
  const receiver = useSelector((state: RootState) => state.coindSend.receiver); // Automatically retriggers

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.ethereum == null) {
        console.log("MetaMask non détecté, fournisseur par défaut utilisé");
        // If MetaMask is not installed, you might want to use a default provider
      } else {
        // If MetaMask is present
        if (sender && receiver && amount !== 0) {
          console.log("ethprovider", amount, sender, receiver);
          
          // Add your logic to interact with Ethereum here:
          // Example:
          // const provider = new ethers.BrowserProvider(window.ethereum);
          // const balanceBigInt = await provider.getBalance(sender);
          // const formatted = ethers.formatEther(balanceBigInt);
          // setBalance(formatted);
        }
      }
    };

    fetchBalance();
  }); // Add dependencies to rerun useEffect when these change
}

export default SendingEthereum;
