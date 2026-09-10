"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
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
  photographerName = "Gaurav Dhamale",
  tagline = "Maharastra Seen Through My Lens",
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const brushstrokeRef = useRef<SVGSVGElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // 1. GSAP Orchestrated Intro Entrance & ScrollTrigger Scrub
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(
          ".hero-reveal-eyebrow, .hero-title-line, .hero-reveal-meta, .hero-reveal-footer, .hero-portrait-img, .hero-brushstroke, .hero-side-badge",
          {
            opacity: 1,
            y: 0,
            scale: 1,
          }
        );
        return;
      }

      const masterTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Step A: Eyebrow Greeting Fade-in
      masterTimeline.fromTo(
        ".hero-reveal-eyebrow",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
        0
      );

      // Step B: Monumental Typography Line-by-Line Split Reveal
      masterTimeline.fromTo(
        ".hero-title-line",
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",
        },
        0.15
      );

      // Step C: Name Divider & Tagline Reveal
      masterTimeline.fromTo(
        ".hero-reveal-meta",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.4
      );

      // Step D: Portrait & Painterly Brushstroke Entrance
      if (imageWrapperRef.current) {
        masterTimeline.fromTo(
          imageWrapperRef.current,
          {
            opacity: 0,
            scale: 1.06,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.3,
            ease: "expo.out",
          },
          0.3
        );
      }

      if (brushstrokeRef.current) {
        masterTimeline.fromTo(
          brushstrokeRef.current,
          { opacity: 0, scale: 0.9, rotate: -3 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: "power3.out" },
          0.35
        );
      }

      // Step E: Side Badge & Footer Meta & Scroll Cue
      masterTimeline.fromTo(
        ".hero-side-badge, .hero-reveal-footer",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" },
        0.55
      );

      // Continuous pulse for down arrow
      gsap.to(".scroll-indicator-arrow", {
        y: 4,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "power1.inOut",
      });

      // 2. GSAP ScrollTrigger Transition on scroll
      if (containerRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        if (textContentRef.current) {
          scrollTl.to(textContentRef.current, { yPercent: -20, opacity: 0.25, ease: "none" }, 0);
        }

        if (imageWrapperRef.current) {
          scrollTl.to(imageWrapperRef.current, { yPercent: -10, scale: 1.02, ease: "none" }, 0);
        }

        if (brushstrokeRef.current) {
          scrollTl.to(brushstrokeRef.current, { rotate: 6, scale: 1.05, opacity: 0.2, ease: "none" }, 0);
        }

        if (footerRef.current) {
          scrollTl.to(footerRef.current, { opacity: 0, y: -15, ease: "none" }, 0);
        }
      }
    },
    { scope: containerRef }
  );

  // 3. Desktop Mouse Parallax using GSAP quickTo
  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const imgWrapper = imageWrapperRef.current;
    const textEl = textContentRef.current;
    const brushEl = brushstrokeRef.current;
    if (!imgWrapper) return;

    const setImgX = gsap.quickTo(imgWrapper, "x", { duration: 0.8, ease: "power2.out" });
    const setImgY = gsap.quickTo(imgWrapper, "y", { duration: 0.8, ease: "power2.out" });

    let setTextX: gsap.QuickToFunc | null = null;
    let setTextY: gsap.QuickToFunc | null = null;
    if (textEl) {
      setTextX = gsap.quickTo(textEl, "x", { duration: 0.8, ease: "power2.out" });
      setTextY = gsap.quickTo(textEl, "y", { duration: 0.8, ease: "power2.out" });
    }

    let setBrushX: gsap.QuickToFunc | null = null;
    let setBrushY: gsap.QuickToFunc | null = null;
    if (brushEl) {
      setBrushX = gsap.quickTo(brushEl, "x", { duration: 1.1, ease: "power2.out" });
      setBrushY = gsap.quickTo(brushEl, "y", { duration: 1.1, ease: "power2.out" });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / innerHeight - 0.5) * 2;

      setImgX(xPercent * 12);
      setImgY(yPercent * 8);

      if (setTextX && setTextY) {
        setTextX(xPercent * -5);
        setTextY(yPercent * -4);
      }

      if (setBrushX && setBrushY) {
        setBrushX(xPercent * -10);
        setBrushY(yPercent * -7);
      }
    };

    const handleMouseLeave = () => {
      setImgX(0);
      setImgY(0);
      if (setTextX && setTextY) {
        setTextX(0);
        setTextY(0);
      }
      if (setBrushX && setBrushY) {
        setBrushX(0);
        setBrushY(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[calc(100vh-60px)] lg:min-h-screen flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-4 sm:pb-6 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Main Hero Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center my-auto w-full relative z-10">
        {/* Left Column: Monumental Branding & Statements */}
        <div
          ref={textContentRef}
          className="lg:col-span-6 flex flex-col justify-center space-y-3 sm:space-y-4 z-10 pt-2 lg:pt-0"
        >
          {/* Eyebrow Greeting */}
          <div className="hero-reveal-eyebrow text-xs sm:text-sm tracking-[0.25em] uppercase text-ink-muted font-mono font-medium">
            HELLO, I&apos;M
          </div>

          {/* Main Hero Title */}
          <div className="space-y-0 -my-1">
            <div className="overflow-hidden">
              <h1 className="hero-title-line font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[5.8rem] xl:text-[7.2rem] font-light text-ink leading-[0.9] tracking-tight">
                Gaurav
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-title-line font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[5.8rem] xl:text-[7.2rem] font-light italic text-ink leading-[0.9] tracking-tight">
                Unfiltered
              </h1>
            </div>
          </div>

          {/* Name Plate with Horizontal Divider Line */}
          <div className="hero-reveal-meta flex items-center space-x-3 sm:space-x-4 pt-3">
            <span className="text-xs sm:text-sm tracking-[0.22em] uppercase text-ink font-mono font-medium whitespace-nowrap">
              GAURAV Dhamale
            </span>
            <div className="h-[1px] w-24 sm:w-36 bg-ink/35" />
          </div>

          {/* Tagline / Perspective Subheading */}
          <div className="hero-reveal-meta pt-0.5">
            <p className="font-serif italic text-xl sm:text-2xl lg:text-[1.75rem] text-ink/85 tracking-wide text-pretty">
              Maharastra Seen Through My Lens
            </p>
          </div>
        </div>

        {/* Center-Right Column: Styled Cutout Portrait with Artistic Brushstrokes */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Background Artistic Painterly Brushstrokes matching reference mockup */}
          <svg
            ref={brushstrokeRef}
            viewBox="0 0 600 500"
            className="hero-brushstroke absolute -inset-10 sm:-inset-16 w-[130%] h-[130%] pointer-events-none -z-10 select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft broad textured chalk / paint streaks */}
            <path
              d="M 60 380 C 160 310, 290 230, 520 150"
              stroke="#D4C8BA"
              strokeWidth="32"
              strokeLinecap="round"
              className="opacity-60"
            />
            <path
              d="M 120 420 C 240 340, 360 250, 560 190"
              stroke="#C9BDB0"
              strokeWidth="22"
              strokeLinecap="round"
              className="opacity-50"
            />
            <path
              d="M 90 300 C 220 220, 350 170, 540 120"
              stroke="#DDD2C6"
              strokeWidth="18"
              strokeLinecap="round"
              className="opacity-70"
            />
            <path
              d="M 180 440 C 280 370, 420 300, 570 260"
              stroke="#C0B4A6"
              strokeWidth="14"
              strokeLinecap="round"
              className="opacity-40"
            />
          </svg>

          {/* Transparent Cutout Hero Portrait Container */}
          <div
            ref={imageWrapperRef}
            className="hero-portrait-img relative w-full max-w-sm sm:max-w-md aspect-[3/4.2] overflow-visible flex items-end justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src="/siteImages/gaurav_hero_cutout.png"
                alt="Gaurav Dhamale — Gaurav Unfiltered"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                className="object-contain object-bottom select-none"
              />
            </div>
          </div>
        </div>

        {/* Far-Right Column: Stacked 3-Line Vertical Badge matching reference mockup */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-start justify-center space-y-3.5 text-ink-muted hero-side-badge">
          <div className="w-[1px] h-12 bg-ink/30" />
          <div className="text-[9px] tracking-[0.24em] uppercase font-mono text-ink/70 leading-[1.65] select-none">
            <div>CAPTURING</div>
            <div>MOMENTS</div>
            <div>THAT MATTER</div>
          </div>
          <div className="w-5 h-[1px] bg-ink/30" />
        </div>
      </div>

      {/* Bottom Hero Footer Strip */}
      <div
        ref={footerRef}
        className="flex flex-col sm:flex-row items-center justify-between border-t border-ink/15 pt-3 sm:pt-4 text-xs text-ink-muted tracking-widest uppercase mt-4 sm:mt-6 gap-3"
      >
        {/* Left Discipline Metadata */}
        <div className="hero-reveal-footer flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 text-[10px] sm:text-[11px] font-mono text-ink-muted">
          <span className="text-bronze font-bold text-xs">•</span>
          <span>PHOTOGRAPHY</span>
          <span className="text-ink/20">/</span>
          <span>TRAVEL</span>
          <span className="text-ink/20">/</span>
          <span>CULTURE</span>
          <span className="text-ink/20">/</span>
          <span className="text-ink font-medium">MAHARASHTRA</span>
        </div>

        {/* Right Scroll Indicator */}
        <div
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hero-reveal-footer flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono text-ink hover:text-bronze transition-colors cursor-pointer select-none"
        >
          <span>SCROLL</span>
          <ArrowDown className="scroll-indicator-arrow w-3.5 h-3.5 text-ink hover:text-bronze transition-colors" />
        </div>
      </div>
    </section>
  );
}
