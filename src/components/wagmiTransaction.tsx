import { useState } from "react";
import { writeContract, simulateContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Button, CircularProgress } from "@mui/material";
import { config } from "../wagmiConfig";
import { TransactionFail, TransactionSucces } from "./TransactionResponse";

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
const mycontract = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

interface SendTransactionProps {
  to: string;
  myvalue: number;
}

export function SendTransaction({ to, myvalue }: SendTransactionProps) {
  const { address, isConnected } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      if (!isConnected || !address) {
        throw new Error("Connect your wallet!");
      }

      const balance = await readContract(config, {
        address: mycontract,
        abi,
        functionName: "balanceOf",
        args: [address],
      });

      console.log("Balance:", balance.toString(), "at wallet", address);

      const amountInSmallestUnits = parseUnits(myvalue.toString(), 6);

      const simulationResult = await simulateContract(config, {
        account: address,
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits],
      });

      console.log("Simulation result:", simulationResult);

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
      {isSuccess && <TransactionSucces body="Transaction Success!" />}
      {error && isConnected && <TransactionFail body={"Transaction Failed!"} />}
      {error && !isConnected && <TransactionFail body={"Connect your wallet"} />}

    </div>
  );
}
