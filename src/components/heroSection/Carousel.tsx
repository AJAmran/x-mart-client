"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, Leaf } from "lucide-react";

type Slide = {
  id: string;
  image: string;
  badge: string;
  /** First line renders solid; the second carries the brand gradient. */
  title: [string, string];
  subtitle: string;
  cta: string;
  href: string;
};

const AUTOPLAY_MS = 6500;

const slides: Slide[] = [
  {
    id: "produce-morning",
    image: "/slider/produce-morning.jpg",
    badge: "Landed this morning",
    title: ["Picked today,", "not last week"],
    subtitle:
      "Leafy greens, chillies and seasonal vegetables arrive from our growers every day. What is on the shelf online is on the shelf in store.",
    cta: "Shop fresh",
    href: "/shop?category=vegetables",
  },
  {
    id: "seasonal-harvest",
    image: "/slider/seasonal-harvest.jpg",
    badge: "In season now",
    title: ["Summer harvest,", "peak flavour"],
    subtitle:
      "Watermelon, mango and pomegranate at their best. Prices track the market, so a good week on the farm reaches you at a fair price.",
    cta: "See the season",
    href: "/shop?category=fruits",
  },
  {
    id: "half-price-sale",
    image: "/slider/half-price-sale.jpg",
    badge: "Up to 50% off",
    title: ["Half price,", "full range"],
    subtitle:
      "Markdowns across pantry, household and personal care — refreshed every Monday. No vouchers to hunt for; the price is already down.",
    cta: "Shop the sale",
    href: "/deals",
  },
  {
    id: "bkash-25-off",
    image: "/slider/bkash-25-off.jpg",
    badge: "Pay with bKash",
    title: ["25% off when", "you pay bKash"],
    subtitle:
      "Apply the offer at checkout on any order over Tk 500. The discount comes off before you confirm payment.",
    cta: "See bKash offers",
    href: "/deals",
  },
];

export function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false, duration: 28 },
    [
      Autoplay({
        delay: AUTOPLAY_MS,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback(
    (next: number) => emblaApi?.scrollTo(next),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const bar = progressRef.current;

    if (!bar) return;

    bar.style.transition = "none";
    bar.style.width = paused
      ? `${((index + 0.999) / slides.length) * 100}%`
      : "0%";

    const frame = requestAnimationFrame(() => {
      bar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
      bar.style.width = `${((index + 1) / slides.length) * 100}%`;
    });

    return () => cancelAnimationFrame(frame);
  }, [index, paused]);

  return (
    <div
      aria-label="Featured offers"
      aria-roledescription="carousel"
      className="group relative w-full overflow-hidden rounded-xl bg-surface-inset"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <ul className="flex">
          {slides.map((slide, slideIndex) => {
            const isActive = slideIndex === index;

            return (
              <li
                key={slide.id}
                aria-label={`${slideIndex + 1} of ${slides.length}`}
                aria-roledescription="slide"
                className="relative min-w-0 flex-[0_0_100%]"
              >
                <div className="relative h-[22rem] w-full sm:h-[26rem] lg:h-[30rem] xl:h-[32rem]">
                  <Image
                    fill
                    alt=""
                    className="object-cover transition-transform duration-[12s] ease-linear group-hover:scale-[1.04]"
                    priority={slideIndex === 0}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    src={slide.image}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-black/80 from-10% via-black/50 via-45% to-black/5 to-80%"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                  />

                  <div className="absolute inset-0 z-10 flex items-center px-6 py-14 sm:px-10 lg:px-12">
                    <div
                      className={[
                        "w-full max-w-md transition-[opacity,transform]",
                        "duration-slow ease-entrance",
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2.5 opacity-0",
                      ].join(" ")}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-overline font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                        <Leaf aria-hidden size={13} />
                        {slide.badge}
                      </span>

                      <h2 className="mt-4 text-display-md font-bold leading-[1.05] text-white drop-shadow-lg">
                        <span className="block">{slide.title[0]}</span>
                        <span className="bg-gradient-to-r from-brand via-emerald-200 to-accent bg-clip-text text-transparent">
                          {slide.title[1]}
                        </span>
                      </h2>

                      <p className="mt-4 max-w-sm text-body-sm font-medium leading-relaxed text-white/90 drop-shadow-md sm:text-body-lg">
                        {slide.subtitle}
                      </p>

                      <div className="mt-7">
                        <NextLink
                          className="group/cta inline-flex h-12 items-center gap-2 rounded-md bg-brand px-6 text-body-sm font-semibold text-brand-contrast shadow-brand transition-[background-color,transform] duration-fast ease-standard hover:-translate-y-0.5 hover:bg-brand-hover"
                          href={slide.href}
                          tabIndex={isActive ? 0 : -1}
                        >
                          {slide.cta}
                          <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform duration-fast ease-standard group-hover/cta:translate-x-0.5"
                          />
                        </NextLink>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---- Controls ---- */}
      <div className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-label-sm font-bold text-white backdrop-blur-md">
        <span aria-hidden>{index + 1}</span>
        <span aria-hidden className="px-1 text-white/50">
          /
        </span>
        <span className="sr-only">of {slides.length} slides</span>
        <span aria-hidden>{slides.length}</span>
      </div>

      <button
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 text-white opacity-100 backdrop-blur-md transition-[opacity,background-color] duration-fast ease-standard hover:bg-black/50 focus-visible:opacity-100 sm:left-4 sm:size-11 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ChevronLeft aria-hidden size={20} />
      </button>
      <button
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 text-white opacity-100 backdrop-blur-md transition-[opacity,background-color] duration-fast ease-standard hover:bg-black/50 focus-visible:opacity-100 sm:right-4 sm:size-11 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
        type="button"
        onClick={() => emblaApi?.scrollNext()}
      >
        <ChevronRight aria-hidden size={20} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-brand to-accent"
          style={{ width: "0%", transition: `width ${AUTOPLAY_MS}ms linear` }}
        />
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            aria-current={index === slideIndex ? "true" : undefined}
            aria-label={`Go to slide ${slideIndex + 1}: ${slide.title.join(" ")}`}
            className={`rounded-full transition-all duration-base ease-standard ${
              index === slideIndex
                ? "h-2 w-8 bg-accent"
                : "size-2 bg-white/55 hover:bg-white"
            }`}
            type="button"
            onClick={() => scrollTo(slideIndex)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
