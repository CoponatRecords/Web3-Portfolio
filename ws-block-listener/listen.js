const WebSocket = require("ws");

const WS_URL = "ws://localhost:8548";

function connect() {
  const ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("✅ Connected to Erigon WebSocket RPC");

    // Subscribe to new pending transactions
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_subscribe",
        params: ["newPendingTransactions"],
      })
    );
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);

      // Handle subscription messages
      if (message.method === "eth_subscription" && message.params?.result) {
        const txHash = message.params.result;
        console.log(`🚀 Pending TX: ${txHash}`);
      }
    } catch (err) {
      console.error("❌ Failed to parse message:", err);
    }
  });

  ws.on("error", (err) => {
    console.error("❌ WebSocket Error:", err.message);
    ws.close(); // trigger reconnect
  });

  ws.on("close", () => {
    console.warn("🔌 Connection closed. Reconnecting in 2s...");
    setTimeout(connect, 2000);
  });
}

connect();
