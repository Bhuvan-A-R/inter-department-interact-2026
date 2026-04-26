"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Search, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import gatLogo from "@/public/gat-logos/GAT_Linear_Logo.png"; // Changed to snake_case to fix the Invalid URL error
import interactLogo from "@/public/gat-logos/INTERACT2K26.png";
import LoginLogoutButton from "./LoginLogoutButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  // { href: "/results", label: "Results" },
  { href: "/spoc-details", label: "SPOC's Details" },
  { href: "/points-calculation-scheme", label: "Championship Scoring" },
  { href: "/schedule", label: "Schedule" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled
            ? "bg-gat-midnight text-white border-gat-cobalt/30 shadow-navy"
            : "bg-white/95 backdrop-blur-sm text-gat-charcoal border-gat-blue/10"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group flex items-center">
              <Image
                src={gatLogo}
                alt="GAT Logo"
                width={160}
                height={90}
                className={`object-contain h-10 md:h-12 w-auto transition-all duration-300 ${scrolled ? 'opacity-90' : 'opacity-100'}`}
                priority
              />
              <Image
                src={interactLogo}
                alt="Interact Logo"
                width={160}
                height={90}
                className={`object-contain h-10 md:h-12 w-auto transition-all duration-300 ${scrolled ? 'opacity-90' : 'opacity-100'}`}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden min-[1011px]:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body font-semibold transition-colors hover:text-gat-blue ${scrolled ? "text-white/80" : "text-gat-charcoal"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Cluster */}
            <div className="hidden min-[1011px]:flex flex-row items-center gap-4">
              {/* <button className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                scrolled ? "border-gat-steel/30 text-gat-steel hover:text-white" : "border-gat-steel/30 text-gat-steel hover:text-gat-charcoal bg-transparent"
              }`}>
                <Search className="w-4 h-4" />
                <span>Search events...</span>
                <kbd className="ml-2 px-1.5 py-0.5 text-[10px] uppercase border rounded bg-gat-steel/10 font-mono">⌘K</kbd>
              </button> */}
              <LoginLogoutButton />
            </div>

            {/* Mobile Nav Toggle */}
            <button
              className="min-[1011px]:hidden p-2 rounded focus:outline-none"
              style={{ color: scrolled ? "white" : "var(--gat-midnight, #000)" }}
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="min-[1011px]:hidden overflow-hidden bg-gat-midnight text-white border-t border-gat-cobalt/30"
            >
              <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-heading font-bold text-white hover:bg-gat-cobalt/30 uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-4 border-t border-gat-cobalt/30 flex flex-col gap-4">
                  <LoginLogoutButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Nav Bar */}
      <nav className="min-[1011px]:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gat-blue/10 flex items-center justify-around h-16 px-2 safe-area-pb shadow-[0_-4px_24px_rgba(35,98,236,0.05)]">
        <Link 
          href="/results" 
          className={`flex flex-col items-center justify-center w-full p-2 transition-colors rounded-lg ${
            pathname === "/results" ? "bg-gat-dark-gold text-white" : "bg-gat-gold text-gat-midnight"
          }`}
        >
          <Trophy className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold mt-1 uppercase">Results</span>
        </Link>
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full p-2 transition-colors rounded-lg ${
            pathname === "/" ? "bg-gat-blue/10 text-gat-blue" : "text-gat-steel"
          }`}
        >
          <span className="text-xs font-bold mt-1">Home</span>
        </Link>
        <Link 
          href="/events" 
          className={`flex flex-col items-center justify-center w-full p-2 transition-colors rounded-lg ${
            pathname === "/events" ? "bg-gat-blue/10 text-gat-blue" : "text-gat-steel"
          }`}
        >
          <span className="text-xs mt-1">Events</span>
        </Link>
        <Link 
          href="/schedule" 
          className={`flex flex-col items-center justify-center w-full p-2 transition-colors rounded-lg ${
            pathname === "/schedule" ? "bg-gat-blue/10 text-gat-blue" : "text-gat-steel"
          }`}
        >
          <span className="text-xs mt-1">Schedule</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
