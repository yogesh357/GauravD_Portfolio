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
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? initialPhotos
      : initialPhotos.filter(
        (p) => p.category?.slug === activeCategory || p.categoryId === activeCategory
      );

  const displayedPhotos = isHomepagePreview ? filteredPhotos.slice(0, 6) : filteredPhotos;

  // Handle Category Filtering with Smooth GSAP Stagger Transition & Trigger Cleanup
  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === activeCategory || isTransitioning) return;
    setIsTransitioning(true);

    const items = gridContainerRef.current?.querySelectorAll(".project-card-wrapper");
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

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const container = gridContainerRef.current;
      const section = sectionRef.current;
      if (!container || !section) return;

      if (prefersReducedMotion) {
        gsap.set(".portfolio-heading-line, .portfolio-meta-reveal, .project-card-wrapper, .project-expand-card", {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }

      // 1. Initial Choreographed Page Load / Section Entrance Timeline
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power4.out" },
      });

      // Heading Reveal with overflow-hidden mask
      masterTimeline.fromTo(
        ".portfolio-heading-line",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: "power4.out",
        },
        0
      );

      // Metadata & Category filter pills reveal
      masterTimeline.fromTo(
        ".portfolio-meta-reveal",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "power3.out",
        },
        0.15
      );

      // Initial visible projects choreographed entrance (First 2 items)
      const allCardWrappers = container.querySelectorAll<HTMLElement>(".project-card-wrapper");
      const initialCards = Array.from(allCardWrappers).slice(0, 2);

      if (initialCards.length > 0) {
        masterTimeline.fromTo(
          initialCards,
          {
            opacity: 0,
            scale: 0.6,
            y: 40,
            clipPath: "inset(8% 0% 8% 0%)",
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            stagger: 0.12,
            ease: "expo.out",
          },
          0.3
        );
      }

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

          const cardWrappers = container.querySelectorAll<HTMLElement>(".project-card-wrapper");

          cardWrappers.forEach((wrapper, index) => {
            const expandCard = wrapper.querySelector<HTMLElement>(".project-expand-card");
            const innerImg = wrapper.querySelector<HTMLElement>(".project-inner-img");

            if (index >= (isDesktop ? 2 : 1)) {
              gsap.fromTo(
                wrapper,
                {
                  opacity: 0,
                  y: isDesktop ? 60 : 35,
                  scale: 1.05,
                  clipPath: "inset(10% 0% 10% 0%)",
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 1.0,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: wrapper,
                    start: "top 92%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                }
              );
            }

            if (expandCard) {
              const startHeight = isDesktop ? 360 : isTablet ? 300 : 240;
              const targetHeight = isDesktop ? 600 : isTablet ? 480 : 380;

              gsap.fromTo(
                expandCard,
                { height: `${startHeight}px` },
                {
                  height: `${targetHeight}px`,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: wrapper,
                    start: "top 85%",
                    end: "top 10%",
                    scrub: isMobile ? 0.4 : 1,
                  },
                }
              );
            }

            // Independent Living Optical Parallax Scrub on Inner Image
            if (innerImg) {
              const parallaxRange = isDesktop ? 8 : isTablet ? 6 : 4;

              gsap.fromTo(
                innerImg,
                {
                  yPercent: -parallaxRange,
                  scale: isMobile ? 1.06 : 1.14,
                },
                {
                  yPercent: parallaxRange,
                  scale: 1.0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: wrapper,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: isMobile ? 0.4 : true,
                  },
                }
              );
            }
          });
        }
      );

      // Refresh triggers after dynamic layout recalculations
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

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
              : "border border-ink/15 text-ink hover:border-ink"
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
                : "border border-ink/15 text-ink hover:border-ink"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* K72-Style Dynamic Expanding Projects Grid */}
      <div
        ref={gridContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12"
      >
        {displayedPhotos.map((photo, index) => {
          // Asymmetric rhythmic stagger for alternate columns on desktop (K72 aesthetic)
          const isRightCol = index % 2 === 1;

          return (
            <article
              key={photo.id}
              className={`project-card-wrapper w-full flex flex-col group will-change-transform ${isRightCol ? "md:mt-12 lg:mt-16" : ""
                }`}
            >
              <Link
                href={`/work/${photo.slug}`}
                className="block relative overflow-hidden bg-canvas-muted shadow-sm rounded-[1px]"
              >
                {/* Expanding Card Container: Height is smoothly expanded by GSAP on scroll */}
                <div
                  className="project-expand-card relative w-full h-[240px] sm:h-[300px] lg:h-[360px] overflow-hidden bg-canvas-muted"
                  style={{ clipPath: "inset(0% 0% 0% 0%)" }}
                >
                  {/* Inner image container: Optical living parallax scrub */}
                  <div className="project-inner-img relative w-full h-full will-change-transform">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.imageAlt || photo.title}
                      fill
                      priority={index < 2}
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
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
              <div className="pt-3 flex flex-col space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-sans tracking-ultra uppercase text-bronze">
                  <span>{photo.category?.name || "PORTFOLIO"}</span>
                  <span>{photo.shotAt || photo.location || "2025"}</span>
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-light text-ink group-hover:text-bronze transition-colors">
                    <Link href={`/work/${photo.slug}`}>{photo.title}</Link>
                  </h3>
                  <Link
                    href={`/work/${photo.slug}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-ink hover:text-bronze pl-2"
                    aria-label={`View photograph essay for ${photo.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
        <div className="mt-12 sm:mt-16 flex flex-col items-center text-center space-y-3 pt-8 border-t border-ink/10">
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
