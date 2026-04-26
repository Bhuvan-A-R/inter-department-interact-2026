"use client";

import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function FloatingLeaderboard() {
  return (
    <Link 
      href="/results"
      className="fixed z-[9999] hidden min-[1011px]:flex items-center group transition-all duration-500 ease-in-out
                 top-1/2 -translate-y-1/2 right-0"
    >
      <div className="flex flex-row-reverse items-center bg-gat-gold text-gat-midnight shadow-gold
                      rounded-l-full py-3 px-4 md:px-5 border border-r-0 border-white/20 
                      hover:bg-gat-dark-gold hover:text-white transition-all duration-300 active:scale-95 group"
      >
        <Trophy className="w-6 h-6 md:w-7 md:h-7 animate-pulse group-hover:animate-none group-hover:scale-110 transition-transform duration-300" />
        
        <span className="max-w-0 overflow-hidden whitespace-nowrap font-heading font-bold uppercase tracking-wider text-sm md:text-base 
                       group-hover:max-w-[150px] group-hover:mr-3 transition-all duration-500 ease-in-out">
          Leaderboard
        </span>
      </div>
    </Link>
  );
}
