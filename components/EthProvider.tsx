"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

function Testing({Walletaddress}) {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      let provider;

      if (window.ethereum == null) {
        // Si MetaMask n'est pas installé
        provider = ethers.getDefaultProvider();
        console.log("MetaMask non détecté, fournisseur par défaut utilisé");

        // en pratique ca veut dire quoi ? 


      } else {
        // Si MetaMask est présent
        provider = new ethers.BrowserProvider(window.ethereum);
        const balanceBigInt = await provider.getBalance(Walletaddress);
        const formatted = ethers.formatEther(balanceBigInt);
        setBalance(formatted);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      {balance ? (
        <p>Solde : {balance} SepoliaETH</p>
      ) : (
        <p>Chargement du solde...</p>
      )}
    </div>
  );
}

export default Testing;
