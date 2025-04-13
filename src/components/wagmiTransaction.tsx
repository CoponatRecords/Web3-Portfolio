import { useState } from "react";
import { writeContract, simulateContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { http, createConfig, useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { createClient } from "viem";
import { injected } from "wagmi/connectors";
import { Button, CircularProgress } from "@mui/material";

// Wagmi config
const config = createConfig({
  chains: [sepolia],
  syncConnectedChain: true,
  ssr: true,
  connectors: [injected()],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

// ERC20 ABI
const abi = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  },
];

// Proxy contract address 
const mycontract = "0xDa317C1d3E835dD5F1BE459006471aCAA1289068"; // <— the proxy

interface SendTransactionProps {
  to: string;
  myvalue: number;
}

export function SendTransaction({ to, myvalue }: SendTransactionProps) {
  const { address, isConnected } = useAccount(); // ✅ now inside the component

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      setError(null);
      setIsSuccess(false);

      // ✅ Check connection
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      // Check balance
      const balance = await readContract(config, {
        address: mycontract,
        abi,
        functionName: "balanceOf",
        args: [address],
      });

      console.log("Balance:", balance.toString(), " at wallet ",address);

      // Convert amount to smallest units
      const amountInSmallestUnits = parseUnits(myvalue.toString(), 6);

      // Simulate
      const simulationResult = await simulateContract(config, {
        account: address,
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits],
      });

      console.log("Simulation result:", simulationResult);

      // Write
      const txHash = await writeContract(config, {
        chain: sepolia,
        account: address,
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits],
      });

      console.log("Transaction sent:", txHash);
      setIsSuccess(true);

    } catch (err) {
      console.error("Transaction error:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        fullWidth
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Send"}
      </Button>
      {isSuccess && <div>Transaction Sent Successfully!</div>}
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
    </div>
  );
}
