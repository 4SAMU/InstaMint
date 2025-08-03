import {
  RecommendedWallets,
  thirdWebClient,
  Wallets,
} from "@/config/thirdWebConfig";
import toast from "react-hot-toast";
import { ConnectButton, lightTheme } from "thirdweb/react";

interface WalletConnProps {
  bgColor?: string;
  textColor?: string;
  blackButtonBg?: boolean;
  fontWeightBtn?: string;
}
export default function WalletConnectModal({
  bgColor,
  textColor,
  blackButtonBg,
  fontWeightBtn,
}: WalletConnProps) {
  return (
    <ConnectButton
      wallets={Wallets}
      client={thirdWebClient}
      recommendedWallets={RecommendedWallets}
      theme={lightTheme({
        colors: {
          primaryButtonBg: bgColor ? bgColor : "#0bda49ff",
          primaryButtonText: textColor ? textColor : "#fff",
          skeletonBg: "#0bda49ff",
          accentButtonBg: "#0bda49ff",
          accentText: "#0bda49ff",
        },
      })}
      connectButton={{
        label: "Connect Wallet",
        style: {
          borderRadius: "20px",
          color: "#ffffff",
          backgroundColor: blackButtonBg ? "#000000" : "#",
          height: "40px",
          fontWeight: fontWeightBtn || "600",
          width: "auto",
        },
      }}
      connectModal={{
        title: "Connect a Wallet",
        size: "wide",
      }}
      showAllWallets={false}
      detailsModal={{
        hideBuyFunds: true,
        hideReceiveFunds: true,
        hideSendFunds: true,
        assetTabs: [],
        manageWallet: {
          allowLinkingProfiles: false,
        },
      }}
      onConnect={() => {
        toast.success(`successfully connected`);
      }}
      onDisconnect={() => {
        toast.error(`Wallet disconnected`);
      }}
    />
  );
}
