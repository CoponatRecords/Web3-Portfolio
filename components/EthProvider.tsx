import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, formatEther, getAddress, isAddress } from "ethers";

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

      receiver = getAddress(receiver)
      sender = getAddress(sender)

      console.log("receiver ", receiver, isAddress(receiver))
      console.log("sender ", sender, isAddress(sender))

      // Example with ethers (uncomment and implement the actual logic if needed)
      const provider = new ethers.BrowserProvider(window.ethereum);
      let  wei_balance = await provider.getBalance(sender);
      let  eth_balance  = formatEther(wei_balance)

      const transaction = {
        to: receiver,
        value: ethers.parseEther(amount.toString()) // convertit un nombre en wei (ETH -> wei)
      };
      
      const signer = await provider.getSigner()
      const txResponse = await signer.sendTransaction(transaction);


      console.log("balance before is : ",eth_balance)
      console.log("amount ", amount)
      console.log("transaction : ",txResponse)
      console.log("Price : ",formatEther(txResponse.gasPrice))

      wei_balance = await provider.getBalance(sender);
      eth_balance  = formatEther(wei_balance)

      console.log("balance after : ",eth_balance)


    }
  }
}

function SendingEthereum( amount : number, sender: string, receiver: string) {

  console.log("sending ethereum ",amount, sender, receiver)
  fetchBalance(amount,sender, receiver )

}

export default SendingEthereum;
