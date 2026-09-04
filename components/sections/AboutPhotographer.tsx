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

      gsap.fromTo(
        ".about-element",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto border-t border-ink/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Portrait & Studio Location */}
        <div className="about-element lg:col-span-5 space-y-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas-muted shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
              alt="Gaurav D. Portrait in Paris Studio"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover grayscale contrast-105"
            />
          </div>

          <div className="flex items-center justify-between text-xs tracking-widest text-ink-muted uppercase border-b border-ink/10 pb-4 font-mono">
            <span>GAURAV D.</span>
            <span>PARIS • TOKYO</span>
          </div>
        </div>

        {/* Right Column: Statement, Bio & Philosophy */}
        <div className="lg:col-span-7 flex flex-col space-y-8 pt-2">
          <h2 className="about-element font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ink leading-[1.1]">
            A pursuit of silence and emotional resonance in an overstimulated world.
          </h2>

          <div className="space-y-5 text-ink-muted text-base sm:text-lg leading-relaxed font-light">
            <p className="about-element">
              {bio}
            </p>
            <p className="about-element">
              Working strictly with available ambient light and mechanical manual focus optics, every
              frame represents a slow, meditative engagement with negative space and fleeting human presence.
            </p>
          </div>

          {/* Clean Discipline Stats */}
          <div className="about-element grid grid-cols-3 gap-6 pt-6 border-t border-ink/10">
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
