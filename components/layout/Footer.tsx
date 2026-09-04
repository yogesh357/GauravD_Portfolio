"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export function Footer() {
  const [parisTime, setParisTime] = useState<string>("");
  const [tokyoTime, setTokyoTime] = useState<string>("");

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setParisTime(
        now.toLocaleTimeString("en-GB", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setTokyoTime(
        now.toLocaleTimeString("en-GB", {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-canvas-dark text-canvas/70 border-t border-white/10 py-16 sm:py-20 px-6 sm:px-12 text-xs tracking-widest uppercase">
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        {/* Top Tier: Wordmark and World Clocks */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div className="space-y-1">
            <Link
              href="/"
              className="font-serif text-2xl text-canvas tracking-wider hover:text-bronze transition-colors"
            >
              GAURAV D.
            </Link>
            <p className="text-[10px] text-canvas/40 tracking-ultra">
              FINE ART & EDITORIAL PHOTOGRAPHY STUDIO
            </p>
          </div>

          {/* International Studio Time Clocks */}
          <div className="flex items-center space-x-8 font-mono text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-canvas/50">PARIS:</span>
              <span className="text-canvas">{parisTime || "12:00"} CET</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-canvas/50">TOKYO:</span>
              <span className="text-canvas">{tokyoTime || "20:00"} JST</span>
            </div>
          </div>
        </div>

        {/* Middle Tier: Navigation Links & Admin CMS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px]">
            <a href="#work" className="hover:text-canvas transition-colors">
              WORK
            </a>
            <a href="#about" className="hover:text-canvas transition-colors">
              ABOUT
            </a>
            <a href="#stories" className="hover:text-canvas transition-colors">
              STORIES
            </a>
            <a href="#contact" className="hover:text-canvas transition-colors">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-canvas/40 tracking-wider pt-6 border-t border-white/5 gap-2">
          <p>© {new Date().getFullYear()} GAURAV D. ALL PHOTOGRAPHS COPYRIGHTED.</p>
          <p>DESIGNED WITH EDITORIAL RESTRAINT • POWERED BY NEXT.JS & GSAP</p>
        </div>
      </div>
    </footer>
  );
}
