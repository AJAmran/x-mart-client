import { Suspense } from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import envConfig from "@/src/config/envConfig";
import { siteConfig } from "@/src/config/site";
import { TProduct } from "@/src/types";
import ProductDetailsClient from "./ProductDetailsClient";
import { Container } from "@/src/components/UI/Container";

interface ProductResponse {
  data?: TProduct;
}

const fetchProduct = async (id: string): Promise<TProduct | null> => {
  try {
    const cookieHeader = (await headers()).get("cookie") ?? "";
    const res = await fetch(`${envConfig.baseApi}/products/${id}`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 60, tags: [`product:${id}`] },
    });

    if (!res.ok) return null;
    const json = (await res.json()) as ProductResponse;

    return json.data ?? null;
  } catch {
    return null;
  }
};

export const revalidate = 60;
export const dynamicParams = true;

// High-priority fix: per-product dynamic metadata (replaces the old
// `next/head` import which is a Pages-Router API that has no effect in the
// App Router).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return { title: "Product unavailable" };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `${siteConfig.url}/product/${id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${siteConfig.url}/product/${id}`,
      images: product.images?.length ? [{ url: product.images[0] }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images?.slice(0, 1),
    },
  };
}

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) notFound();

  // JSON-LD product schema for rich snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku ?? product._id,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <Suspense
        fallback={
          <Container className="py-10">
            <div className="xm-skeleton h-8 w-48 rounded-xs bg-surface-sunken" />
            <p className="mt-3 text-body-sm text-content-subtle">
              Loading product…
            </p>
          </Container>
        }
      >
        <ProductDetailsClient product={product} />
      </Suspense>
    </>
  );
};

export default ProductPage;

