import type { MetadataRoute } from "next";
import { siteConfig } from "@/src/config/site";
import envConfig from "@/src/config/envConfig";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/track-order",
  "/outlets",
  "/help",
  "/about",
  "/blog",
];

type ProductList = { data?: Array<{ _id?: string }> };

async function fetchProductIds(): Promise<string[]> {
  try {
    const res = await fetch(`${envConfig.baseApi}/products?limit=1000`, {
      next: { revalidate: 600, tags: ["sitemap:products"] },
    });

    if (!res.ok) return [];
    const json = (await res.json()) as ProductList;

    return (json.data ?? []).map((p) => p._id).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productIds] = await Promise.all([fetchProductIds()]);
  const now = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = productIds.map((id) => ({
    url: `${siteConfig.url}/product/${id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries];
}
