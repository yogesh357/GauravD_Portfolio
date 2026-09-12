"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { StaircaseLoader } from "@/components/ui/StaircaseLoader";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathRef = useRef(pathname);

  // When pathname changes, trigger exit animation to reveal the new page
  useEffect(() => {
    if (currentPathRef.current !== pathname) {
      currentPathRef.current = pathname;

      if (isTransitioning) {
        setPhase("exit");
        const timer = setTimeout(() => {
          setIsTransitioning(false);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isTransitioning]);

  // Intercept internal link clicks to trigger instant staircase entrance
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Ignore external, empty, anchor hashes, modifier keys, or new-tab links
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if internal relative or same-origin URL
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin);

      if (!isInternal) return;

      // Extract target pathname
      try {
        const url = new URL(href, window.location.origin);
        // If clicking link to the exact same page, don't trigger transition
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }

        // Trigger entrance animation immediately
        setPhase("enter");
        setIsTransitioning(true);

        // Safety fallback: if navigation takes too long or is aborted, clear transition
        if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = setTimeout(() => {
          setPhase("exit");
          setTimeout(() => setIsTransitioning(false), 700);
        }, 4000);
      } catch {
        // invalid URL format, ignore
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {isTransitioning && <StaircaseLoader phase={phase} />}
      {children}
    </>
  );
}
