"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import insta from "@/public/images/flogo2.png";
import yt from "@/public/images/flogo1.png";
import linkedin from "@/public/images/flogo4.png";
import MagneticButton from "./ui/MagneticButton";

const Footer = () => {
  return (
    <footer
      aria-label="Site Footer"
      className="relative border-t border-white/[0.06] backdrop-blur-2xl bg-white/[0.02]"
    >
      {/* Ambient glow at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-[#00f2ff]/40 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* ── Brand block ─────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Image
                src="/images/gat-logo.png"
                alt="GAT logo"
                width={48}
                height={48}
                className="object-contain  opacity-80"
              />
              <div>
                <p className="text-sm font-bold text-white/90 leading-tight">
                  Global Academy of Technology
                </p>
                <p className="text-xs text-white/30 mt-0.5">Bengaluru, Karnataka</p>
              </div>
            </div>

            <p className="text-sm text-white/30 leading-relaxed italic">
              "Growing Ahead of Time."
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { href: "https://www.linkedin.com", img: linkedin, alt: "LinkedIn" },
                { href: "https://www.instagram.com", img: insta, alt: "Instagram" },
                { href: "https://www.youtube.com", img: yt, alt: "YouTube" },
              ].map(({ href, img, alt }) => (
                <MagneticButton key={alt} strength={8}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={alt}
                    className="inline-flex p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <Image
                      src={img}
                      alt={alt}
                      width={18}
                      height={18}
                      className="brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* ── Sitemap ──────────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-5">
              Site Map
            </h3>
            <ul className="space-y-3">
              {[
                // { href: "/auth/teampage", label: "Our Team" },
                // { href: "/auth/instructions", label: "Registration Instructions" },
                { href: "/events", label: "Events" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/40 hover:text-[#00f2ff] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ──────────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-5">
              Legal
            </h3>
            <ul className="space-y-3 mb-6">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-services", label: "Terms of Services" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/40 hover:text-[#00f2ff] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              id="back-to-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              ↑ Back to Top
            </button>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20 tracking-wide">
            Copyright © 2026 interact2k26.com · All Rights Reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with{" "}
            <span className="text-[#00f2ff]/40">Next.js</span> ·{" "}
            <span className="text-[#8b5cf6]/40">Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
