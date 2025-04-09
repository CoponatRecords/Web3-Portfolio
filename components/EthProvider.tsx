import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MetaMaskInpageProvider } from "@metamask/providers";

// Declare global window interface
declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

// async function to fetch balance
 async function fetchBalance(amount: number, sender: string, receiver: string) {
  if (window.ethereum == null) {
    console.log("MetaMask not detected, using default provider");
    // Handle the case when MetaMask is not installed
  } else {
    // MetaMask is available, check for valid parameters
    if (sender && receiver && amount !== 0) {
      console.log("ethprovider", amount, sender, receiver);
      // Example with ethers (uncomment and implement the actual logic if needed)
      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const balanceBigInt = await provider.getBalance(sender);
      // const formatted = ethers.formatEther(balanceBigInt);
      // setBalance(formatted);  // Use state to set balance if you need to store the result
    }
  }
}

function SendingEthereum() {
  // Using useSelector to get the values from Redux store
  const coinSend = useSelector((state: RootState) => state.coindSend); // le retrigger est automatique
  const { amount, sender, receiver } = coinSend;


  // Only call fetchBalance when necessary state values change
  console.log(amount, sender, receiver)
  fetchBalance(amount,sender, receiver )

}

export default SendingEthereum;
