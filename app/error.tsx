"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#F4F1EB] flex flex-col items-center justify-center p-6 text-center">
      <span className="text-xs font-mono tracking-ultra text-bronze uppercase mb-4">
        500 &bull; SYSTEM APERTURE ERROR
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl font-light mb-4 text-[#F4F1EB]">
        Interrupted Exposure
      </h1>
      <p className="text-white/60 text-sm sm:text-base max-w-md mb-8 font-light">
        An unexpected error occurred while rendering the page view.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-bronze text-white text-xs font-mono tracking-ultra uppercase hover:bg-bronze/80 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>TRY AGAIN</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 text-white text-xs font-mono tracking-ultra uppercase hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO GALLERY</span>
        </Link>
      </div>
    </div>
  );
}
