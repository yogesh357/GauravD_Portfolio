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

  // Handle Category Filtering with Smooth GSAP Stagger Transition
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === activeCategory || isTransitioning) return;
    setIsTransitioning(true);

    const items = masonryContainerRef.current?.querySelectorAll(".masonry-item");
    if (items && items.length > 0) {
      gsap.to(items, {
        opacity: 0,
        y: 20,
        scale: 0.98,
        stagger: 0.02,
        duration: 0.25,
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

  // K72-inspired Masonry ScrollTriggers & Parallax
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const container = masonryContainerRef.current;
      if (!container) return;

      const items = container.querySelectorAll<HTMLElement>(".masonry-item");

      // 1. Header Reveal
      gsap.fromTo(
        ".portfolio-header-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Individual Masonry Items Reveal & Inner Parallax
      items.forEach((item, index) => {
        // Art-directed rhythmic vertical offsets based on column distribution (K72 style)
        const colOffset = index % 3 === 0 ? 80 : index % 3 === 1 ? 120 : 60;
        const innerImg = item.querySelector<HTMLElement>(".masonry-inner-img");
        const imgWrapper = item.querySelector<HTMLElement>(".masonry-img-wrapper");

        // Entrance animation on scroll
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: colOffset,
            scale: 0.96,
            clipPath: "inset(8% 0% 8% 0%)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );

        // Subtle living photo parallax scrub on the inner image
        if (innerImg && imgWrapper) {
          gsap.fromTo(
            innerImg,
            { yPercent: -5, scale: 1.08 },
            {
              yPercent: 5,
              scale: 1.04,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
        }
      });

      // Refresh triggers after dynamic layout calculations
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div>
          <div className="portfolio-header-reveal flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted mb-2">
            <span className="text-bronze">•</span>
            <span>{isHomepagePreview ? "SELECTED WORKS" : "COMPLETE ARCHIVE"}</span>
          </div>
          <h2 className="portfolio-header-reveal font-serif text-3xl sm:text-5xl font-light text-ink">
            {isHomepagePreview ? "Curated Portfolio" : "Photographic Archive"}
          </h2>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="portfolio-header-reveal flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-ink text-canvas font-medium shadow-sm"
                : "border border-ink/15 text-ink hover:border-ink"
            }`}
          >
            ALL
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-ink text-canvas font-medium shadow-sm"
                  : "border border-ink/15 text-ink hover:border-ink"
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
        className="columns-1 sm:columns-2 lg:columns-3 gap-5 sm:gap-6 [column-fill:_balance]"
      >
        {displayedPhotos.map((photo) => {
          // Determine natural responsive aspect ratio styling
          const isLandscape = photo.aspectRatio === "16/10" || photo.aspectRatio === "16/9";
          const isSquare = photo.aspectRatio === "1/1";
          const aspectClass = isLandscape
            ? "aspect-[16/10]"
            : isSquare
            ? "aspect-square"
            : "aspect-[4/5]";

          return (
            <article
              key={photo.id}
              className="masonry-item break-inside-avoid mb-6 sm:mb-8 w-full inline-block group"
            >
              <Link
                href={`/work/${photo.slug}`}
                className="block relative overflow-hidden bg-canvas-muted shadow-sm rounded-[1px]"
              >
                <div className={`masonry-img-wrapper relative w-full overflow-hidden ${aspectClass}`}>
                  <div className="masonry-inner-img relative w-full h-full">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.imageAlt || photo.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Subtle hover vignette & overlay */}
                  <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Discrete floating category badge on hover */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 editorial-glass text-[9px] tracking-ultra uppercase text-canvas opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>{photo.category?.name || "MONOGRAPH"}</span>
                  </div>
                </div>
              </Link>

              {/* Photo Metadata Band */}
              <div className="pt-2.5 flex flex-col space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-sans tracking-ultra uppercase text-bronze">
                  <span>{photo.category?.name || "PORTFOLIO"}</span>
                  <span>{photo.shotAt || photo.location || "2025"}</span>
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <h3 className="font-serif text-lg sm:text-xl font-light text-ink group-hover:text-bronze transition-colors">
                    <Link href={`/work/${photo.slug}`}>{photo.title}</Link>
                  </h3>
                  <Link
                    href={`/work/${photo.slug}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-ink hover:text-bronze pl-2"
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
        <div className="mt-8 sm:mt-10 flex flex-col items-center text-center space-y-3 pt-6 border-t border-ink/10">
          <p className="text-xs text-ink-muted tracking-widest uppercase">
            EXPLORE THE COMPLETE CATALOG OF FINE ART AND COMMISSIONED MONOGRAPHS
          </p>
          <Link
            href="/work"
            className="group inline-flex items-center space-x-3 px-7 py-3.5 bg-ink text-canvas text-xs font-medium tracking-ultra uppercase hover:bg-bronze transition-all duration-300 shadow-md"
          >
            <span>VIEW ALL WORKS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  );
}
