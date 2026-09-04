"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

export function SelectedStory() {
  const containerRef = useRef<HTMLElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // 1. Text & Header Reveal
      gsap.fromTo(
        ".story-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Parallax effect on dark section images
      if (leftImageRef.current) {
        gsap.fromTo(
          leftImageRef.current,
          { y: 60, clipPath: "inset(6% 0% 6% 0%)" },
          {
            y: -50,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      if (rightImageRef.current) {
        gsap.fromTo(
          rightImageRef.current,
          { y: -30, clipPath: "inset(6% 0% 6% 0%)" },
          {
            y: 50,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      id="stories"
      ref={containerRef}
      className="bg-canvas-dark text-canvas py-14 sm:py-20 px-6 sm:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow and Section Title */}
        <div className="flex flex-col space-y-3 max-w-3xl mb-8 sm:mb-12">
          <div className="story-reveal flex items-center space-x-3 text-xs tracking-ultra uppercase text-bronze">
            <span>•</span>
            <span>FEATURED VISUAL ESSAY</span>
          </div>
          <h2 className="story-reveal font-serif text-3xl sm:text-5xl font-light leading-tight">
            Shadows of Kyoto — A Study in Zen Architecture
          </h2>
          <p className="story-reveal text-sm sm:text-base text-canvas/70 font-light leading-relaxed pt-1">
            A three-week photographic immersion into the secluded Zen monasteries and cedar forests of
            Higashiyama. Documenting the sacred boundary between natural morning light and ancient
            hand-hewn timber.
          </p>
        </div>

        {/* Dual-image Juxtaposition Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Large Visual */}
          <div ref={leftImageRef} className="lg:col-span-7 flex flex-col group">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-white/5 border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600&auto=format&fit=crop"
                alt="Zen monastery pavilion in Kyoto bathed in warm golden hour light"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex justify-between text-xs tracking-widest text-canvas/60 uppercase">
              <span>PLATE I — CEDAR LATTICE REFLECTIONS</span>
              <span>KYOTO • 2025</span>
            </div>
          </div>

          {/* Secondary Detail Image + Story Narrative */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div ref={rightImageRef} className="relative aspect-[4/5] w-3/4 self-end lg:self-auto overflow-hidden bg-white/5 border border-white/10 group">
              <Image
                src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop"
                alt="Nocturne lantern reflections in rain-slicked Tokyo alleyways"
                fill
                sizes="(max-width: 1024px) 75vw, 35vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="space-y-3 pt-1">
              <p className="text-xs tracking-ultra text-bronze uppercase">
                EXIF & MEDIUM FORMAT DISCIPLINE
              </p>
              <p className="text-sm text-canvas/80 leading-relaxed font-light">
                Captured with mechanical rangefinders without tripod stabilization, embracing the subtle
                grain of high-ISO film simulations and organic shadows.
              </p>

              <Link
                href="/work/kyoto-temple-pavilion"
                className="inline-flex items-center space-x-2 text-xs font-medium tracking-ultra uppercase text-bronze hover:text-canvas transition-colors pt-1"
              >
                <span>READ COMPLETE VISUAL ESSAY</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
