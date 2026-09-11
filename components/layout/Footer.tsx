"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [indiaTime, setIndiaTime] = useState<string>("");
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setIndiaTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".footer-reveal",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: footerRef }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="bg-canvas-dark text-canvas/70 border-t border-white/10 py-10 sm:py-12 px-6 sm:px-12 text-xs tracking-widest uppercase"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        {/* Top Tier: Wordmark and World Clocks */}
        <div className="footer-reveal flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link
              href="/"
              className="font-serif text-2xl text-canvas tracking-wider hover:text-bronze transition-colors"
            >
              GAURAV
            </Link>
            <p className="text-[10px] text-canvas/40 tracking-ultra">
              FINE ART & EDITORIAL PHOTOGRAPHY STUDIO
            </p>
          </div>

          {/* Studio Time Clock */}
          <div className="flex items-center space-x-6 font-mono text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-canvas/50">PUNE / MUMBAI:</span>
              <span className="text-canvas">{indiaTime || "12:00"} IST</span>
            </div>
          </div>
        </div>

        {/* Middle Tier: Navigation Links & Admin CMS */}
        <div className="footer-reveal flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px]">
            <Link href="/work" className="hover:text-canvas transition-colors">
              WORK
            </Link>
            <a href="/#about" className="hover:text-canvas transition-colors">
              ABOUT
            </a>
            <a href="/#stories" className="hover:text-canvas transition-colors">
              STORIES
            </a>
            <a href="/#contact" className="hover:text-canvas transition-colors">
              CONTACT
            </a>
            <Link
              href="/admin"
              className="text-bronze hover:text-canvas transition-colors border-b border-bronze/40 pb-0.5"
            >
              STUDIO CMS / ADMIN
            </Link>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 text-[11px] text-canvas hover:text-bronze transition-colors"
            aria-label="Back to Top"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Bottom Tier: Copyright & Colophon */}
        <div className="footer-reveal flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-canvas/40 tracking-wider pt-4 border-t border-white/5 gap-2 font-mono">
          <p>© {new Date().getFullYear()} GAURAV. ALL PHOTOGRAPHS COPYRIGHTED.</p>
          <div className="flex flex-wrap items-center gap-x-2 text-canvas/40">
            <span>DESIGNED &amp; DEVELOPED BY</span>
            <span className="text-canvas/80 font-medium tracking-widest">YOGESH</span>
            <span className="text-canvas/30">•</span>
            <a
              href="tel:9763449839"
              className="text-bronze hover:text-canvas transition-colors font-mono font-medium"
            >
              +91 9763449839
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
