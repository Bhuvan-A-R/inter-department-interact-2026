"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import gatLogo from "@/public/gat-logos/GAT_Linear Logo.png";
import LoginLogoutButton from "./LoginLogoutButton";
import MagneticButton from "./ui/MagneticButton";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/schedule", label: "Schedule" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-3xl bg-black/40 shadow-[0_1px_0_0_rgba(255,255,255,0.08)] border-b border-white/10"
          : "backdrop-blur-2xl bg-white/[0.03] border-b border-white/[0.06]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <Image
              src={gatLogo}
              alt="GAT Logo"
              width={160}
              height={90}
              className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <MagneticButton key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-semibold text-white/70 hover:text-white tracking-wide transition-colors duration-200 group"
                >
                  {link.label}
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-[#00f2ff] to-[#8b5cf6] group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              </MagneticButton>
            ))}
          </div>

          {/* Right: Login/Logout + mobile toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Login button */}
            <div className="hidden md:block">
              <MagneticButton>
                <LoginLogoutButton />
              </MagneticButton>
            </div>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMobileMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden backdrop-blur-3xl bg-black/60 border-t border-white/10"
          >
            <div className="px-4 py-6 flex flex-col items-center gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/80 hover:text-[#00f2ff] text-base font-semibold tracking-wide transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
                className="pt-2"
              >
                <LoginLogoutButton />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
