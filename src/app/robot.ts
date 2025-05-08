import type { MetadataRoute } from "next";
import { APPCONFIG } from "../appconfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/manage/",
    },
    sitemap: `${APPCONFIG.DOMAIN}/sitemap.xml`,
  };
}
