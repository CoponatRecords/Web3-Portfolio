import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "testproject",
  projectId: "4e1a22e6483b1ca350afcdb6b729108f",
  chains: [sepolia],
  ssr: false,
});