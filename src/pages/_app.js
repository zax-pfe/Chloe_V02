import Layout from "@/components/Layout/Layout";
import "@/styles/ranade.css";
import "@/styles/globals.css";
import { ReactLenis } from "lenis/react";
import { DeviceModeProvider } from "@/context/DeviceContext";
import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import Inner from "@/components/Layout/Inner";

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
          <Layout>
            <AnimatePresence mode="wait">
              <Inner key={router.route} withPanel={router.route !== "/"}>
                <Component {...pageProps} />
              </Inner>
            </AnimatePresence>
          </Layout>
        </ReactLenis>
      </DeviceModeProvider>
    </>
  );
}
