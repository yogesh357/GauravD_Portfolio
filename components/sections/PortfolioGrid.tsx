"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? initialPhotos
      : initialPhotos.filter((p) => p.category?.slug === activeCategory || p.categoryId === activeCategory);

  const displayedPhotos = isHomepagePreview ? filteredPhotos.slice(0, 6) : filteredPhotos;

  // GSAP animation when activeCategory changes
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".gallery-item",
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: "power2.out" }
      );
    },
    [activeCategory]
  );

  return (
    <section id="portfolio" className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto border-t border-ink/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <div className="flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted mb-3">
            <span className="text-bronze">•</span>
            <span>{isHomepagePreview ? "SELECTED WORKS" : "COMPLETE ARCHIVE"}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-ink">
            {isHomepagePreview ? "Curated Portfolio" : "Photographic Archive"}
          </h2>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-ink text-canvas font-medium"
                : "border border-ink/15 text-ink hover:border-ink"
            }`}
          >
            ALL ({initialPhotos.length})
          </button>

          {categories.map((cat) => {
            const count = initialPhotos.filter(
              (p) => p.category?.slug === cat.slug || p.categoryId === cat.id
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat.slug
                    ? "bg-ink text-canvas font-medium"
                    : "border border-ink/15 text-ink hover:border-ink"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        {displayedPhotos.map((photo) => (
          <article
            key={photo.id}
            className="gallery-item group flex flex-col justify-between"
          >
            <Link
              href={`/work/${photo.slug}`}
              className="block relative overflow-hidden bg-canvas-muted shadow-sm"
            >
              <div
                className={`relative w-full overflow-hidden ${
                  photo.aspectRatio === "16/10" ? "aspect-[16/10]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            {/* Photo Card Metadata */}
            <div className="pt-4 flex flex-col space-y-1">
              <div className="flex items-center justify-between text-[11px] font-sans tracking-ultra uppercase text-bronze">
                <span>{photo.category?.name || "PORTFOLIO"}</span>
                <span>{photo.shotAt || photo.location || "2025"}</span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <h3 className="font-serif text-xl font-light text-ink group-hover:text-bronze transition-colors">
                  <Link href={`/work/${photo.slug}`}>{photo.title}</Link>
                </h3>
                <Link
                  href={`/work/${photo.slug}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-ink hover:text-bronze"
                  aria-label={`View ${photo.title}`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {photo.cameraSpecs && (
                <p className="text-[10px] text-ink-muted tracking-widest font-mono uppercase truncate pt-0.5">
                  {photo.cameraSpecs.split("•")[0]}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {displayedPhotos.length === 0 && (
        <div className="py-20 text-center text-ink-muted">
          <p className="font-serif text-xl">No photographs published in this category yet.</p>
        </div>
      )}

      {/* View More Works Button (Homepage Preview Mode) */}
      {isHomepagePreview && initialPhotos.length > 6 && (
        <div className="mt-16 sm:mt-20 flex flex-col items-center text-center space-y-4 pt-12 border-t border-ink/10">
          <p className="text-xs text-ink-muted tracking-widest uppercase">
            EXPLORE THE COMPLETE CATALOG OF FINE ART AND COMMISSIONED MONOGRAPHS
          </p>
          <Link
            href="/work"
            className="group inline-flex items-center space-x-3 px-8 py-4 bg-ink text-canvas text-xs font-medium tracking-ultra uppercase hover:bg-bronze transition-all duration-300 shadow-md"
          >
            <span>VIEW ALL WORKS ({initialPhotos.length} PHOTOGRAPHS)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  );
}
