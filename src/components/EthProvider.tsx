// import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, formatEther, getAddress, isAddress } from "ethers";

// Declare global window interface
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

// async function to fetch balance
async function fetchBalance(amount: number, receiver: string) {
  if (window.ethereum == null) {
    console.log("MetaMask not detected");
    // Handle the case when MetaMask is not installed
  } else {
    // MetaMask is available, check for valid parameters
    if (receiver && amount !== 0) {
      receiver = getAddress(receiver);

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner(); // Get the default signer (e.g., connected wallet)
      const address = await signer.getAddress(); // Get the address of the signer
      const balance = await provider.getBalance(address);

      console.log("receiver ", receiver, isAddress(receiver));
      console.log("Balance before is : ", ethers.formatEther(balance));
      console.log("amount ", amount);

      const transaction = {
        to: receiver,
        value: ethers.parseEther(amount.toString()), // convertit un nombre en wei (ETH -> wei)
      };

      const txResponse = await signer.sendTransaction(transaction);

      console.log("transaction : ", txResponse);
      console.log("Price : ", formatEther(txResponse.gasPrice));
    }
  }
}
function SendingEthereum(amount: number, receiver: string) {
  console.log("sending ethereum ", amount, receiver);
  fetchBalance(amount, receiver);
}

export default SendingEthereum;
