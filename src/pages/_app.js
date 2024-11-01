import "@/styles/globals.css";
import Layout from "../../components/Layout/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from 'next/script';
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TwaAnalyticsProvider } from "@tonsolutions/telemetree-react";
import { useState, useEffect } from "react";
// import WebApp from '@twa-dev/sdk'


export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client-side
    setIsClient(true);
  }, []);
  return (
    <>
      {/* Load the script using next/script */}
      {/* <Script src="/script.js" strategy="afterInteractive" /> */}

      {isClient && (
        <TwaAnalyticsProvider
        projectId = {process.env.NEXT_PUBLIC_PROJECT_ID}
        apiKey= {process.env.NEXT_PUBLIC_API_KEY}
        appName={process.env.NEXT_PUBLIC_APP_NAME}
        >
          <TonConnectUIProvider manifestUrl="https://cosmic-invaders.vercel.app/tonconnect-manifest.json">
            <Layout>
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              <Component {...pageProps} />
            </Layout>
          </TonConnectUIProvider>
        </TwaAnalyticsProvider>
      )}
    </>
  );
}
