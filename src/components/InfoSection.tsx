import { Typography } from "@mui/material";

const InfoSection = (item ) => {

  console.log(  )

  if (item === "read") {
    return(
      <div> 
      <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
        Tool Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Send tokens from{" "}
        <span style={{ color: "#f6851b", fontWeight: "bold" }}>MetaMask</span> to a wallet via a smart contract.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Uses{" "}
        <span
          style={{
            backgroundImage:
              "linear-gradient(to right, #FFB6C1, #FFD700, #98FB98, #87CEFA, #DDA0DD, #FFB6C1, #FF69B4)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontWeight: "bold",
          }}
        >
          RainbowKit
        </span>{" "}
        for MetaMask connection and{" "}
        <span style={{ fontWeight: "bold", color: "#0066cc" }}>Wagmi</span> for contract interaction.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Deployed on SepoliaETH Testnet with{" "}
        <span style={{ color: "#1e73d2", fontWeight: "bold" }}>USDC</span> token.
      </Typography>
    </div>
    )
  }
  else
  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2, color: "#ffffff" }}>
        Tool Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Send tokens from{" "}
        <span style={{ color: "#f6851b", fontWeight: "bold" }}>MetaMask</span> to a wallet via a smart contract.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Uses{" "}
        <span
          style={{
            backgroundImage:
              "linear-gradient(to right, #FFB6C1, #FFD700, #98FB98, #87CEFA, #DDA0DD, #FFB6C1, #FF69B4)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontWeight: "bold",
          }}
        >
          RainbowKit
        </span>{" "}
        for MetaMask connection and{" "}
        <span style={{ fontWeight: "bold", color: "#0066cc" }}>Wagmi</span> for contract interaction.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, color: "#ffffff" }}>
        Deployed on SepoliaETH Testnet with{" "}
        <span style={{ color: "#1e73d2", fontWeight: "bold" }}>USDC</span> token.
      </Typography>
    </div>
  );
};

export default InfoSection;