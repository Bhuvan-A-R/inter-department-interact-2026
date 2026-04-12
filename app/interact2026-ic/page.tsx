"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import interactLogo from "@/public/gat-logos/INTERACT2K26.png";

const REDIRECT_URL = "https://gatinteract.com";
const REDIRECT_DELAY_MS = 4000;

export default function Interact2026RedirectPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / REDIRECT_DELAY_MS) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        window.location.href = REDIRECT_URL;
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#002366]" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#FFD700]" />
      
      {/* Collegiate Watermarks */}
      <div className="absolute -top-20 -right-20 w-64 h-64 border-[16px] border-[#002366]/5 rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 border-[24px] border-[#FFD700]/10 rounded-full" />

      <div className="relative z-10 flex flex-col items-center gap-12 px-6 max-w-lg w-full">
        
        {/* Logo Container with Animated Rings */}
        <div className="relative flex items-center justify-center">
          {/* Rotating Outer Ring */}
          <div className="absolute w-40 h-40 border-2 border-t-[#002366] border-r-transparent border-b-[#FFD700] border-l-transparent rounded-full animate-spin" />
          
          {/* Pulsing Glow */}
          <div className="absolute w-32 h-32 bg-[#002366]/5 rounded-full animate-pulse" />
          
          {/* The INTERACT2K26 Logo */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <Image 
              src={interactLogo}
              alt="Interact 2K26 Logo"
              width={120}
              height={120}
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        {/* Branding & Event Info */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-[#002366] uppercase italic">
            Interact <span className="text-[#FFD700] not-italic text-5xl">2K26</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <div className="h-[2px] w-6 bg-[#FFD700]" />
             <p className="text-xs font-bold tracking-[0.25em] text-slate-500 uppercase">
               Inter-Collegiate Fest
             </p>
             <div className="h-[2px] w-6 bg-[#FFD700]" />
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full max-w-xs space-y-4">
          <div className="relative h-2.5 w-full bg-slate-100 rounded-full border border-slate-200 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#002366] to-[#004dc7] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center px-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#002366]">
              Loading Arena...
            </p>
            <p className="text-[10px] font-black text-[#FFD700]">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>

      {/* Sport Stripes Accent */}
      <div className="absolute bottom-10 right-10 flex gap-2 rotate-12 opacity-10 pointer-events-none">
        <div className="w-4 h-32 bg-[#002366]" />
        <div className="w-4 h-32 bg-[#FFD700]" />
      </div>
    </main>
  );
}
