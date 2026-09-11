import React from "react";
import { Camera } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full select-none overflow-hidden bg-[#0e0d0c]">
      {/* 5 Vertical Dark Cinematic Stair Columns */}
      <div className="absolute inset-0 flex w-full h-full">
        <div className="h-full w-1/5 bg-[#141210] border-r border-white/[0.04] shadow-2xl" />
        <div className="h-full w-1/5 bg-[#11100f] border-r border-white/[0.04] shadow-2xl" />
        <div className="h-full w-1/5 bg-[#0e0d0c] border-r border-white/[0.04] shadow-2xl" />
        <div className="h-full w-1/5 bg-[#11100f] border-r border-white/[0.04] shadow-2xl" />
        <div className="h-full w-1/5 bg-[#141210] shadow-2xl" />
      </div>

      {/* Center Fixed Minimal Editorial Monogram & Emblem */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-canvas z-10 px-6 text-center select-none">
        {/* Animated Aperture Lens Ring */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="absolute w-14 h-14 rounded-full border border-bronze/40 animate-ping opacity-30" />
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
            <Camera className="w-5 h-5 text-bronze animate-pulse" />
          </div>
        </div>

        {/* Fixed Minimal Text (Referenced from About Section) */}
        <p className="font-serif text-2xl sm:text-3xl tracking-widest text-[#F4F1EB] uppercase mb-1 font-light">
          GAURAV
        </p>
        <div className="flex items-center space-x-2 text-[10px] tracking-ultra text-bronze uppercase font-mono">
          <span>MAHARASHTRA</span>
          <span className="text-white/30">&bull;</span>
          <span>CULTURE IN FOCUS</span>
        </div>

        {/* Minimal Hairline Divider */}
        <div className="w-24 h-[1px] bg-bronze/50 mt-3" />
      </div>
    </div>
  );
}
