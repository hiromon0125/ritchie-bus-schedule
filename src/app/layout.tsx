import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import Footer from "@/footer";
import Header from "@/header";
import { PostHogProvider } from "@/posthog";
import { ServiceInfoProvider } from "@/serviceinfo";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type Metadata } from "next";
import { TRPCReactProvider } from "t/react";
import { Toaster } from "~/components/ui/sonner";
import { HydrateClient } from "~/trpc/server";
import { APPCONFIG } from "../appconfig";
import { AlertNavBtn } from "./_components/alertNavigationBtn";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = await cookies();
  return (
    <ClerkProvider
      appearance={{
        layout: {
          privacyPageUrl: "/pp",
        },
        ...(cookie.get("theme")?.value === "dark"
          ? {
              baseTheme: dark,
            }
          : {}),
      }}
    >
      <PostHogProvider>
        <TRPCReactProvider cookies={cookie.toString()}>
          <ServiceInfoProvider>
            <HydrateClient>
              <html
                lang="en"
                className={cookie.get("theme")?.value === "dark" ? "dark" : ""}
              >
                <body className={`font-sans ${inter.variable}`}>
                  <Header serviceNavigation={<AlertNavBtn />} />
                  {children}
                  <Footer />
                  <Toaster />
                </body>
              </html>
            </HydrateClient>
          </ServiceInfoProvider>
        </TRPCReactProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}

export async function generateViewport() {
  const cookie = await cookies();
  return {
    themeColor: cookie.get("theme")?.value === "dark" ? "#020618" : "#f1f5f9",
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(APPCONFIG.DOMAIN),
  title: APPCONFIG.APP_NAME,
  applicationName: APPCONFIG.APP_NAME,
  description: APPCONFIG.DESCRIPTION_LONG,
  alternates: {
    canonical: "/",
  },
  appleWebApp: true,
  authors: [
    {
      name: "Hiroto Takeuchi",
      url: "https://github.com/hiromon0125",
    },
    {
      name: "Sam Ruan",
      url: "https://github.com/0SMA0",
    },
  ],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: APPCONFIG.APP_NAME,
    images: [
      {
        url: "/ritches-bus-schedule-banner.png",
        alt: APPCONFIG.APP_TITLE,
      },
    ],
  },
  twitter: {
    site: "@ritbus",
    card: "summary_large_image",
    creator: "@takeuchi_hiroto",
    title: APPCONFIG.APP_NAME,
    description: APPCONFIG.DESCRIPTION_LONG,
    images: [
      {
        url: "/ritches-bus-schedule-banner.png",
        alt: APPCONFIG.APP_TITLE,
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
      {
        url: "/icons/bus-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/bus-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: "/icons/sm-apple-touch-icon.png",
        sizes: "120x120",
        type: "image/png",
      },
    ],
  },
};
