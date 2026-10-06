"use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";

import ProductCard from "@/src/components/UI/ProductCard";
import { Section, SectionHeading } from "@/src/components/UI/Section";
import FeatureProductSkeleton from "./FeatureProductSkeleton";
import { useFeaturedProducts } from "@/src/hooks/useFeaturedProducts";
import { useMotion } from "@/src/lib/motion";
import type { TProduct } from "@/src/types";

const VISIBLE_COUNT = 12;

export default function FeatureProduct() {
  const { data, isLoading, isError, refetch } = useFeaturedProducts();
  const m = useMotion();

  if (isLoading) return <FeatureProductSkeleton />;

  const products: TProduct[] = data ?? [];

  if (isError) {
    return (
      <Section spacing="md">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-display-sm font-bold text-content">
            Featured products unavailable
          </h2>
          <p className="max-w-prose text-body-sm text-content-muted">
            We could not reach the catalogue. Please try again.
          </p>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-sm bg-brand px-4 text-body-sm font-semibold text-brand-contrast transition-colors duration-fast ease-standard hover:bg-brand-hover"
            type="button"
            onClick={() => refetch()}
          >
            <RefreshCw aria-hidden size={15} />
            Retry
          </button>
        </div>
      </Section>
    );
  }

  if (products.length === 0) return null;

  const visible = products.slice(0, VISIBLE_COUNT);

  return (
    /* `default` (1280px) to match the category rail above it, so the two
       homepage sections share one left edge under the full-width hero. */
    <Section spacing="lg" tone="raised">
      <SectionHeading
        action={
          <NextLink
            className="group inline-flex h-10 items-center gap-2 rounded-sm border border-line-hairline bg-surface px-4 text-body-sm font-semibold text-content transition-colors duration-fast ease-standard hover:border-brand/40 hover:text-brand"
            href="/shop"
          >
            View all
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5"
            />
          </NextLink>
        }
        description="Hand-picked by our merchandisers — the range people keep coming back for."
        eyebrow="Curated for you"
        title="Featured products"
      />

      <motion.div
        animate="visible"
        className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        initial={m.initial}
        variants={m.container}
      >
        {visible.map((product, index) => (
          <motion.div key={product._id} variants={m.item}>
            <ProductCard priority={index < 4} product={product} />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}