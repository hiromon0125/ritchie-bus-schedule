import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import Footer from "@/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type Metadata } from "next";
import { TRPCReactProvider } from "t/react";
import { Toaster } from "~/components/ui/toaster";
import Header from "./_components/header";
import { PostHogProvider } from "./_components/posthog";
import { ServiceInfoProvider } from "./_components/serviceinfo";

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
            <html
              lang="en"
              className={cookie.get("theme")?.value === "dark" ? "dark" : ""}
            >
              <body className={`font-sans ${inter.variable}`}>
                <Header />
                {children}
                <Footer />
                <Toaster />
              </body>
            </html>
          </ServiceInfoProvider>
        </TRPCReactProvider>
      </PostHogProvider>
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
  keywords: [
    "RIT",
    "Bus",
    "Schedule",
    "Ritchie",
    "Rochester Institute of Technology",
    "RIT Bus",
    "RIT Bus App",
    "RIT Bus Tracker",
    "RIT Bus Schedule",
    "RIT Bus Schedule App",
    "RIT Bus Schedule Tracker",
    "RIT Bus Schedule Checker",
    "RIT Bus Schedule Finder",
    "RIT Bus Schedule Map",
    "RIT Bus Schedule Timetable",
    "RIT Bus Schedule Information",
    "RIT Bus Schedule Updates",
    "RIT Bus Schedule Alerts",
    "RIT Bus Schedule Notifications",
    "RIT Bus Schedule Service",
    "RIT Bus Schedule Routes",
    "RIT Bus Schedule Stops",
    "RIT Bus Schedule Buses",
    "RIT Bus Schedule Live",
    "RIT Bus Schedule Online",
    "RIT Bus Schedule Mobile",
    "RIT Bus Schedule Web",
    "RIT Bus Schedule Application",
    "RIT Bus Schedule Software",
    "RIT Bus Schedule Platform",
    "RIT Bus Schedule System",
    "RIT Bus Schedule Tool",
  ],
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
