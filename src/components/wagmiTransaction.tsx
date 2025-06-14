import { writeContract, simulateContract, readContract } from "@wagmi/core";
import { parseUnits } from "viem";
import { useAccount } from "wagmi";
import { sepolia } from "wagmi/chains";
import { Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { wagmiconfig } from "../wagmiConfig";
import { TransactionFail, TransactionSucces } from "./TransactionResponse";
import { useDispatch, useSelector } from "react-redux";
import { setHash } from "../redux/slices/hashReducer";
import { useState } from "react";
import { RootState } from "../redux/store";
import { abi } from "./TokenSwap/abi";

// Proxy contract address
const mycontract = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

type SendTransactionProps = {
  to: string;
  myvalue: number;
};

export function SendTransaction({ to, myvalue }: SendTransactionProps) {
  const dispatch = useDispatch();
  let txHash = useSelector((state: RootState) => state.hash.myhash);

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

      const balance = await readContract(wagmiconfig, {
        address: mycontract,
        abi,
        functionName: "balanceOf",
        args: [address],
      });

      console.log("Balance:", balance.toString(), "at wallet", address);

      const amountInSmallestUnits = parseUnits(myvalue.toString(), 6);

      const simulationResult = await simulateContract(wagmiconfig, {
        account: address,
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits],
      });

      console.log("Simulation result:", simulationResult);

      txHash = await writeContract(wagmiconfig, {
        chain: sepolia,
        account: address,
        address: mycontract,
        abi,
        functionName: "transfer",
        args: [to, amountInSmallestUnits],
      });

      console.log("Transaction sent:", txHash);
      dispatch(setHash(`${txHash}`));
      setIsSuccess(true);
    } catch (err) {
      console.error("Transaction error:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Button
        variant="contained"
        sx={{
          mt: 2,
          borderRadius: 2,
          background: "linear-gradient(90deg, #6200ea 0%, #304ffe 100%)",
          color: "#ffffff",
          "&:hover": {
            background: "linear-gradient(90deg, #7f39fb 0%, #3f51b5 100%)",
          },
          "&:disabled": {
            background: "rgba(255, 255, 255, 0.3)",
            color: "rgba(255, 255, 255, 0.5)",
          },
        }}
        fullWidth
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: "#ffffff" }} />
        ) : (
          "Send"
        )}
      </Button>
      {isSuccess && <TransactionSucces body="Transaction Success!" />}
      {error && isConnected && <TransactionFail body="Transaction Failed!" />}
      {error && !isConnected && <TransactionFail body="Connect your wallet" />}
    </motion.div>
  );
}
