"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { eventCategories } from "@/data/eventCategories";
import GlassCard from "@/components/ui/GlassCard";

// ─── Animation helpers ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const EventPage = () => {
  const grouped = eventCategories.reduce<Record<string, typeof eventCategories>>(
    (acc, event) => {
      acc[event.category] = acc[event.category] || [];
      acc[event.category].push(event);
      return acc;
    },
    {},
  );

  return (
    <div className="relative min-h-screen bg-[#020202]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(0,242,255,0.05) 0%, transparent 60%)",
        }}
      />

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 py-24 md:py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, filter: "blur(8px)", y: -8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-[#00f2ff]/60 mb-4"
          >
            INTERACT 2K26 · Global Academy of Technology
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="silver-text text-6xl md:text-8xl font-black tracking-tighter mb-6"
            style={{ fontFamily: "'Inter Tight', sans-serif" }}
          >
            Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Dive into the world of creativity, passion, and competition. Find your stage.
          </motion.p>
        </div>
        <div className="mt-12 h-px max-w-sm mx-auto bg-gradient-to-r from-transparent via-[#00f2ff]/30 to-transparent" />
      </header>

      {/* ── Event Sections ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {Object.entries(grouped).map(([category, events], sectionIdx) => (
          <motion.section
            key={category}
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: sectionIdx * 0.04 }}
          >
            {/* Category header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 rounded-full bg-gradient-to-b from-[#00f2ff] to-[#8b5cf6]" />
                <h2
                  className="text-2xl md:text-3xl font-black text-white/90"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  {category.replace(/_/g, " ")}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-[#00f2ff]/20 bg-[#00f2ff]/5 text-[#00f2ff]/80">
                <Zap className="w-3 h-3" />
                {events.length} events
              </span>
            </div>

            {/* Event cards grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {events.map((event) => (
                <motion.div key={event.eventNo} variants={cardVariants} className="h-full">
                  <a
                    href={`/events/${event.eventNo}`}
                    style={{ textDecoration: "none", display: "block", height: "100%" }}
                  >
                    <GlassCard
                      className="h-full group cursor-pointer"
                      showBeam
                      beamDuration={2.5}
                    >
                      {/* Event number badge + hover hint */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#00f2ff]/8 border border-[#00f2ff]/20 text-[#00f2ff]/80">
                          #{String(event.eventNo).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-[#00f2ff]/60 font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                          View Details
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>

                      {/* Event name */}
                      <h3
                        className="font-bold text-white/90 text-base mb-3 leading-snug group-hover:text-white transition-colors duration-200"
                        style={{ fontFamily: "'Inter Tight', sans-serif" }}
                      >
                        {event.eventName}
                      </h3>

                      {/* Meta row */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <span className="text-xs text-white/30">
                          Fee:{" "}
                          <span className="text-[#8b5cf6]/80 font-semibold">
                            ₹{event.amount ?? 0}
                          </span>
                        </span>
                        <span className="text-xs text-white/20">
                          Max {event.maxParticipant}
                        </span>
                      </div>
                    </GlassCard>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
