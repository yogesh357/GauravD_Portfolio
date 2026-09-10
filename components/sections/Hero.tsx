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
      className="relative h-screen min-h-[600px] max-h-[960px] flex flex-col justify-between pt-16 sm:pt-20 lg:pt-22 pb-3 sm:pb-4 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* Main Hero Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center my-auto w-full relative z-10">
        {/* Left Column: Monumental Branding & Statements */}
        <div
          ref={textContentRef}
          className="lg:col-span-6 flex flex-col justify-center space-y-2.5 sm:space-y-3 z-10"
        >
          {/* Eyebrow Greeting */}
          <div className="hero-reveal-eyebrow text-xs sm:text-sm tracking-[0.25em] uppercase text-ink-muted font-mono font-medium">
            HELLO, I&apos;M
          </div>

          {/* Main Hero Title */}
          <div className="space-y-0 -my-1">
            <div className="overflow-hidden">
              <h1 className="hero-title-line font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6.5rem] font-light text-ink leading-[0.9] tracking-tight">
                Gaurav
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-title-line font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6.5rem] font-light italic text-ink leading-[0.9] tracking-tight">
                Unfiltered
              </h1>
            </div>
          </div>

          {/* Name Plate with Horizontal Divider Line */}
          <div className="hero-reveal-meta flex items-center space-x-3 sm:space-x-4 pt-2">
            <span className="text-xs sm:text-sm tracking-[0.22em] uppercase text-ink font-mono font-medium whitespace-nowrap">
              GAURAV Dhamale
            </span>
            <div className="h-[1px] w-24 sm:w-36 bg-ink/35" />
          </div>

          {/* Tagline / Perspective Subheading */}
          <div className="hero-reveal-meta pt-0.5">
            <p className="font-serif italic text-lg sm:text-xl lg:text-[1.55rem] text-ink/85 tracking-wide text-pretty">
              Maharastra Seen Through My Lens
            </p>
          </div>
        </div>

        {/* Center Column: Styled Cutout Portrait with Confined Background Brushstrokes */}
        <div className="lg:col-span-4 xl:col-span-4 relative flex justify-center items-center">
          {/* Background Artistic Painterly Brushstrokes - confined strictly behind portrait */}
          <svg
            ref={brushstrokeRef}
            viewBox="0 0 450 400"
            className="hero-brushstroke absolute -left-8 sm:-left-12 -top-4 w-[115%] h-[115%] pointer-events-none -z-10 select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft broad textured chalk / paint streaks terminating before the right column */}
            <path
              d="M 30 320 C 110 250, 190 190, 340 120"
              stroke="#D4C8BA"
              strokeWidth="24"
              strokeLinecap="round"
              className="opacity-55"
            />
            <path
              d="M 60 350 C 150 280, 230 210, 360 155"
              stroke="#C9BDB0"
              strokeWidth="18"
              strokeLinecap="round"
              className="opacity-45"
            />
            <path
              d="M 40 240 C 130 180, 210 140, 330 90"
              stroke="#DDD2C6"
              strokeWidth="16"
              strokeLinecap="round"
              className="opacity-65"
            />
            <path
              d="M 80 370 C 170 310, 250 250, 350 205"
              stroke="#C0B4A6"
              strokeWidth="12"
              strokeLinecap="round"
              className="opacity-35"
            />
          </svg>

          {/* Transparent Cutout Hero Portrait Container */}
          <div
            ref={imageWrapperRef}
            className="hero-portrait-img relative w-full max-w-xs sm:max-w-sm lg:max-w-[320px] xl:max-w-[370px] aspect-[3/4.1] overflow-visible flex items-end justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src="/siteImages/gaurav_hero_cutout.png"
                alt="Gaurav Dhamale — Gaurav Unfiltered"
                fill
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 35vw"
                className="object-contain object-bottom select-none"
              />
            </div>
          </div>
        </div>

        {/* Far-Right Column: Side Badge matching reference mockup exactly (Vertical line on LEFT of text, 3 lines, dash below) */}
        <div className="hidden lg:flex lg:col-span-2 xl:col-span-2 items-center justify-start space-x-4 text-ink-muted hero-side-badge pl-4">
          {/* Vertical line on the left */}
          <div className="w-[1px] h-20 lg:h-24 bg-ink/35 shrink-0" />

          {/* Text block on right with dash below */}
          <div className="flex flex-col space-y-2.5">
            <div className="text-[9px] sm:text-[10px] tracking-[0.24em] uppercase font-mono text-ink/70 leading-[1.65] whitespace-nowrap select-none">
              <div>CAPTURING</div>
              <div>MOMENTS</div>
              <div>THAT MATTER</div>
            </div>
            <div className="w-4 h-[1px] bg-ink/35" />
          </div>
        </div>
      </div>

      {/* Bottom Hero Footer Strip */}
      <div
        ref={footerRef}
        className="flex flex-col sm:flex-row items-center justify-between border-t border-ink/15 pt-2.5 sm:pt-3 text-xs text-ink-muted tracking-widest uppercase mt-2 sm:mt-4 gap-2.5"
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
