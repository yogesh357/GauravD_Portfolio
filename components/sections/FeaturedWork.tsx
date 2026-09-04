"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Photo, Category } from "@/lib/db/schema";

interface FeaturedWorkProps {
  photos: (Photo & { category?: Category | null })[];
}

export function FeaturedWork({ photos }: FeaturedWorkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Take top 3 featured photos or fallbacks
  const displayPhotos = photos.slice(0, 3);
  const photo1 = displayPhotos[0];
  const photo2 = displayPhotos[1];
  const photo3 = displayPhotos[2];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".featured-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="work"
      ref={containerRef}
      className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-ink/10 gap-6">
        <div>
          <div className="flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted mb-2">
            <span className="text-bronze">02</span>
            <span>/</span>
            <span>CURATED PORTFOLIO</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-ink">
            Featured Works
          </h2>
        </div>
        <p className="text-xs text-ink-muted tracking-widest uppercase max-w-xs text-left sm:text-right">
          A selection of recent visual essays and fine-art monographs.
        </p>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Left Tall Column (Large Hero Feature) */}
        {photo1 && (
          <div className="featured-card lg:col-span-7 flex flex-col group">
            <Link href={`/work/${photo1.slug}`} className="block relative overflow-hidden bg-canvas-muted">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={photo1.imageUrl}
                  alt={photo1.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>

            {/* Metadata Footer */}
            <div className="mt-5 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-sans tracking-ultra uppercase text-bronze">
                  {photo1.category?.name || "PORTRAITS"} • {photo1.location || "PARIS"}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-ink mt-1 group-hover:text-bronze transition-colors">
                  <Link href={`/work/${photo1.slug}`}>{photo1.title}</Link>
                </h3>
              </div>
              <Link
                href={`/work/${photo1.slug}`}
                className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-canvas transition-all"
                aria-label={`View ${photo1.title}`}
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Right Offset Column (Two Staggered Works) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-12 lg:space-y-16">
          {/* Top Wide Card */}
          {photo2 && (
            <div className="featured-card flex flex-col group">
              <Link href={`/work/${photo2.slug}`} className="block relative overflow-hidden bg-canvas-muted">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={photo2.imageUrl}
                    alt={photo2.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-sans tracking-ultra uppercase text-bronze">
                    {photo2.category?.name || "ARCHITECTURE"} • {photo2.location || "COPENHAGEN"}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-ink mt-1 group-hover:text-bronze transition-colors">
                    <Link href={`/work/${photo2.slug}`}>{photo2.title}</Link>
                  </h3>
                </div>
                <Link
                  href={`/work/${photo2.slug}`}
                  className="w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-canvas transition-all"
                  aria-label={`View ${photo2.title}`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Card */}
          {photo3 && (
            <div className="featured-card flex flex-col group pt-4">
              <Link href={`/work/${photo3.slug}`} className="block relative overflow-hidden bg-canvas-muted">
                <div className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={photo3.imageUrl}
                    alt={photo3.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-sans tracking-ultra uppercase text-bronze">
                    {photo3.category?.name || "LANDSCAPES"} • {photo3.location || "ICELAND"}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-ink mt-1 group-hover:text-bronze transition-colors">
                    <Link href={`/work/${photo3.slug}`}>{photo3.title}</Link>
                  </h3>
                </div>
                <Link
                  href={`/work/${photo3.slug}`}
                  className="w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-canvas transition-all"
                  aria-label={`View ${photo3.title}`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
