import { useState } from "react";
import { writeContract, simulateContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem"; // Use parseUnits instead of parseEther
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { useAccount } from "wagmi";
import { createClient } from 'viem'
import { injected } from 'wagmi/connectors'
import {Button} from '@mui/material'
// Configuration for Wagmi
const config = createConfig({
  chains: [mainnet, sepolia],
  syncConnectedChain: true, 
  ssr: true,
  connectors: [injected()],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})

// USDC contract ABI (standard ERC-20)
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

// Replace with the actual USDC contract address on the Sepolia network
const mycontract = '0xDa317C1d3E835dD5F1BE459006471aCAA1289068';

interface SendTransactionProps {
  to: string;
  myvalue: number;
}

export function SendTransaction({ to, myvalue }: SendTransactionProps) {
  const { address } = useAccount(); // Get the connected account address
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const handleClick = async () => {
    console.log("handleClick");

    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      // Ensure the user is connected and has an address
      if (!address) throw new Error("No wallet connected");

      console.log("Reading balance on", address, "contract is", mycontract);

      const balance = await readContract(config, {
        address: '0xDa317C1d3E835dD5F1BE459006471aCAA1289068',
        abi,
        functionName: "balanceOf",
        args: ['0x8ad46EBF14ACa31EaBC399edbA0F4188cFf6bf04'], // Get the balance of the connected account
      });
      
      console.log("Balance:", balance);

      // Convert the amount to smallest units (6 decimals for USDC)
      const amountInSmallestUnits = parseUnits(myvalue.toString(), 6); // USDC has 6 decimals (1 USDC = 10^6 smallest units)

      // Simulate the transaction to check if it will succeed
      console.log("Simulating transfer...");
      const simulationResult = await simulateContract(config, {
        account: address, // Use the connected account
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits],
      });

      console.log("Simulation result:", simulationResult);

      // Proceed with the actual transaction after simulation
      const hash = await writeContract(config, {
        chain: sepolia, // Use the Sepolia chain
        account: address, // Pass the account directly
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits] as const, // Make sure the args are typed correctly
      });

      console.log("Transaction hash:", hash);
      setIsSuccess(true);

    } catch (err) {
      console.error("Error fetching balance or sending transaction:", err);
      setError(err as Error); // Capture error and display it in UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
                    <Button
                variant="contained"
                sx={{ mt: 2}}
                fullWidth
               onClick={handleClick} disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
      {isSuccess && <div>Transaction Sent Successfully!</div>}
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
    </div>
  );
};
