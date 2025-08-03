// src/client.ts
import { createThirdwebClient, defineChain } from "thirdweb";
import { createWallet } from "thirdweb/wallets";

export const thirdWebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  secretKey: process.env.THIRD_WEB_SECRET_KEY || "",
});

export const Wallets = [
  createWallet("io.metamask"),
  createWallet("me.rainbow"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.walletconnect.com"),
];

export const RecommendedWallets = [createWallet("io.metamask")];

export const EtherlinkTestnet = defineChain({
  id: 128123,
  name: "Etherlink Testnet",
  nativeCurrency: {
    name: "Etherlink Token",
    symbol: "XTZ",
    decimals: 18,
  },
  rpc: "https://node.ghostnet.etherlink.com",
  blockExplorers: [
    {
      name: "Etherlink Test Explorer",
      url: "https://testnet.explorer.etherlink.com",
    },
  ],
  testnet: true,
});
