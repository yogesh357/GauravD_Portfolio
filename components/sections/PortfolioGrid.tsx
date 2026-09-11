"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Photo, Category } from "@/lib/db/schema";

interface PortfolioGridProps {
  initialPhotos: (Photo & { category?: Category | null })[];
  categories: Category[];
  isHomepagePreview?: boolean;
}

export function PortfolioGrid({
  initialPhotos,
  categories,
  isHomepagePreview = false,
}: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const masonryContainerRef = useRef<HTMLDivElement>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? initialPhotos
      : initialPhotos.filter(
        (p) => p.category?.slug === activeCategory || p.categoryId === activeCategory
      );

  const displayedPhotos = isHomepagePreview ? filteredPhotos.slice(0, 6) : filteredPhotos;

  // Smooth Category Switching with GSAP Stagger Transition
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === activeCategory || isTransitioning) return;
    setIsTransitioning(true);

    const items = masonryContainerRef.current?.querySelectorAll(".masonry-item");
    if (items && items.length > 0) {
      gsap.to(items, {
        opacity: 0,
        y: 20,
        scale: 0.94,
        stagger: 0.02,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          setActiveCategory(newCategory);
          setIsTransitioning(false);
        },
      });
    } else {
      setActiveCategory(newCategory);
      setIsTransitioning(false);
    }
  };

  // GSAP Choreographed ScrollTriggers: Header Reveal, Card Entry Stagger, Dynamic Scaling & Multi-Column Optical Parallax Scrub
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const container = masonryContainerRef.current;
      const section = sectionRef.current;
      if (!container || !section) return;

      if (prefersReducedMotion) {
        gsap.set(".portfolio-heading-line, .portfolio-meta-reveal, .masonry-item, .parallax-img", {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }

      // 1. Choreographed Section Header Reveal Timeline
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power4.out" },
      });

      headerTl
        .fromTo(
          ".portfolio-heading-line",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "power4.out" },
          0
        )
        .fromTo(
          ".portfolio-meta-reveal",
          { y: 25, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.04, ease: "power3.out" },
          0.15
        );

      // 2. Responsive ScrollTriggers for Masonry Cards Entrance, Dynamic Scaling & Column Parallax
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile } = context.conditions as {
            isDesktop: boolean;
            isTablet: boolean;
            isMobile: boolean;
          };

          const items = container.querySelectorAll<HTMLElement>(".masonry-item");
          const cleanups: (() => void)[] = [];

          items.forEach((item, index) => {
            const wrapper = item.querySelector<HTMLElement>(".image-wrapper");
            const img = item.querySelector<HTMLElement>(".parallax-img");
            const badge = item.querySelector<HTMLElement>(".category-badge");
            const arrow = item.querySelector<HTMLElement>(".arrow-icon");
            const colIndex = isDesktop ? index % 3 : isTablet ? index % 2 : 0;

            // A. Card Entrance Animation as it scrolls into view (Clip-path + Y-shift + Scale)
            const colOffset = isDesktop ? (colIndex === 0 ? 45 : colIndex === 1 ? 80 : 60) : 35;
            const duration = isDesktop ? (colIndex === 0 ? 1.0 : colIndex === 1 ? 1.25 : 1.1) : 0.9;

            gsap.fromTo(
              item,
              {
                opacity: 0,
                y: colOffset,
                scale: 0.92,
                clipPath: "inset(8% 0% 8% 0%)",
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: duration,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 92%",
                  toggleActions: "play none none none",
                  once: true,
                },
              }
            );

            // B. Continuous Dynamic Scaling Scrub on the Card as it travels through Viewport
            gsap.fromTo(
              item,
              {
                scale: 0.95,
              },
              {
                scale: 1,
                ease: "power1.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 95%",
                  end: "top 45%",
                  scrub: 1.2,
                },
              }
            );

            // C. Continuous Optical Image Parallax & Lens Scaling Scrub
            if (wrapper && img) {
              const parallaxRange = isDesktop ? 10 : isTablet ? 7 : 4;
              const startScale = isDesktop ? 1.22 : isTablet ? 1.15 : 1.08;
              const endScale = isDesktop ? 1.04 : 1.02;

              gsap.fromTo(
                img,
                {
                  yPercent: -parallaxRange,
                  scale: startScale,
                },
                {
                  yPercent: parallaxRange,
                  scale: endScale,
                  ease: "none",
                  scrollTrigger: {
                    trigger: wrapper,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: isMobile ? 0.3 : 1.2,
                  },
                }
              );

              // D. Multi-column Asynchronous Parallax Glide
              if (isDesktop && colIndex === 1) {
                // Middle column floats slightly deeper on scroll for physical depth
                gsap.fromTo(
                  wrapper,
                  { y: 25 },
                  {
                    y: -25,
                    ease: "none",
                    scrollTrigger: {
                      trigger: wrapper,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 1.5,
                    },
                  }
                );
              }
            }

            // E. Interactive GSAP Hover Dynamics
            const handleMouseEnter = () => {
              if (img) {
                gsap.to(img, {
                  scale: isDesktop ? 1.12 : 1.06,
                  duration: 0.65,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
              if (badge) {
                gsap.to(badge, {
                  opacity: 1,
                  y: 0,
                  duration: 0.35,
                  ease: "power2.out",
                });
              }
              if (arrow) {
                gsap.to(arrow, {
                  x: 3,
                  y: -3,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }
            };

            const handleMouseLeave = () => {
              if (img) {
                gsap.to(img, {
                  scale: 1.04,
                  duration: 0.55,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }
              if (badge) {
                gsap.to(badge, {
                  opacity: 0,
                  y: 6,
                  duration: 0.3,
                  ease: "power2.in",
                });
              }
              if (arrow) {
                gsap.to(arrow, {
                  x: 0,
                  y: 0,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }
            };

            item.addEventListener("mouseenter", handleMouseEnter);
            item.addEventListener("mouseleave", handleMouseLeave);
            cleanups.push(() => {
              item.removeEventListener("mouseenter", handleMouseEnter);
              item.removeEventListener("mouseleave", handleMouseLeave);
            });
          });

          return () => {
            cleanups.forEach((fn) => fn());
          };
        }
      );

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);

      return () => {
        clearTimeout(timer);
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [activeCategory, displayedPhotos.length] }
  );

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-10 sm:py-14 px-6 sm:px-12 max-w-7xl mx-auto border-t border-ink/10"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <div className="portfolio-meta-reveal flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted mb-2">
            <span className="text-bronze">•</span>
            <span>{isHomepagePreview ? "SELECTED WORKS" : "COMPLETE ARCHIVE"}</span>
          </div>
          <div className="overflow-hidden">
            <h2 className="portfolio-heading-line font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ink">
              {isHomepagePreview ? "Curated Portfolio" : "Photographic Archive"}
            </h2>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="portfolio-meta-reveal flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 ${activeCategory === "all"
                ? "bg-ink text-canvas font-medium shadow-sm"
                : "border border-ink/15 text-ink hover:border-ink hover:bg-ink/5"
              }`}
          >
            ALL
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.slug
                  ? "bg-ink text-canvas font-medium shadow-sm"
                  : "border border-ink/15 text-ink hover:border-ink hover:bg-ink/5"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pinterest-style Multi-column Masonry Gallery */}
      <div
        ref={masonryContainerRef}
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]"
      >
        {displayedPhotos.map((photo, index) => {
          // Preserve natural aspect ratios
          const isLandscape = photo.aspectRatio === "16/10" || photo.aspectRatio === "16/9";
          const isSquare = photo.aspectRatio === "1/1";
          const isTall = photo.aspectRatio === "2/3" || photo.aspectRatio === "9/16";
          const aspectClass = isLandscape
            ? "aspect-[16/10]"
            : isSquare
              ? "aspect-square"
              : isTall
                ? "aspect-[2/3]"
                : "aspect-[4/5]";

          return (
            <article
              key={photo.id}
              className="masonry-item break-inside-avoid mb-6 sm:mb-8 w-full inline-block group will-change-transform"
              data-col={index % 3}
            >
              <Link
                href={`/work/${photo.slug}`}
                className="block relative overflow-hidden bg-canvas-muted shadow-sm hover:shadow-md transition-shadow duration-500 rounded-[1px]"
              >
                {/* Fixed Image View: Overflow hidden wrapper */}
                <div
                  className={`image-wrapper relative w-full overflow-hidden bg-canvas-muted ${aspectClass}`}
                  style={{ clipPath: "inset(0% 0% 0% 0%)" }}
                >
                  {/* Inner Image: Optical scaling and living parallax scrub */}
                  <div className="parallax-img relative w-full h-full will-change-transform">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.imageAlt || photo.title}
                      fill
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Subtle hover vignette & overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Discrete floating category badge on hover */}
                  <div className="category-badge absolute bottom-3 left-3 px-2.5 py-1 editorial-glass text-[9px] tracking-ultra uppercase text-canvas opacity-0 translate-y-1 transition-none pointer-events-none">
                    <span>{photo.category?.name || "MONOGRAPH"}</span>
                  </div>
                </div>
              </Link>

              {/* Photo Metadata Band */}
              <div className="pt-3 flex flex-col space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-sans tracking-ultra uppercase text-bronze">
                  <span>{photo.category?.name || "PORTFOLIO"}</span>
                  <span>{photo.shotAt || photo.location || "2025"}</span>
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <h3 className="font-serif text-lg sm:text-xl font-light text-ink group-hover:text-bronze transition-colors">
                    <Link href={`/work/${photo.slug}`}>
                      {photo.title}
                    </Link>
                  </h3>
                  <Link
                    href={`/work/${photo.slug}`}
                    className="arrow-icon opacity-70 group-hover:opacity-100 transition-opacity text-ink hover:text-bronze pl-2 inline-block will-change-transform"
                    aria-label={`View photograph essay for ${photo.title}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {photo.cameraSpecs && (
                  <p className="text-[10px] text-ink-muted tracking-widest font-mono uppercase truncate pt-0.5">
                    {photo.cameraSpecs.split("•")[0]}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {displayedPhotos.length === 0 && (
        <div className="py-16 text-center text-ink-muted">
          <p className="font-serif text-xl">No photographs published in this category yet.</p>
        </div>
      )}

      {/* View More Works Button (Homepage Preview Mode) */}
      {isHomepagePreview && initialPhotos.length > 6 && (
        <div className="mt-10 sm:mt-12 flex flex-col items-center text-center space-y-3 pt-6 border-t border-ink/10">
          <p className="text-xs text-ink-muted tracking-widest uppercase">
            EXPLORE THE COMPLETE CATALOG OF FINE ART AND COMMISSIONED MONOGRAPHS
          </p>
          <Link
            href="/work"
            className="group inline-flex items-center space-x-3 px-7 py-3.5 bg-ink text-canvas text-xs font-medium tracking-ultra uppercase hover:bg-bronze transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span>VIEW ALL WORKS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
