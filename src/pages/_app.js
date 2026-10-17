import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { ReactLenis } from "lenis/react";
import { DeviceModeProvider } from "@/context/DeviceContext";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import Inner from "@/components/Layout/Inner/Inner";
import { Raleway } from "next/font/google";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <DeviceModeProvider>
        <ReactLenis
          root
          options={{
            infinite: false,
            syncTouch: true,
          }}
        >
          <div className={raleway.className}>
            <Layout>
              <AnimatePresence mode="wait">
                <Inner key={router.route} withPanel={router.route !== "/"}>
                  <Component {...pageProps} />
                </Inner>
              </AnimatePresence>
            </Layout>
          </div>
        </ReactLenis>
      </DeviceModeProvider>
    </>
  );
}
