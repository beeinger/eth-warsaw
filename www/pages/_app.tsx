import "react-toastify/dist/ReactToastify.css";

import {
  StarknetProvider,
  getInstalledInjectedConnectors,
} from "@starknet-react/core";

import { AppProps } from "next/app";
import { CacheProvider } from "@emotion/react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import createCache from "@emotion/cache";
import { globalStyles } from "../shared/styles";

const cache = createCache({ key: "next" });

function App({ Component, pageProps }: AppProps) {
  const connectors = getInstalledInjectedConnectors();

  return (
    <StarknetProvider connectors={connectors} autoConnect={true}>
      <CacheProvider value={cache}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=0.55"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />

          {/* <!--  Basic Tags --> */}
          <title>StarkNet Techno</title>
          <link rel="icon" href="/favicon.ico" />
          <meta charSet="UTF-8" />
          <meta
            name="description"
            content="Revoke classical music, embrace StarkNet techno."
          />
          <meta
            name="keywords"
            content="Techno, Music, StarkNet, Ethereum, Blockchain, Crypto, NFT"
          />

          {/* <!--  Essential META Tags --> */}
          <meta property="og:title" content="StarkNet Techno" />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://imageio.forbes.com/specials-images/imageserve/577c129fd7c6ee6a37c42b99/This-is-the-Milky-Way-from-Concordia-Camp--in-Pakistan-s-Karakoram-Range-/960x0.jpg?format=jpg&width=960"
          />
          <meta property="og:url" content={process.env.NEXT_PUBLIC_SELF_URL} />
          <meta name="twitter:card" content="summary_large_image" />

          {/* <!--  Non-Essential, But Recommended --> */}
          <meta
            property="og:description"
            content="Revoke classical music, embrace StarkNet techno."
          />
          <meta property="og:site_name" content="StarkNet Techno" />
          <meta
            name="twitter:image:alt"
            content="[StarkNet techno playing in the background]"
          />
        </Head>
        {globalStyles}
        <Component {...pageProps} />
        <ToastContainer
          toastStyle={{ backgroundColor: "black", color: "white" }}
        />
      </CacheProvider>
    </StarknetProvider>
  );
}

export default App;
