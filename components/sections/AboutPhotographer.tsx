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
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
        },
        0.35
      );

      // 4. Subtle Portrait Parallax on continuous scroll
      if (portraitInnerRef.current) {
        gsap.fromTo(
          portraitInnerRef.current,
          { yPercent: -2, scale: 1.02 },
          {
            yPercent: 2,
            scale: 1.0,
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
      className="py-10 sm:py-14 lg:py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-ink/10"
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-11 items-start">
        {/* Left Column: Portrait & Location Tag */}
        <div className="w-full lg:w-[375px] shrink-0 flex flex-col items-center lg:items-start space-y-2.5">
          <div
            ref={portraitWrapperRef}
            className="relative aspect-[1024/1416] w-full max-w-[375px] overflow-hidden bg-black shadow-xl border border-ink/15 rounded-[2px]"
          >
            <div ref={portraitInnerRef} className="relative w-full h-full">
              <Image
                src="/siteImages/gaurav_about_img.webp"
                alt="Gaurav Unfiltered with camera"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 375px"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="about-text-reveal w-full max-w-[375px] flex items-center justify-between text-[11px] sm:text-xs tracking-widest text-ink-muted uppercase border-b border-ink/10 pb-2 font-mono">
            <span className="font-semibold text-ink">GAURAV UNFILTERED</span>
            <span className="text-ink-muted">MAHARASHTRA, INDIA</span>
          </div>
        </div>

        {/* Right Column: Statement, Narrative & Badges */}
        <div className="flex-1 min-w-0 flex flex-col space-y-3.5 lg:space-y-4">
          <div>
            <div className="about-text-reveal flex items-center space-x-2.5 text-xs tracking-ultra uppercase text-ink-muted mb-2">
              <span className="text-bronze">•</span>
              <span>ABOUT & PERSPECTIVE</span>
            </div>
            <div className="overflow-hidden">
              <h2 className="about-reveal-line font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-light text-ink leading-[1.1]">
                Maharashtra — <span className="italic font-normal text-ink/90">Culture in Focus</span>
              </h2>
            </div>
          </div>

          <div className="space-y-3.5 sm:space-y-4 text-ink-muted text-sm sm:text-base leading-relaxed font-light">
            <p className="about-text-reveal text-ink font-serif text-lg sm:text-xl lg:text-2xl italic leading-relaxed text-pretty text-ink/90">
              &ldquo;I&apos;m Gaurav, a photographer drawn to people, culture and the small moments that often go unnoticed.&rdquo;
            </p>
            <p className="about-text-reveal">
              I love travelling with a camera and documenting life as it happens — from the busy streets of Mumbai to quieter corners of Maharashtra.
            </p>
            <p className="about-text-reveal">
              My work focuses on street photography, portraits, travel and the culture of Maharashtra. I look for honest expressions, everyday gestures, changing light and moments that tell something about a place or a person.
            </p>
            <p className="about-text-reveal">
              Photography, for me, is less about creating a perfect picture and more about preserving a feeling, a face, a place or a moment that might otherwise disappear.
            </p>
          </div>

          {/* Badges Strip: Responsive, cleanly formatted cards */}
          <div className="about-text-reveal grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-5 mt-2 border-t border-ink/10">
            <div className="p-3 sm:p-3.5 bg-canvas-muted/50 border border-ink/5 rounded-[2px] flex flex-col justify-center">
              <span className="text-[10px] tracking-widest uppercase text-bronze font-mono mb-0.5">Camera Body</span>
              <span className="font-serif text-base sm:text-lg text-ink font-normal leading-snug">
                Canon M50 Mark II
              </span>
            </div>

            <div className="p-3 sm:p-3.5 bg-canvas-muted/50 border border-ink/5 rounded-[2px] flex flex-col justify-center">
              <span className="text-[10px] tracking-widest uppercase text-bronze font-mono mb-0.5">Visual Stories</span>
              <span className="font-serif text-base sm:text-lg text-ink font-normal leading-snug">
                Stories to discover
              </span>
            </div>

            <div className="p-3 sm:p-3.5 bg-canvas-muted/50 border border-ink/5 rounded-[2px] flex flex-col justify-center">
              <span className="text-[10px] tracking-widest uppercase text-bronze font-mono mb-0.5">Explorations</span>
              <span className="font-serif text-base sm:text-lg text-ink font-normal leading-snug">
                Maharashtra & beyond
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
