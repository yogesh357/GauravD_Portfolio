"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
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
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const mouseContentRef = useRef<HTMLDivElement>(null);

  const heroImage =
    featuredPhoto?.imageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop";
  const heroTitle = featuredPhoto?.title || "Between Shadows & Solitude";
  const heroSlug = featuredPhoto?.slug || "between-shadows-and-solitude";
  const heroLocation = featuredPhoto?.location || "Paris, France";
  const heroSpecs = featuredPhoto?.cameraSpecs || "Leica M11 • Noctilux 50mm f/0.95";

  // 1. GSAP Orchestrated Entrance & ScrollTrigger Transition
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const masterTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Step A: Editorial Headline Masked Line-by-Line Stagger
      masterTimeline.fromTo(
        ".hero-text-line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.09,
          ease: "power4.out",
          delay: 0.1,
        }
      );

      // Step B: Main Photograph Cinematic Entrance (Clip-path + Scale + Position Shift)
      if (imageWrapperRef.current && imageInnerRef.current) {
        masterTimeline.fromTo(
          imageWrapperRef.current,
          {
            clipPath: "inset(8% 8% 8% 8%)",
            scale: 1.12,
            opacity: 0.4,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "expo.out",
          },
          "-=0.9"
        );

        masterTimeline.fromTo(
          imageInnerRef.current,
          { scale: 1.14 },
          { scale: 1, duration: 1.6, ease: "power3.out" },
          "-=1.4"
        );
      }

      // Step C: Caption & Plate Details Reveal
      if (captionRef.current) {
        masterTimeline.fromTo(
          captionRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        );
      }

      // Step D: Scroll Indicator & Footer Cue Reveal
      if (scrollIndicatorRef.current) {
        masterTimeline.fromTo(
          scrollIndicatorRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        );
      }

      // Continuous ambient loop for scroll indicator pulse
      gsap.to(".scroll-indicator-arrow", {
        y: 6,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "power1.inOut",
      });

      // 2. GSAP ScrollTrigger Scrubbed Transition into Next Section
      if (containerRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Headline glides up and fades gently
        if (headlineRef.current) {
          scrollTl.to(
            headlineRef.current,
            { yPercent: -30, opacity: 0.15, ease: "none" },
            0
          );
        }

        // Main photo expands toward viewport edges & shifts parallax
        if (imageWrapperRef.current) {
          scrollTl.to(
            imageWrapperRef.current,
            { yPercent: -8, scale: 1.03, ease: "none" },
            0
          );
        }

        // Inner photo optical lens shift
        if (imageInnerRef.current) {
          scrollTl.to(
            imageInnerRef.current,
            { yPercent: 12, scale: 1.08, ease: "none" },
            0
          );
        }

        // Caption and scroll indicator fade out quickly on initial scroll
        if (captionRef.current) {
          scrollTl.to(captionRef.current, { opacity: 0, yPercent: -15, ease: "none" }, 0);
        }
        if (scrollIndicatorRef.current) {
          scrollTl.to(scrollIndicatorRef.current, { opacity: 0, yPercent: -20, ease: "none" }, 0);
        }
      }
    },
    { scope: containerRef }
  );

  // 3. Subtle Desktop Mouse Inertia Parallax using GSAP quickTo
  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const wrapper = imageWrapperRef.current;
    const textEl = mouseContentRef.current;
    if (!wrapper) return;

    const setImgX = gsap.quickTo(wrapper, "x", { duration: 0.8, ease: "power2.out" });
    const setImgY = gsap.quickTo(wrapper, "y", { duration: 0.8, ease: "power2.out" });

    let setTextX: gsap.QuickToFunc | null = null;
    let setTextY: gsap.QuickToFunc | null = null;
    if (textEl) {
      setTextX = gsap.quickTo(textEl, "x", { duration: 0.8, ease: "power2.out" });
      setTextY = gsap.quickTo(textEl, "y", { duration: 0.8, ease: "power2.out" });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yPercent = (e.clientY / innerHeight - 0.5) * 2;

      // Subtle image movement
      setImgX(xPercent * 12);
      setImgY(yPercent * 10);

      // Subtle opposite text drift for layered physical depth
      if (setTextX && setTextY) {
        setTextX(xPercent * -5);
        setTextY(yPercent * -4);
      }
    };

    const handleMouseLeave = () => {
      setImgX(0);
      setImgY(0);
      if (setTextX && setTextY) {
        setTextX(0);
        setTextY(0);
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
      className="relative min-h-[calc(100vh-60px)] lg:h-[calc(100vh-10px)] lg:max-h-[860px] flex flex-col justify-between pt-16 sm:pt-20 pb-3 px-6 sm:px-12 max-w-7xl mx-auto overflow-visible"
    >
      {/* 1. Monumental Split Heading & Artistic Statement */}
      <div
        ref={mouseContentRef}
        className="pt-1 pb-1 sm:pb-2 flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl"
      >
        <div ref={headlineRef} className="space-y-0">
          <div className="overflow-hidden">
            <h1 className="hero-text-line font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-light tracking-tight text-ink leading-[0.98]">
              Stories,
            </h1>
          </div>
          <div className="overflow-hidden">
            <h2 className="hero-text-line font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-light italic text-ink/90 leading-[0.98] pl-2 sm:pl-3">
              framed in light.
            </h2>
          </div>
        </div>

        <div className="overflow-hidden hidden md:block max-w-xs pb-1 text-right">
          <p className="hero-text-line text-xs tracking-wider text-ink-muted leading-relaxed font-light">
            Fine art & editorial monographs exploring light, negative space, and fleeting human presence.
          </p>
        </div>
      </div>

      {/* 2. Centerpiece Photographic Master Canvas */}
      <div className="relative w-full my-1 flex-1 flex flex-col justify-center">
        <div
          ref={imageWrapperRef}
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          className="relative w-full h-[28vh] sm:h-[34vh] md:h-[38vh] lg:h-[40vh] max-h-[380px] min-h-[220px] overflow-hidden bg-canvas-muted shadow-2xl group cursor-pointer"
        >
          <div ref={imageInnerRef} className="relative w-full h-full">
            <Image
              src={heroImage}
              alt={heroTitle}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-[center_35%] transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          </div>

          {/* Luxury Soft Film Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />
        </div>

        {/* 3. Editorial Caption & Essay Link */}
        <div
          ref={captionRef}
          className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between text-xs text-ink-muted tracking-widest uppercase gap-2 font-mono"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-serif text-sm text-ink font-light italic normal-case">
              {heroTitle}
            </span>
            <span className="text-bronze">•</span>
            <span className="text-[11px] font-sans">{heroLocation}</span>
            <span className="text-bronze hidden sm:inline">•</span>
            <span className="text-[10px] text-ink-muted hidden md:inline truncate max-w-xs font-mono">
              {heroSpecs}
            </span>
          </div>

          <Link
            href={`/work/${heroSlug}`}
            className="group/link inline-flex items-center space-x-1.5 text-[11px] tracking-ultra text-ink hover:text-bronze transition-colors self-start sm:self-auto font-sans uppercase underline underline-offset-4"
          >
            <span>VIEW MONOGRAPH ESSAY</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* 4. Minimalist Animated Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="flex items-center justify-between border-t border-ink/10 pt-3 sm:pt-4 text-xs text-ink-muted tracking-widest uppercase mt-1 sm:mt-2"
      >
        <div className="flex items-center space-x-4 text-[11px] font-sans">
          <span>PARIS ATELIER</span>
          <span className="text-bronze">•</span>
          <span>TOKYO STUDIO</span>
        </div>

        <div
          onClick={() => {
            const el = document.getElementById("about");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center space-x-2.5 text-ink hover:text-bronze transition-colors cursor-pointer group select-none"
        >
          <span className="text-[10px] tracking-ultra font-sans">SCROLL TO EXPLORE</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-ink/20 flex items-center justify-center group-hover:border-bronze transition-colors">
            <ArrowDown className="scroll-indicator-arrow w-3 h-3 text-ink group-hover:text-bronze" />
          </div>
        </div>
      </div>
    </section>
  );
}
