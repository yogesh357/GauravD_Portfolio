"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

export function ArtistStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".statement-line",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".stat-block",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="intro"
      ref={containerRef}
      className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto border-t border-ink/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column Label */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="statement-line flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted">
            <span className="text-bronze">01</span>
            <span>/</span>
            <span>PHILOSOPHY & VISION</span>
          </div>
          <p className="statement-line font-serif italic text-xl sm:text-2xl text-ink/70">
            &ldquo;Light does not merely illuminate reality; it carves emotion out of silence.&rdquo;
          </p>
        </div>

        {/* Right Column Editorial Narrative */}
        <div className="lg:col-span-8 flex flex-col space-y-12">
          <div className="space-y-6">
            <p
              ref={textRef}
              className="statement-line font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-ink leading-relaxed tracking-tight text-pretty"
            >
              I photograph people, places, and fleeting moments — searching for the quiet details
              that usually disappear in the noise of modern life.
            </p>
            <p className="statement-line text-ink-muted text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              Working primarily with mechanical rangefinders and medium-format digital sensors,
              every composition is approached with meditative slowness. No artificial studio sets;
              only authentic available illumination and raw human presence.
            </p>
          </div>

          {/* Discipline Credentials Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 border-t border-ink/10">
            <div className="stat-block space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-light text-ink">14+</span>
              <p className="text-[11px] tracking-widest uppercase text-ink-muted">
                Years in the field
              </p>
            </div>
            <div className="stat-block space-y-1">
              <span className="font-serif text-3xl sm:text-4xl font-light text-ink">24+</span>
              <p className="text-[11px] tracking-widest uppercase text-ink-muted">
                Global Exhibitions
              </p>
            </div>
            <div className="stat-block space-y-1 col-span-2 sm:col-span-1">
              <span className="font-serif text-3xl sm:text-4xl font-light text-ink">Leica</span>
              <p className="text-[11px] tracking-widest uppercase text-ink-muted">
                M11 & Monochrome
              </p>
            </div>
          </div>

          <div className="statement-line pt-2">
            <a
              href="#about"
              className="group inline-flex items-center space-x-2 text-xs font-medium tracking-ultra uppercase text-ink hover:text-bronze transition-colors"
            >
              <span>DISCOVER ARTIST BIOGRAPHY</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
