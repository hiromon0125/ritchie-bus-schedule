import type { MetadataRoute } from "next";
import { APPCONFIG } from "../appconfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APPCONFIG.APP_NAME,
    short_name: APPCONFIG.APP_TITLE,
    description: APPCONFIG.DESCRIPTION_SHORT,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
      {
        src: "/icons/bus-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/bus-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
