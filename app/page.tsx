"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Music, Theater, Palette, Trophy, Clock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import { useMouseSpotlight } from "@/hooks/useMouseSpotlight";
import "./globals.css";

// ─── Animation Variants ───────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const textVariant = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 10 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Marquee content ──────────────────────────────────────────────────────────
const marqueeItems = [
  "🎵 Music & Cultural Extravaganza",
  "🎭 Theater & Storytelling",
  "📚 Literary Pursuits",
  "🎨 Art Showcase",
  "🏆 Competitions",
  "🍛 Culinary Experience",
  "✨ Network with Talents",
  "🌟 Showcase Your Skills",
  "🎯 Celebrate Heritage",
];

// ─── Event highlight cards data ───────────────────────────────────────────────
const highlights = [
  {
    icon: Music,
    title: "Music & Culture",
    desc: "From Carnatic to contemporary — Karnataka's rich musical heritage on one stage.",
    gradient: "from-[#00f2ff]/10 to-[#0070f3]/5",
    iconColor: "#00f2ff",
  },
  {
    icon: "🎭",
    title: "Theater",
    desc: "Yakshagana, modern plays, and captivating stories brought to life.",
    gradient: "from-[#8b5cf6]/10 to-[#c084fc]/5",
    iconColor: "#8b5cf6",
  },
  {
    icon: Palette,
    title: "Art & Creative",
    desc: "Mysore paintings, digital art, Kasuti embroidery, and more.",
    gradient: "from-[#00f2ff]/8 to-[#8b5cf6]/8",
    iconColor: "#c084fc",
  },
  {
    icon: Trophy,
    title: "Competitions",
    desc: "Talent hunts, technical events, sports, and skill-based contests.",
    gradient: "from-[#f59e0b]/8 to-[#ef4444]/5",
    iconColor: "#f59e0b",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  // Activate the cursor spotlight hook
  useMouseSpotlight();

  return (
    <div className="relative min-h-screen bg-[#020202] overflow-x-hidden">
      {/* Spotlight grid layer — revealed by cursor */}
      <div className="spotlight-grid" />

      {/* Ambient background gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(0,242,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8"
      >
        {/* Pill badge */}
        <motion.div
          variants={textVariant}
          initial="hidden"
          animate="show"
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#00f2ff]/30 bg-[#00f2ff]/5 text-[#00f2ff]">
            <Sparkles className="w-3.5 h-3.5" />
            Global Academy of Technology · Bengaluru
          </span>
        </motion.div>

        {/* Main headline + Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-auto"
        >
          {/* ── Card 1: Hero headline (spans 4 cols, 2 rows) ─────────────────── */}
          <GlassCard
            className="md:col-span-4 min-h-[340px] flex flex-col justify-between"
            initial="hidden"
            animate="show"
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div>
              <motion.p
                variants={textVariant}
                className="text-xs font-bold tracking-[0.3em] uppercase text-[#00f2ff]/70 mb-4"
              >
                Inter-Department Event Registration
              </motion.p>
              <motion.h1
                variants={textVariant}
                className="silver-text text-5xl sm:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tighter mb-4"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                INTERACT
                <br />
                <span className="blue-text">2K26</span>
                <br />
                IS BACK.
              </motion.h1>
              <motion.p
                variants={textVariant}
                className="text-white/50 text-base md:text-lg max-w-sm leading-relaxed"
              >
                A spectacular celebration of culture, innovation, and excellence.
              </motion.p>
            </div>
            <motion.div variants={textVariant} className="flex items-center gap-3 mt-6">
              <MagneticButton>
                <Link
                  id="hero-events-btn"
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#0070f3] text-black font-bold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-shadow duration-300"
                >
                  Explore Events
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  id="hero-signin-btn"
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/20 hover:bg-white/10 font-semibold text-sm tracking-wide transition-all duration-300"
                >
                  Sign In
                </Link>
              </MagneticButton>
            </motion.div>
          </GlassCard>

          {/* ── Card 2: Date/Venue stat (spans 2 cols) ───────────────────────── */}
          <GlassCard
            className="md:col-span-2 min-h-[160px] flex flex-col justify-center items-center text-center"
            beamColor1="#8b5cf6"
            beamColor2="#c084fc"
          >
            <Clock className="w-8 h-8 text-[#8b5cf6] mb-3 animate-float" />
            <p className="text-3xl font-black silver-text mb-1">2026</p>
            <p className="text-white/50 text-sm font-medium tracking-wide">Coming Soon</p>
            <p className="text-white/30 text-xs mt-2 tracking-wider uppercase">
              GAT · Bengaluru
            </p>
          </GlassCard>

          {/* ── Card 3: Event count stat ──────────────────────────────────────── */}
          <GlassCard
            className="md:col-span-2 min-h-[160px] flex flex-col justify-center items-center text-center"
            beamColor1="#f59e0b"
            beamColor2="#ef4444"
          >
            <p
              className="text-5xl font-black blue-text mb-2"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              50+
            </p>
            <p className="text-white/50 text-sm font-semibold tracking-widest uppercase">
              Events
            </p>
            <p className="text-white/30 text-xs mt-1">Across all departments</p>
          </GlassCard>

          {/* ── Card 4: "Why Attend" highlight ───────────────────────────────── */}
          <GlassCard className="md:col-span-4 min-h-[160px] flex flex-col justify-center">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-[#8b5cf6]/70 mb-3">
              Why Attend?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "✨", label: "Network with Talents", sub: "Connect with creative minds from across Karnataka." },
                { icon: "🌟", label: "Showcase Your Skills", sub: "Compete, gain recognition, and earn invaluable experience." },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-bold text-white/90 text-sm">{item.label}</p>
                    <p className="text-white/40 text-xs leading-relaxed mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── MARQUEE SCROLLING BAR ─────────────────────────────────────────────── */}
      <div className="relative z-10 my-6 border-y border-white/5 py-4 overflow-hidden">
        <div
          className="flex gap-12 animate-marquee-dark whitespace-nowrap"
          aria-hidden="true"
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-sm font-semibold text-white/30 tracking-widest uppercase flex-shrink-0"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── EVENT HIGHLIGHTS GRID ─────────────────────────────────────────────── */}
      <section
        id="highlights"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#00f2ff]/60 mb-2">
            What's in store
          </p>
          <h2
            className="text-3xl md:text-4xl font-black silver-text"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            A Spectacular Lineup
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {highlights.map((h) => (
            <motion.div key={h.title} variants={cardVariant}>
              <GlassCard
                className="h-full min-h-[200px] flex flex-col justify-between"
                beamColor1={h.iconColor}
                beamColor2="#8b5cf6"
                beamDuration={2.5}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${h.gradient} mb-4 w-fit`}
                >
                  {typeof h.icon === "string" ? (
                    <span className="text-2xl">{h.icon}</span>
                  ) : (
                    <h.icon className="w-6 h-6" style={{ color: h.iconColor }} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white/90 text-base mb-2">{h.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{h.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA SECTION ───────────────────────────────────────────────────────── */}
      <section
        id="cta"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard className="text-center py-16 px-8" beamDuration={4}>
            {/* Decorative glow */}
            <div
              className="absolute inset-0 rounded-[2rem]"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,242,255,0.06) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#00f2ff]/60 mb-4">
                Mark your calendar
              </p>
              <h2
                className="text-4xl md:text-5xl font-black silver-text mb-4"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                "The only limit is
                <br />
                your imagination."
              </h2>
              <p className="text-white/40 text-base mb-8 max-w-lg mx-auto">
                Come, celebrate, perform, inspire, and be inspired at INTERACT 2K26 — hosted by
                Global Academy of Technology, Bengaluru.
              </p>
              <MagneticButton>
                <Link
                  id="cta-events-btn"
                  href="/events"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00f2ff] to-[#8b5cf6] text-black font-black text-base tracking-wide hover:shadow-[0_0_40px_rgba(0,242,255,0.35),0_0_60px_rgba(139,92,246,0.2)] transition-shadow duration-500"
                >
                  Browse All Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticButton>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
