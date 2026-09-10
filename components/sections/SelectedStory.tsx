"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SelectedStory() {
  const containerRef = useRef<HTMLElement>(null);
  const leftWrapperRef = useRef<HTMLDivElement>(null);
  const leftInnerImgRef = useRef<HTMLDivElement>(null);
  const rightWrapperRef = useRef<HTMLDivElement>(null);
  const rightInnerImgRef = useRef<HTMLDivElement>(null);
  const thirdWrapperRef = useRef<HTMLDivElement>(null);
  const thirdInnerImgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(".story-reveal, .story-heading-line, .story-img-wrap, .story-plate-tag", {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }

      // 1. Header Split-typography & Eyebrow Reveal
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      headerTl
        .fromTo(
          ".story-eyebrow",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
          0
        )
        .fromTo(
          ".story-heading-line",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
          0.1
        )
        .fromTo(
          ".story-narrative-reveal",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" },
          0.25
        );

      // 2. Responsive ScrollTriggers for Image Entrance & Optical Parallax Scrub
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          // Left Image 1 (Cultural Portrait - Girgaon)
          if (leftWrapperRef.current && leftInnerImgRef.current) {
            gsap.fromTo(
              leftWrapperRef.current,
              {
                opacity: 0,
                y: 40,
                scale: 0.95,
                clipPath: "inset(8% 0% 8% 0%)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: leftWrapperRef.current,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              }
            );

            gsap.fromTo(
              leftInnerImgRef.current,
              {
                yPercent: -8,
                scale: 1.12,
              },
              {
                yPercent: 8,
                scale: 1.03,
                ease: "none",
                scrollTrigger: {
                  trigger: leftWrapperRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              }
            );
          }

          // Right Image 2 (Kushti Wrestling - Kolhapur)
          if (rightWrapperRef.current && rightInnerImgRef.current) {
            gsap.fromTo(
              rightWrapperRef.current,
              {
                opacity: 0,
                y: 40,
                scale: 0.95,
                clipPath: "inset(8% 0% 8% 0%)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: rightWrapperRef.current,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              }
            );

            gsap.fromTo(
              rightInnerImgRef.current,
              {
                yPercent: -7,
                scale: 1.10,
              },
              {
                yPercent: 7,
                scale: 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: rightWrapperRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              }
            );
          }

          // Image 3 (Lalbaug Cha Raja Visarjan - Mumbai)
          if (thirdWrapperRef.current && thirdInnerImgRef.current) {
            gsap.fromTo(
              thirdWrapperRef.current,
              {
                opacity: 0,
                y: 40,
                scale: 0.95,
                clipPath: "inset(8% 0% 8% 0%)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: thirdWrapperRef.current,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              }
            );

            gsap.fromTo(
              thirdInnerImgRef.current,
              {
                yPercent: -6,
                scale: 1.10,
              },
              {
                yPercent: 6,
                scale: 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: thirdWrapperRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              }
            );
          }
        }
      );

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        clearTimeout(timer);
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      id="stories"
      ref={containerRef}
      className="bg-canvas-dark text-canvas py-12 sm:py-16 lg:py-24 px-6 sm:px-12 border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow and Section Title */}
        <div className="flex flex-col space-y-3 max-w-4xl mb-10 sm:mb-16">
          <div className="story-eyebrow flex items-center space-x-2.5 text-xs tracking-ultra uppercase text-bronze">
            <span>•</span>
            <span>FEATURED VISUAL ESSAY</span>
          </div>
          <div className="overflow-hidden">
            <h2 className="story-heading-line font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              The Spirit of Maharashtra —{" "}
              <span className="italic font-normal text-canvas/90">A Study in Strength &amp; Tradition</span>
            </h2>
          </div>
        </div>

        {/* Dual-Column Balanced Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image 1 (Cultural Portrait - Girgaon) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Image 1 Container with Isolated Clip-Path & Overflow */}
            <div className="flex flex-col group">
              <div
                ref={leftWrapperRef}
                className="story-img-wrap relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-white/5 border border-white/10 shadow-2xl rounded-[2px]"
              >
                <div ref={leftInnerImgRef} className="relative w-full h-full will-change-transform">
                  <Image
                    src="/siteImages/featured/gaurav_feat_2.webp"
                    alt="Traditional Maharashtrian cultural portrait with pheta, nath, and saree in Girgaon"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>

              {/* Plate I Caption */}
              <div className="story-plate-tag mt-3 flex items-center justify-between text-[11px] sm:text-xs tracking-widest text-canvas/60 uppercase font-mono border-b border-white/10 pb-2">
                <span className="text-canvas/80">PLATE I — CULTURAL IDENTITY &amp; HERITAGE</span>
                <span className="text-bronze font-medium">GIRGAON</span>
              </div>
            </div>

            {/* Narrative text block */}
            <div className="story-narrative-reveal pt-0.5">
              <p className="text-canvas/80 text-sm sm:text-base leading-relaxed font-light">
                The pheta, traditional jewellery, nath, saree and distinctive cultural symbols come
                together to create a visual representation of an identity deeply rooted in history.
                The portrait captures not just traditional attire, but the confidence and dignity
                with which that heritage is carried into the present.
              </p>
            </div>
          </div>

          {/* Right Column: Image 2 & Image 3 Stacked Compactly */}
          <div className="lg:col-span-6 flex flex-col space-y-5 sm:space-y-6 lg:pt-2">
            {/* Image 2 Section: Kushti Akhada (Kolhapur) */}
            <div className="flex flex-col space-y-3">
              {/* Narrative text block at top */}
              <div className="story-narrative-reveal space-y-1.5">
                <div className="flex items-center space-x-2 text-xs tracking-ultra text-bronze uppercase font-mono">
                  <span>•</span>
                  <span>AKHADA &amp; TALIM DISCIPLINE</span>
                </div>
                <p className="text-canvas/80 text-xs sm:text-sm leading-relaxed font-light">
                  A powerful moment from Maharashtra’s traditional wrestling culture, capturing the
                  intense focus and raw determination of a young wrestler inside the akhada. Beyond
                  physical strength, kushti is a tradition shaped by discipline, endurance, and respect.
                </p>
              </div>

              {/* Image 2 Container */}
              <div className="flex flex-col group">
                <div
                  ref={rightWrapperRef}
                  className="story-img-wrap relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-white/5 border border-white/10 shadow-2xl rounded-[2px]"
                >
                  <div ref={rightInnerImgRef} className="relative w-full h-full will-change-transform">
                    <Image
                      src="/siteImages/featured/gaurav_feat_1.webp"
                      alt="Traditional kushti wrestling akhada focus in Kolhapur"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />
                </div>

                {/* Plate II Caption */}
                <div className="story-plate-tag mt-2 flex items-center justify-between text-[11px] sm:text-xs tracking-widest text-canvas/60 uppercase font-mono border-b border-white/10 pb-1.5">
                  <span className="text-canvas/80">PLATE II — RAW DETERMINATION IN THE TALIM</span>
                  <span className="text-bronze font-medium">KOLHAPUR</span>
                </div>
              </div>
            </div>

            {/* Image 3 Section: Lalbaug Cha Raja Visarjan (Mumbai) */}
            <div className="flex flex-col space-y-3 pt-1">
              {/* Narrative tag */}
              <div className="story-narrative-reveal space-y-1.5">
                <div className="flex items-center space-x-2 text-xs tracking-ultra text-bronze uppercase font-mono">
                  <span>•</span>
                  <span>VISARJAN &amp; COLLECTIVE DEVOTION</span>
                </div>
                <p className="text-canvas/80 text-xs sm:text-sm leading-relaxed font-light">
                  Amidst clouds of gulal and the historic chawls of Lalbaug, millions gather on the
                  streets of Mumbai for the immersion procession of Lalbaugcha Raja — a monumental
                  testament to faith and cultural grandeur.
                </p>
              </div>

              {/* Image 3 Container */}
              <div className="flex flex-col group">
                <div
                  ref={thirdWrapperRef}
                  className="story-img-wrap relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-white/5 border border-white/10 shadow-2xl rounded-[2px]"
                >
                  <div ref={thirdInnerImgRef} className="relative w-full h-full will-change-transform">
                    <Image
                      src="/siteImages/featured/gaurav_feat_3.webp"
                      alt="Visarjan of Lalbaug Cha Raja procession in Mumbai"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />
                </div>

                {/* Plate III Caption */}
                <div className="story-plate-tag mt-2 flex items-center justify-between text-[11px] sm:text-xs tracking-widest text-canvas/60 uppercase font-mono border-b border-white/10 pb-1.5">
                  <span className="text-canvas/80">PLATE III — VISARJAN - LALBAUG CHA RAJA</span>
                  <span className="text-bronze font-medium">MUMBAI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
