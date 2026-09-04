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
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

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

      // 1. Initial Page Load Reveal
      tl.fromTo(
        metaRef.current,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1 }
      )
        .fromTo(
          ".hero-title-line",
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power4.out" },
          "-=0.5"
        )
        // Image Curtain Unmask
        .fromTo(
          imageFrameRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "power3.inOut" },
          "-=0.7"
        )
        .fromTo(
          captionRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        );

      // 2. Scroll-Driven GSAP ScrollTrigger Animations
      if (imageFrameRef.current && containerRef.current) {
        // Continuous smooth parallax scale & movement on scroll
        gsap.to(imageFrameRef.current, {
          yPercent: -10,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Layered optical depth on inner photograph
        if (imageInnerRef.current) {
          gsap.to(imageInnerRef.current, {
            yPercent: 14,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }

        // Headline subtle floating exit on scroll
        if (headlineRef.current) {
          gsap.to(headlineRef.current, {
            yPercent: -25,
            opacity: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-12 px-6 sm:px-12 max-w-7xl mx-auto"
    >
      {/* Top Editorial Headline (Completely Separate & Above the Image) */}
      <div className="flex flex-col space-y-4 max-w-5xl">
        <div
          ref={metaRef}
          className="flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted"
        >
          <span>{photographerName}</span>
          <span className="text-bronze">•</span>
          <span>FINE ART & EDITORIAL PHOTOGRAPHY</span>
        </div>

        <div ref={headlineRef}>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-ink leading-[0.98]">
            <span className="hero-title-line block overflow-hidden">
              Stories,
            </span>
            <span className="hero-title-line block overflow-hidden italic text-ink/90 font-light">
              framed in light.
            </span>
          </h1>
        </div>
      </div>

      {/* Main Photographic Canvas (Clean, Generously Spaced, Never Colliding with Text) */}
      <div className="my-10 sm:my-14 relative w-full">
        <div
          ref={imageFrameRef}
          className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[72vh] overflow-hidden bg-canvas-muted shadow-2xl group"
        >
          <div ref={imageInnerRef} className="relative w-full h-full">
            <Image
              src={heroImage}
              alt={heroTitle}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          </div>

          {/* Subtle Fine-art Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>

        {/* Minimal Editorial Caption Below Image */}
        <div
          ref={captionRef}
          className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between text-xs text-ink-muted tracking-widest uppercase gap-2"
        >
          <div className="flex items-center space-x-2">
            <span className="font-serif text-sm text-ink normal-case italic font-light">
              {heroTitle}
            </span>
            <span className="text-bronze">•</span>
            <span>{heroLocation}</span>
          </div>

          <Link
            href={`/work/${heroSlug}`}
            className="text-[11px] tracking-ultra text-ink hover:text-bronze transition-colors self-start sm:self-auto underline underline-offset-4"
          >
            VIEW PHOTOGRAPH ESSAY →
          </Link>
        </div>
      </div>

      {/* Bottom Status & Scroll Cue */}
      <div className="flex items-center justify-between border-t border-ink/10 pt-6 text-xs text-ink-muted tracking-widest uppercase">
        <div className="flex items-center space-x-6 text-[11px]">
          <span>PARIS — TOKYO</span>
          <span className="text-bronze">•</span>
          <span>ESTABLISHED 2012</span>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center space-x-2 text-ink hover:text-bronze transition-colors cursor-pointer group"
        >
          <span className="text-[10px] tracking-ultra">SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-1" />
        </div>
      </div>
    </section>
  );
}
