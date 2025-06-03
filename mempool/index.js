const { ethers } = require("ethers");

// Add your QuickNode Ethereum WSS endpoint here
const url = "ADD_YOUR_ETHEREUM_NODE_WSS_URL";

// Connect to the WebSocket provider
const provider = new ethers.WebSocketProvider(url);

// Listen for pending transactions
const init = () => {
  provider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (tx) {
        console.log(tx);
      }
    } catch (err) {
      console.error(`Error fetching transaction ${txHash}:`, err);
    }
  });

  console.log("Listening for pending transactions...");
};

init();
