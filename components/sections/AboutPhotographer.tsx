"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteSettings } from "@/lib/db/schema";

interface AboutPhotographerProps {
  settings?: SiteSettings | null;
}

export function AboutPhotographer({ settings }: AboutPhotographerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const portraitInnerRef = useRef<HTMLDivElement>(null);

  const bio =
    settings?.bio ||
    "I photograph people, places, and fleeting moments — searching for the quiet details that usually disappear in the noise of modern life. Based between Paris and Tokyo, creating fine-art visual essays and commissioned editorial works worldwide.";

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 1. Portrait Reveal with Curtain Clip-Path
      if (portraitWrapperRef.current) {
        tl.fromTo(
          portraitWrapperRef.current,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        );
      }

      // 2. Headings & Bio Lines Stagger
      tl.fromTo(
        ".about-reveal-line",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
        },
        0.2
      );

      // 3. Body text & Stats Stagger
      tl.fromTo(
        ".about-text-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.4
      );

      // 4. Subtle Portrait Parallax on continuous scroll
      if (portraitInnerRef.current) {
        gsap.fromTo(
          portraitInnerRef.current,
          { yPercent: -4, scale: 1.06 },
          {
            yPercent: 6,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-10 sm:py-14 px-6 sm:px-12 max-w-7xl mx-auto border-t border-ink/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Portrait & Studio Location */}
        <div className="lg:col-span-5 space-y-4">
          <div
            ref={portraitWrapperRef}
            className="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-canvas-muted shadow-xl"
          >
            <div ref={portraitInnerRef} className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
                alt="Gaurav D. Portrait in Paris Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale contrast-105"
              />
            </div>
          </div>

          <div className="about-text-reveal flex items-center justify-between text-xs tracking-widest text-ink-muted uppercase border-b border-ink/10 pb-3 font-mono">
            <span>GAURAV D.</span>
            <span>PARIS • TOKYO</span>
          </div>
        </div>

        {/* Right Column: Statement, Bio & Philosophy */}
        <div className="lg:col-span-7 flex flex-col space-y-6 pt-1">
          <div className="space-y-1">
            <div className="overflow-hidden">
              <h2 className="about-reveal-line font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ink leading-[1.08]">
                A pursuit of silence and
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="about-reveal-line font-serif text-3xl sm:text-5xl lg:text-6xl font-light italic text-ink/90 leading-[1.08]">
                emotional resonance.
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-ink-muted text-base sm:text-lg leading-relaxed font-light">
            <p className="about-text-reveal">
              {bio}
            </p>
            <p className="about-text-reveal">
              Working strictly with available ambient light and mechanical manual focus optics, every
              frame represents a slow, meditative engagement with negative space and fleeting human presence.
            </p>
          </div>

          {/* Clean Discipline Stats */}
          <div className="about-text-reveal grid grid-cols-3 gap-6 pt-4 border-t border-ink/10">
            <div className="space-y-1">
              <span className="font-serif text-3xl sm:text-4xl text-ink font-light">14+</span>
              <p className="text-[11px] tracking-widest uppercase text-ink-muted">Years in field</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-3xl sm:text-4xl text-ink font-light">50+</span>
              <p className="text-[11px] tracking-widest uppercase text-ink-muted">Monographs</p>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-3xl sm:text-4xl text-ink font-light">Leica</span>
              <p className="text-[11px] tracking-widest uppercase text-ink-muted">Rangefinder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
