"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
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
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);

  const heroImage1 =
    featuredPhoto?.imageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop";
  const heroImage2 =
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop";

  const heroTitle = featuredPhoto?.title || "Between Shadows & Solitude";
  const heroSlug = featuredPhoto?.slug || "between-shadows-and-solitude";

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Staggered entrance for left editorial column
      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          ".hero-title-word",
          { opacity: 0, y: 45, rotateX: -15 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.08 },
          "-=0.5"
        )
        .fromTo(
          ".hero-description",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta-group",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        // Staggered clip-path image reveals on right side
        .fromTo(
          mainImageRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.4, ease: "power3.inOut" },
          "-=1.1"
        )
        .fromTo(
          secondaryImageRef.current,
          { clipPath: "inset(0% 100% 0% 0%)", opacity: 0, x: 20 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
          "-=0.8"
        )
        .fromTo(
          ".hero-floating-badge",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-center pt-28 sm:pt-36 pb-16 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Rich Editorial Typography & Actions */}
        <div ref={leftColRef} className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-8 z-10">
          {/* Eyebrow */}
          <div className="hero-eyebrow flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted">
            <span className="inline-block w-8 h-[1px] bg-bronze" />
            <span>FINE ART & EDITORIAL VISUAL ARTIST</span>
          </div>

          {/* Large Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-ink leading-[1.08]">
            {tagline.split(" ").map((word, idx) => (
              <span
                key={idx}
                className="hero-title-word inline-block mr-3 sm:mr-4 transform-gpu"
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subtext Statement */}
          <p className="hero-description text-ink-muted text-base sm:text-lg font-light leading-relaxed max-w-lg">
            Documenting the quiet boundary between natural light, brutalist architecture, and human
            vulnerability. Creating visual monographs across Paris, Tokyo, and remote terrains worldwide.
          </p>

          {/* Discipline Badges */}
          <div className="hero-description flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono tracking-widest text-ink/70 uppercase">
            <span className="bg-ink/5 border border-ink/10 px-3 py-1 rounded-full">
              LEICA M11 / MONOCHROME
            </span>
            <span className="bg-ink/5 border border-ink/10 px-3 py-1 rounded-full">
              35MM & MEDIUM FORMAT
            </span>
            <span className="bg-ink/5 border border-ink/10 px-3 py-1 rounded-full text-bronze">
              PARIS • TOKYO
            </span>
          </div>

          {/* CTAs */}
          <div className="hero-cta-group flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/work"
              className="group inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-canvas text-xs font-medium tracking-ultra uppercase hover:bg-bronze transition-all duration-300 shadow-sm"
            >
              <span>EXPLORE COMPLETE ARCHIVE</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center space-x-2 px-6 py-3.5 border border-ink/20 text-ink text-xs font-medium tracking-ultra uppercase hover:border-ink hover:bg-ink/5 transition-all duration-300"
            >
              <span>COMMISSION INQUIRY</span>
            </a>
          </div>
        </div>

        {/* Right Column: Intertwined Asymmetric Image Composition */}
        <div ref={rightColRef} className="lg:col-span-6 relative w-full flex items-center justify-center lg:justify-end">
          {/* Main Large Artwork */}
          <div
            ref={mainImageRef}
            className="relative w-full sm:w-[88%] aspect-[4/5] overflow-hidden bg-canvas-muted shadow-2xl border border-ink/5 group"
          >
            <Image
              src={heroImage1}
              alt="Fine art photography portrait composition"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient & Tag */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-canvas">
              <div>
                <span className="text-[10px] tracking-ultra uppercase text-bronze-light block">
                  SELECTED MONOGRAPH
                </span>
                <p className="font-serif text-xl sm:text-2xl text-canvas font-light">
                  {heroTitle}
                </p>
              </div>
              <Link
                href={`/work/${heroSlug}`}
                className="text-[10px] tracking-ultra uppercase text-canvas/80 hover:text-canvas underline underline-offset-4"
              >
                VIEW ESSAY →
              </Link>
            </div>
          </div>

          {/* Secondary Overlapping Frame (Architectural Detail) */}
          <div
            ref={secondaryImageRef}
            className="hidden sm:block absolute -bottom-8 -left-6 w-56 lg:w-64 aspect-[16/10] overflow-hidden bg-canvas border-2 border-canvas shadow-2xl z-20 group"
          >
            <Image
              src={heroImage2}
              alt="Architectural light and shadow detail"
              fill
              sizes="256px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2.5 right-2.5 text-[9px] font-mono tracking-widest text-canvas bg-ink/80 px-2 py-1 uppercase backdrop-blur-sm">
              COPENHAGEN • 45MM F/4
            </div>
          </div>

          {/* Floating Curatorial Badge */}
          <div className="hero-floating-badge absolute -top-4 right-4 sm:-right-4 bg-canvas border border-ink/15 px-4 py-2.5 shadow-lg z-20 flex items-center space-x-2 text-ink">
            <Sparkles className="w-3.5 h-3.5 text-bronze" />
            <span className="text-[10px] font-mono tracking-widest uppercase">
              2026 EDITION ARCHIVE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="mt-12 sm:mt-16 flex items-center justify-between border-t border-ink/10 pt-6 text-xs text-ink-muted tracking-widest uppercase">
        <div className="flex items-center space-x-6">
          <span>PARIS STUDIO (02E)</span>
          <span className="text-bronze">•</span>
          <span>TOKYO (MINATO)</span>
          <span className="hidden sm:inline text-bronze">•</span>
          <span className="hidden sm:inline">WORLDWIDE ASSIGNMENTS</span>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center space-x-2 text-ink hover:text-bronze transition-colors cursor-pointer"
        >
          <span className="text-[11px] tracking-ultra">SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
