import { AuthProvider } from "@/context/AuthContext";
import { TourProvider } from "@/context/TourContext";
import "@/styles/globals.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { myCustomTheme } from "@/utils/theme";
import { rainbowConfig } from "@/config/rainbowConfig";
import { Toaster } from "react-hot-toast";
import { InstaMintProvider } from "@/context/InstaMintNfts";
import { XpProvider } from "@/context/XpContext";

// Types for page and layout props
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={2} theme={myCustomTheme}>
          <AuthProvider>
            <TourProvider>
              <XpProvider>
                <InstaMintProvider>
                  {getLayout(<Component {...pageProps} />)}
                  <Toaster />
                </InstaMintProvider>
              </XpProvider>
            </TourProvider>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
