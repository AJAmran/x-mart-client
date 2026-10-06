 "use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";

import Carousel from "./Carousel";
import { Container } from "@/src/components/UI/Container";
import { useMotion } from "@/src/lib/motion";

const assurances = [
  { icon: Truck, label: "Free delivery", detail: "Orders over Tk 999" },
  { icon: ShieldCheck, label: "Secure checkout", detail: "SSLCommerz protected" },
  { icon: Zap, label: "Same-day slots", detail: "Inside Dhaka, daily" },
];

export function HeroSection() {
  const m = useMotion();

  return (
    <section className="relative isolate overflow-hidden bg-surface">
      {/* Soft, organic background details */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bloom left-[-12%] top-[-18%] size-[34rem] bg-brand/10 blur-3xl" />
        <div className="bloom bottom-[-22%] right-[-8%] size-[32rem] bg-accent/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(var(--line-hairline) / 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line-hairline) / 0.45) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 75% 60% at 50% 0%, black, transparent)",
          }}
        />
      </div>

      <Container className="py-7 sm:py-10 lg:py-7 xl:py-9">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-7 xl:gap-9">
          {/* Editorial / value proposition */}
          <motion.div
            animate="visible"
            className="lg:col-span-5"
            initial={m.initial}
            variants={m.container}
          >
            <motion.div variants={m.item}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-subtle/80 px-3.5 py-2 text-overline font-bold uppercase tracking-[0.13em] text-brand">
                <Sparkles aria-hidden size={14} />
                12 outlets nationwide
              </span>
            </motion.div>

            <motion.h1
              className="mt-5 text-display-lg font-extrabold leading-[0.99] tracking-[-0.045em] text-content sm:mt-6"
              variants={m.item}
            >
              Fresh groceries,
              <br />
              <span className="bg-gradient-to-r from-brand via-brand to-accent bg-clip-text text-transparent">
                delivered fast.
              </span>
            </motion.h1>

            <motion.p
              className="mt-5 max-w-[34rem] text-body-lg leading-7 text-content-muted sm:mt-6"
              variants={m.item}
            >
              Ten departments, one basket. Stock checked in-store, so what you see is
              actually on the shelf today.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7"
              variants={m.item}
            >
              <NextLink
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 text-body-sm font-bold text-brand-contrast shadow-[0_10px_24px_-12px_rgb(0_140_80_/_0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                href="/shop"
              >
                Start shopping
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </NextLink>
              <NextLink
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line-hairline bg-surface-raised px-6 text-body-sm font-bold text-content shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-subtle/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                href="/deals"
              >
                <BadgePercent aria-hidden className="text-brand" size={16} />
                See today&apos;s deals
              </NextLink>
            </motion.div>

            {/* Trust points */}
            <motion.ul
              className="mt-8 grid grid-cols-1 gap-4 border-t border-line-hairline pt-6 sm:grid-cols-3 lg:mt-9 lg:grid-cols-1 xl:grid-cols-3"
              variants={m.container}
            >
              {assurances.map((item) => (
                <motion.li
                  key={item.label}
                  className="flex min-w-0 items-start gap-3"
                  variants={m.item}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-subtle text-brand ring-1 ring-inset ring-brand/10">
                    <item.icon aria-hidden size={18} />
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-body-sm font-bold text-content">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-label-sm leading-5 text-content-subtle">
                      {item.detail}
                    </span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Campaign carousel and promotional cards */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7"
            initial={m.reduced ? false : { opacity: 0, y: 16 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <div aria-hidden className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl bg-brand/10 blur-2xl" />
              <div className="overflow-hidden rounded-xl border border-line-hairline shadow-xl">
                <Carousel />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
