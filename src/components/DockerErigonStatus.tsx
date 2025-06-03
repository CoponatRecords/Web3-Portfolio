import React, { useEffect, useState } from "react";

const DockerErigonStatus = () => {
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [blockHash, setBlockHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBlock = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8545", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBlockByNumber",
          params: ["latest", false],
          id: 1,
        }),
      });

      const json = await response.json();
      if (json.result) {
        const block = json.result;
        setBlockNumber(parseInt(block.number, 16));
        setBlockHash(block.hash);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("RPC Error:", err);
      setError("Failed to fetch latest block from Erigon RPC");
    }
  };

  useEffect(() => {
    fetchLatestBlock();
    const interval = setInterval(fetchLatestBlock, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Docker Erigon Status</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : blockNumber !== null ? (
        <div>
          <p>Latest Block Number: {blockNumber}</p>
          <p>Latest Block Hash: {blockHash}</p>
        </div>
      ) : (
        <p>Loading block info...</p>
      )}
    </div>
  );
};

export default DockerErigonStatus;
