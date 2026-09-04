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

  const clients = [
    "Vogue International",
    "Kinfolk Magazine",
    "Monocle",
    "National Geographic Traveller",
    "Leica Camera AG",
    "The Architectural Review",
    "Hasselblad Master Series",
    "Wallpaper* Magazine",
  ];

  const exhibitions = [
    { year: "2025", title: "Quiet Geometry & Sacred Space", venue: "Galerie Vivienne, Paris" },
    { year: "2024", title: "The Nordic Solitude", venue: "Fotografiska, Stockholm" },
    { year: "2023", title: "Shadows of the East", venue: "Daikanyama T-Site, Tokyo" },
    { year: "2022", title: "Sony World Photography Awards", venue: "Somerset House, London (Shortlisted)" },
  ];

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
          stagger: 0.1,
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
      {/* Eyebrow */}
      <div className="flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted mb-16">
        <span className="text-bronze">05</span>
        <span>/</span>
        <span>ARTIST PROFILE & RECOGNITION</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Photographer Portrait */}
        <div className="about-element lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas-muted">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
              alt="Gaurav D. Portrait in Paris Studio"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover grayscale contrast-105"
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs tracking-widest text-ink-muted uppercase">
            <span>GAURAV D. — FOUNDER & DIRECTOR</span>
            <span>PARIS STUDIO • 2026</span>
          </div>
        </div>

        {/* Right Column: Biography, Clients, Exhibitions */}
        <div className="lg:col-span-7 flex flex-col space-y-12">
          <div className="space-y-6">
            <h2 className="about-element font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ink leading-tight">
              A pursuit of stillness in an overstimulated world.
            </h2>
            <p className="about-element text-ink-muted text-base sm:text-lg leading-relaxed font-light">
              {bio}
            </p>
          </div>

          {/* Selected Clients Grid */}
          <div className="about-element pt-6 border-t border-ink/10">
            <p className="text-[11px] font-sans tracking-ultra uppercase text-bronze mb-6">
              SELECTED CLIENTS & EDITORIAL PUBLICATIONS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs tracking-widest uppercase text-ink/80">
              {clients.map((client) => (
                <div
                  key={client}
                  className="border-b border-ink/10 pb-2 hover:text-bronze transition-colors"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Exhibitions & Honors */}
          <div className="about-element pt-6 border-t border-ink/10">
            <p className="text-[11px] font-sans tracking-ultra uppercase text-bronze mb-6">
              SOLO & GROUP EXHIBITIONS
            </p>
            <div className="flex flex-col space-y-4">
              {exhibitions.map((ex) => (
                <div
                  key={ex.title}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-ink/5 pb-3 text-sm gap-1 sm:gap-4"
                >
                  <div className="flex items-baseline space-x-3">
                    <span className="font-mono text-xs text-bronze">{ex.year}</span>
                    <span className="font-serif text-ink text-base sm:text-lg">{ex.title}</span>
                  </div>
                  <span className="text-xs text-ink-muted tracking-widest uppercase">
                    {ex.venue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
