"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar({
  siteName = "Gaurav Damahe",
  instagram = "https://www.instagram.com/gaurav_unfiltered_",
  email = "gauravxd153@gmail.com",
  location = "Pune / Mumbai",
}: {
  siteName?: string;
  instagram?: string;
  email?: string;
  location?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation for mobile menu open/close
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      if (!mobileMenuRef.current) return;

      if (mobileMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.6,
          ease: "power3.inOut",
        });
        gsap.fromTo(
          ".mobile-nav-item",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.2, ease: "power2.out" }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
        });
      }
    },
    [mobileMenuOpen]
  );

  const navLinks = [
    { label: "WORK", href: "/work", isRoute: true },
    { label: "ABOUT", href: "/#about", isRoute: false },
    { label: "STORIES", href: "/#stories", isRoute: false },
    { label: "CONTACT", href: "/#contact", isRoute: false },
  ];

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${isScrolled
          ? "py-3 px-4 sm:px-8"
          : "py-6 sm:py-8 px-6 sm:px-12"
          }`}
      >
        <div
          className={`mx-auto max-w-7xl flex items-center justify-between transition-all duration-500 ${isScrolled
            ? "editorial-glass border border-ink/10 rounded-full px-6 py-3 shadow-sm"
            : "bg-transparent"
            }`}
        >
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="group flex items-center space-x-2 text-ink transition-opacity hover:opacity-80 font-mono"
          >
            <span className="font-serif text-xl sm:text-2xl font-light tracking-wider">
              {siteName}
            </span>
            <span className="text-[10px] tracking-widest text-ink-muted uppercase border-l border-ink/20 pl-2 hidden sm:inline-block">
              PHOTOGRAPHER
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase font-sans">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group relative text-ink hover:text-bronze transition-colors duration-300 py-1"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-bronze transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="group relative text-ink hover:text-bronze transition-colors duration-300 py-1"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-bronze transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center space-x-6">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-ink-muted hover:text-ink tracking-widest uppercase transition-colors font-mono"
            >
              INSTAGRAM
            </a>
            <Link
              href="/work"
              className="group inline-flex items-center space-x-1.5 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full border border-ink/20 hover:border-ink hover:bg-ink hover:text-canvas transition-all duration-300 font-mono"
            >
              <span>EXPLORE</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-ink p-2 hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Editorial Menu */}
      <div
        ref={mobileMenuRef}
        style={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
        className="fixed inset-0 z-30 bg-canvas-dark text-canvas flex flex-col justify-between p-8 sm:p-12 md:hidden"
      >
        <div className="pt-20">
          <p className="text-[11px] tracking-ultra text-bronze uppercase mb-8">
            NAVIGATION
          </p>
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item flex items-baseline justify-between border-b border-white/10 pb-4 text-2xl font-serif tracking-wide hover:text-bronze transition-colors"
                >
                  <span>{link.label}</span>
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item flex items-baseline justify-between border-b border-white/10 pb-4 text-2xl font-serif tracking-wide hover:text-bronze transition-colors"
                >
                  <span>{link.label}</span>
                </a>
              )
            )}
          </nav>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col space-y-3 text-xs tracking-widest uppercase text-white/60">
          <div className="flex justify-between items-center">
            <span>{location.toUpperCase()}</span>
            <a
              href={`mailto:${email}`}
              className="text-bronze hover:underline lowercase"
            >
              {email}
            </a>
          </div>
          <p className="text-[10px] text-white/40">
            © {new Date().getFullYear()} {siteName.toUpperCase()} ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </>
  );
}
