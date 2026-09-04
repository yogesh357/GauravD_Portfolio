"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface EditorialRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "clip-bottom" | "clip-left" | "fade";
  duration?: number;
}

export function EditorialReveal({
  children,
  className = "",
  delay = 0,
  direction = "clip-bottom",
  duration = 1.1,
}: EditorialRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1, clipPath: "none", transform: "none" });
        return;
      }

      if (direction === "clip-bottom") {
        gsap.fromTo(
          el,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            opacity: 0.7,
            y: 30,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            y: 0,
            duration: duration,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      } else if (direction === "clip-left") {
        gsap.fromTo(
          el,
          {
            clipPath: "inset(0% 100% 0% 0%)",
            opacity: 0.8,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      } else if (direction === "up") {
        gsap.fromTo(
          el,
          {
            y: 45,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: duration,
            delay: delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
