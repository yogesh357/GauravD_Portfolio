"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
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
  const backgroundTextRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const headlineTopRef = useRef<HTMLHeadingElement>(null);
  const headlineBottomRef = useRef<HTMLHeadingElement>(null);

  const heroImage =
    featuredPhoto?.imageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop";
  const heroTitle = featuredPhoto?.title || "Between Shadows & Solitude";
  const heroSlug = featuredPhoto?.slug || "between-shadows-and-solitude";
  const heroLocation = featuredPhoto?.location || "Paris, France";

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Initial entrance animations on page load
      tl.fromTo(
        ".hero-meta-top",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          ".hero-headline-top-word",
          { opacity: 0, y: 70, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.1, stagger: 0.08, ease: "power4.out" },
          "-=0.5"
        )
        // Image Curtain Clip-Path Reveal
        .fromTo(
          imageContainerRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.14 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.5, ease: "power3.inOut" },
          "-=0.9"
        )
        .fromTo(
          ".hero-headline-bottom-word",
          { opacity: 0, y: 60, skewY: -3 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.1, stagger: 0.08, ease: "power4.out" },
          "-=1.0"
        )
        .fromTo(
          ".hero-meta-bottom",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );

      // 2. Scroll-Driven Parallax Layering with ScrollTrigger
      if (imageContainerRef.current) {
        gsap.to(imageContainerRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      if (backgroundTextRef.current) {
        gsap.to(backgroundTextRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Oversized Ghost Watermark in Background */}
      <div
        ref={backgroundTextRef}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0"
      >
        <span className="font-serif text-[18vw] leading-none text-ink/[0.03] tracking-tighter uppercase whitespace-nowrap block">
          GAURAV D.
        </span>
      </div>

      {/* Top Editorial Index Strip */}
      <div className="hero-meta-top relative z-10 flex items-center justify-between border-b border-ink/10 pb-4 text-[11px] font-sans tracking-ultra uppercase text-ink-muted">
        <div className="flex items-center space-x-3">
          <span className="text-bronze">01</span>
          <span>/</span>
          <span>VISUAL ESSAYS & MONOGRAPHS</span>
        </div>
        <div className="hidden sm:flex items-center space-x-6">
          <span>PARIS ATELIER (02E)</span>
          <span className="text-bronze">•</span>
          <span>TOKYO (MINATO)</span>
        </div>
        <div className="text-right">
          <span>EDITION 2026</span>
        </div>
      </div>

      {/* Main Art-Directed Editorial Canvas */}
      <div className="relative z-10 my-8 sm:my-12 flex flex-col items-center">
        {/* Top Headline Anchor */}
        <div className="w-full flex justify-start mb-2 sm:mb-4">
          <h1
            ref={headlineTopRef}
            className="font-serif text-4xl sm:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight text-ink leading-[0.95]"
          >
            {"The Architecture".split(" ").map((word, idx) => (
              <span
                key={idx}
                className="hero-headline-top-word inline-block mr-3 sm:mr-6 transform-gpu"
              >
                {word}
              </span>
            ))}
          </h1>
        </div>

        {/* Central Monumental Fine-Art Canvas */}
        <div className="relative w-full sm:w-[85%] lg:w-[72%] my-[-2vw] sm:my-[-3vw] z-10">
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/9] overflow-hidden bg-canvas-muted shadow-2xl group"
          >
            <Image
              src={heroImage}
              alt="Fine art photography hero composition"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Subtle Vignette & Frame Highlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* In-Frame Curatorial Tag */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-end justify-between text-canvas">
              <div>
                <span className="text-[9px] sm:text-[10px] tracking-ultra uppercase text-canvas/70 font-mono block mb-0.5">
                  PLATE 01 • {heroLocation}
                </span>
                <p className="font-serif text-base sm:text-xl text-canvas font-light">
                  {heroTitle}
                </p>
              </div>
              <Link
                href={`/work/${heroSlug}`}
                className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-canvas/90 hover:text-bronze-light transition-colors underline underline-offset-4"
              >
                VIEW MONOGRAPH →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Headline Overlapping the Frame */}
        <div className="w-full flex justify-end mt-2 sm:mt-4 z-20">
          <h2
            ref={headlineBottomRef}
            className="font-serif text-3xl sm:text-6xl lg:text-8xl xl:text-9xl font-light italic tracking-tight text-ink leading-[0.95] text-right"
          >
            {"of Fleeting Light.".split(" ").map((word, idx) => (
              <span
                key={idx}
                className="hero-headline-bottom-word inline-block mr-3 sm:mr-6 transform-gpu"
              >
                {word}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Bottom Editorial Colophon & Scroll Trigger */}
      <div className="hero-meta-bottom relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end border-t border-ink/10 pt-6 text-xs text-ink-muted">
        {/* Curatorial Brief */}
        <div className="sm:col-span-6 space-y-1">
          <p className="text-[10px] tracking-ultra uppercase text-bronze font-sans font-medium">
            CURATORIAL STATEMENT
          </p>
          <p className="text-ink/80 text-xs sm:text-sm font-light leading-relaxed max-w-md">
            A photographic study in available daylight, negative space, and quiet human vulnerability
            across contemporary architectural landscapes.
          </p>
        </div>

        {/* Coordinates */}
        <div className="sm:col-span-3 font-mono text-[11px] tracking-widest uppercase text-ink/60">
          <p>48.8688° N, 2.3413° E</p>
          <p>LEICA M11 & HASSELBLAD</p>
        </div>

        {/* Minimalist Scroll Cue */}
        <div
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="sm:col-span-3 flex items-center justify-start sm:justify-end space-x-2 text-ink hover:text-bronze transition-colors cursor-pointer group"
        >
          <span className="text-[10px] tracking-ultra uppercase">SCROLL TO EXPLORE</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-1" />
        </div>
      </div>
    </section>
  );
}
