import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import Footer from "@/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { TRPCReactProvider } from "t/react";
import { Toaster } from "~/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
            <Footer />
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
      <Analytics />
    </ClerkProvider>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://rit-bus.app"),
  title: "Ritchie's Bus Schedule",
  description:
    "Best application to check the Rochester Institute of Technology Bus Schedule",
  applicationName: "Ritchie's Bus Schedule",
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
  keywords: ["RIT", "Bus", "Schedule", "Ritchie", "RIT Bus Schedule"],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Ritchie's Bus Schedule",
    images: [
      {
        url: "/ritches-bus-schedule-banner.png",
        alt: "RIT Bus Schedule",
      },
    ],
  },
  twitter: {
    site: "@ritbus",
    card: "summary_large_image",
    creator: "@takeuchi_hiroto",
    title: "Ritchie's Bus Schedule",
    description:
      "Best application to check the Rochester Institute of Technology Bus Schedule",
    images: [
      {
        url: "/ritches-bus-schedule-banner.png",
        alt: "RIT Bus Schedule",
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
