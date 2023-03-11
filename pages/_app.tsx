import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Unmapped</title>
                <meta name="description" content="Unmapped" />
                <meta
                    name="viewport"
                    content="initial-scale=1 width=device-width"
                />
                <link rel="icon" href={"favicon.ico"} />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
