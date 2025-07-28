import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

export const EtherlinkMainnet = {
  id: 42793,
  name: "Etherlink Mainnet",
  nativeCurrency: {
    name: "Etherlink Token",
    symbol: "XTZ",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://node.mainnet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://explorer.etherlink.com",
    },
  },
  testnet: false,
} as const satisfies Chain;

export const EtherlinkTestnet = {
  id: 128123,
  name: "Etherlink Testnet",
  nativeCurrency: {
    name: "Etherlink Token",
    symbol: "XTZ",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://node.ghostnet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Test Explorer",
      url: "https://testnet.explorer.etherlink.com",
    },
  },
  testnet: true,
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "InstaMint",
  projectId: "YOUR_PROJECT_ID",
  chains: [EtherlinkMainnet, EtherlinkTestnet],
  ssr: true,
});
