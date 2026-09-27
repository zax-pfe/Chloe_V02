import Layout from "@/components/Layout/Layout";
import "@/styles/ranade.css";
import "@/styles/globals.css";
import { ReactLenis } from "lenis/react";
import { DeviceModeProvider } from "@/context/DeviceContext";
import Head from "next/head";

export default function App({ Component, pageProps }) {
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
            <Component {...pageProps} />
          </Layout>
        </ReactLenis>
      </DeviceModeProvider>
    </>
  );
}
