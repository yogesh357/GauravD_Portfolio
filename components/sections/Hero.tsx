"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Photo } from "@/lib/db/schema";

interface HeroProps {
  featuredPhoto?: Photo | null;
  photographerName?: string;
  tagline?: string;
}

export function Hero({
  featuredPhoto,
  photographerName = "Gaurav D.",
  tagline = "Stories, framed in light.",
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const heroImage =
    featuredPhoto?.imageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop";
  const heroAlt = featuredPhoto?.imageAlt || "Fine art photography hero composition";
  const heroTitle = featuredPhoto?.title || "Between Shadows & Solitude";
  const heroSlug = featuredPhoto?.slug || "between-shadows-and-solitude";

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Reveal eyebrow and headline
      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          ".hero-title-word",
          { opacity: 0, y: 40, rotateX: -15 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.08 },
          "-=0.5"
        )
        // 2. Reveal Image with cinematic clip-path
        .fromTo(
          imageWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "power3.inOut" },
          "-=0.7"
        )
        // 3. Stagger meta and scroll indicator
        .fromTo(
          metaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 px-6 sm:px-12 max-w-7xl mx-auto"
    >
      {/* Top Header Eyebrow & Title */}
      <div className="flex flex-col space-y-4 max-w-4xl">
        <div className="hero-eyebrow flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted">
          <span className="inline-block w-6 h-[1px] bg-bronze" />
          <span>VISUAL ARTIST & PHOTOGRAPHER — EST. 2012</span>
        </div>

        <h1
          ref={headlineRef}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-ink leading-[1.05]"
        >
          {tagline.split(" ").map((word, idx) => (
            <span
              key={idx}
              className="hero-title-word inline-block mr-3 sm:mr-4 transform-gpu"
            >
              {word}
            </span>
          ))}
        </h1>
      </div>

      {/* Hero Visual Showcase */}
      <div className="my-8 sm:my-12 relative w-full group">
        <div
          ref={imageWrapperRef}
          className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[72vh] overflow-hidden bg-canvas-muted rounded-none"
        >
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60" />

          {/* Floating Photo Tag */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-canvas">
            <div>
              <p className="text-[10px] sm:text-xs tracking-ultra uppercase text-canvas/80">
                FEATURED WORK / 01
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-light text-canvas">
                {heroTitle}
              </h2>
            </div>
            <Link
              href={`/work/${heroSlug}`}
              className="inline-flex items-center space-x-1.5 text-xs tracking-widest uppercase bg-canvas/90 text-ink px-4 py-2 hover:bg-canvas transition-colors"
            >
              <span>VIEW ESSAY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Metadata & Scroll Indicator */}
      <div
        ref={metaRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-ink/10 pt-6 text-xs text-ink-muted tracking-widest uppercase"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>LEICA M11 / HASSELBLAD</span>
          <span className="hidden sm:inline text-bronze">•</span>
          <span>PARIS — TOKYO — WORLDWIDE</span>
          <span className="hidden sm:inline text-bronze">•</span>
          <span>FINE ART & COMMISSIONS</span>
        </div>

        <div
          ref={scrollRef}
          className="flex items-center space-x-2 text-ink hover:text-bronze transition-colors cursor-pointer self-start sm:self-auto"
          onClick={() => {
            const el = document.getElementById("intro");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[11px] tracking-ultra">SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
