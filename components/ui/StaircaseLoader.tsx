import React from "react";
import { Camera } from "lucide-react";

interface StaircaseLoaderProps {
  phase?: "enter" | "exit" | "static";
}

export function StaircaseLoader({ phase = "static" }: StaircaseLoaderProps) {
  const columns = [
    { bg: "bg-[#171513]", delay: "0ms" },
    { bg: "bg-[#131110]", delay: "70ms" },
    { bg: "bg-[#0e0d0c]", delay: "140ms" },
    { bg: "bg-[#131110]", delay: "210ms" },
    { bg: "bg-[#171513]", delay: "280ms" },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 min-h-screen w-full select-none overflow-hidden ${
        phase === "exit" ? "pointer-events-none" : "pointer-events-auto"
      }`}
      aria-hidden="true"
    >
      {/* 5 Vertical Staggered Cinematic Stair Columns */}
      <div className="absolute inset-0 flex w-full h-full">
        {columns.map((col, index) => (
          <div
            key={index}
            className={`h-full w-1/5 ${col.bg} border-r border-white/[0.04] shadow-2xl relative ${
              phase === "enter"
                ? "animate-stair-enter -translate-y-full"
                : phase === "exit"
                ? "animate-stair-exit translate-y-0"
                : "translate-y-0"
            }`}
            style={{
              animationDelay: col.delay,
              transform: phase === "enter" ? "translateY(-100%)" : undefined,
            }}
          />
        ))}
      </div>

      {/* Center Fixed Editorial Monogram & Lens Emblem */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-canvas z-10 px-6 text-center select-none ${
          phase === "exit" ? "animate-emblem-out" : "animate-emblem-in"
        }`}
      >
        {/* Animated Aperture Lens Ring */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="absolute w-16 h-16 rounded-full border border-bronze/40 animate-ping opacity-30" />
          <div className="w-13 h-13 rounded-full bg-white/[0.04] border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl p-3">
            <Camera className="w-6 h-6 text-bronze animate-pulse" />
          </div>
        </div>

        {/* Minimal Editorial Title */}
        <p className="font-serif text-2xl sm:text-3xl tracking-widest text-[#F4F1EB] uppercase mb-1 font-light">
          GAURAV
        </p>

        <div className="flex items-center space-x-2 text-[10px] tracking-ultra text-bronze uppercase font-mono">
          <span>MAHARASHTRA</span>
          <span className="text-white/30">&bull;</span>
          <span>CULTURE IN FOCUS</span>
        </div>

        {/* Animated Bronze Loading Bar */}
        <div className="w-28 h-[1px] bg-white/10 mt-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-bronze animate-pulse" />
        </div>
      </div>
    </div>
  );
}
