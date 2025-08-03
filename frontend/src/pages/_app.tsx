import { AuthProvider } from "@/context/AuthContext";
import { TourProvider } from "@/context/TourContext";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { InstaMintProvider } from "@/context/InstaMintNfts";
import { XpProvider } from "@/context/XpContext";
import { ThirdwebProvider } from "thirdweb/react";

// Types for page and layout props
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThirdwebProvider>
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
    </ThirdwebProvider>
  );
}
