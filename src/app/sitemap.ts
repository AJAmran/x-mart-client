import { MetadataRoute } from "next";
import { siteConfig } from "@/src/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/shop",
        "/track-order",
        "/deals",
        "/outlets",
        "/help",
        "/about",
        "/blog",
    ].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    return [...routes];
}
