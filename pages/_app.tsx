import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    RedirectToSignIn
} from "@clerk/nextjs";
import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const publicPages = ["sign-in", "sign-up", "forgot-password"];

export default function App({ Component, pageProps }: AppProps) {
    // Get the pathname
    const { pathname } = useRouter();
    // Check if the current route matches a public page
    const isPublicPage = publicPages.includes(pathname.slice(1));
    return (
        <>
            <ClerkProvider>
                {isPublicPage ? (
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
                ) : (
                    <>
                        <SignedIn>
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
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                )}
            </ClerkProvider>
        </>
    );
}
