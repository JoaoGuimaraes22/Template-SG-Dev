import type { MetadataRoute } from "next";
import { i18n } from "../i18n-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://YOUR_DOMAIN.vercel.app";
  return i18n.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
  }));
}
