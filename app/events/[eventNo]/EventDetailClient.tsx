"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  IndianRupee,
  Phone,
  BookOpen,
  ShieldCheck,
  Hash,
  Tag,
} from "lucide-react";
import { EventCategory } from "@/data/eventCategories";
import { EventList } from "@/data/eventList";
import GlassCard from "@/components/ui/GlassCard";

interface Props {
  category: EventCategory;
  details: EventList[];
}

// Category → accent color map
const categoryColors: Record<string, { from: string; to: string; glow: string }> = {
  THEATRE:        { from: "#f97316", to: "#ef4444", glow: "rgba(249,115,22,0.12)" },
  DANCE:          { from: "#a855f7", to: "#ec4899", glow: "rgba(168,85,247,0.12)" },
  MUSIC:          { from: "#00f2ff", to: "#8b5cf6", glow: "rgba(0,242,255,0.10)" },
  FASHION:        { from: "#f43f5e", to: "#f97316", glow: "rgba(244,63,94,0.12)" },
  LITERARY:       { from: "#22d3ee", to: "#0ea5e9", glow: "rgba(34,211,238,0.10)" },
  FINE_ARTS:      { from: "#84cc16", to: "#10b981", glow: "rgba(132,204,22,0.10)" },
  GENERAL_EVENTS: { from: "#fbbf24", to: "#f59e0b", glow: "rgba(251,191,36,0.10)" },
};

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function EventDetailClient({ category, details }: Props) {
  const accent = categoryColors[category.category] ?? {
    from: "#00f2ff",
    to: "#8b5cf6",
    glow: "rgba(0,242,255,0.10)",
  };

  const hasDetails = details.length > 0;

  return (
    <div className="relative min-h-screen bg-[#020202]">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${accent.glow} 0%, transparent 65%)`,
        }}
      />

      {/* ── Back button ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <motion.a
          href="/events"
          {...fade(0)}
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors duration-200 no-underline group"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Events
        </motion.a>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <header className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        {/* Event number + category pills */}
        <motion.div {...fade(0.05)} className="flex items-center gap-3 mb-6 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border"
            style={{
              background: `linear-gradient(135deg, ${accent.from}18, ${accent.to}18)`,
              borderColor: `${accent.from}40`,
              color: accent.from,
            }}
          >
            <Hash className="w-3 h-3" />
            Event {String(category.eventNo).padStart(2, "0")}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.50)",
            }}
          >
            <Tag className="w-3 h-3" />
            {category.category.replace(/_/g, " ")}
          </span>
        </motion.div>

        {/* Event name */}
        <motion.h1
          {...fade(0.1)}
          className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight"
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            background: `linear-gradient(135deg, #fff 30%, ${accent.from} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {category.eventName}
        </motion.h1>

        {/* Stat chips */}
        <motion.div {...fade(0.15)} className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm">
            <IndianRupee className="w-4 h-4 text-[#8b5cf6]/70" />
            <span className="text-white/50">Registration Fee</span>
            <span className="text-white font-bold">₹{category.amount ?? 0}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm">
            <Users className="w-4 h-4 text-[#00f2ff]/70" />
            <span className="text-white/50">Max Participants</span>
            <span className="text-white font-bold">{category.maxParticipant}</span>
          </div>
        </motion.div>

        {/* Gradient divider */}
        <div
          className="mt-10 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${accent.from}50, transparent)`,
          }}
        />
      </header>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-10">
        {hasDetails ? (
          details.map((detail, idx) => (
            <div key={idx} className="space-y-8">
              {/* Sub-event name (shown only when there are multiple entries or name differs) */}
              {(details.length > 1 || detail.name !== category.eventName) && (
                <motion.div {...fade(0.18 + idx * 0.06)}>
                  <h2
                    className="text-xl font-bold text-white/70 mb-1"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    {detail.name}
                  </h2>
                  <div className="h-px bg-white/8 mt-3" />
                </motion.div>
              )}

              {/* Rules & Regulations */}
              <motion.div {...fade(0.22 + idx * 0.06)}>
                <GlassCard showBeam beamDuration={3}>
                  <div className="flex items-center gap-2 mb-5">
                    <ShieldCheck
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: accent.from }}
                    />
                    <h3 className="text-base font-bold text-white/90 uppercase tracking-widest">
                      Rules &amp; Regulations
                    </h3>
                  </div>
                  <ol className="space-y-3">
                    {detail.rules.map((rule, rIdx) => (
                      <motion.li
                        key={rIdx}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: rIdx * 0.04 }}
                        className="flex gap-3 text-sm text-white/65 leading-relaxed"
                      >
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                          style={{
                            background: `linear-gradient(135deg, ${accent.from}30, ${accent.to}30)`,
                            color: accent.from,
                            border: `1px solid ${accent.from}40`,
                          }}
                        >
                          {rIdx + 1}
                        </span>
                        {rule}
                      </motion.li>
                    ))}
                  </ol>
                </GlassCard>
              </motion.div>

              {/* Coordinators */}
              {(detail.coordinator || (detail.coordinators && detail.coordinators.length > 0)) && (
                <motion.div {...fade(0.28 + idx * 0.06)}>
                  <GlassCard showBeam beamColor1={accent.from} beamColor2={accent.to} beamDuration={3.5}>
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: accent.to }}
                      />
                      <h3 className="text-base font-bold text-white/90 uppercase tracking-widest">
                        Event Coordinators
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {detail.coordinator && (
                        <CoordinatorCard
                          name={detail.coordinator.name}
                          mobile={detail.coordinator.mobile}
                          accent={accent}
                        />
                      )}
                      {detail.coordinators?.map((c, ci) => (
                        <CoordinatorCard key={ci} name={c.name} mobile={c.mobile} accent={accent} />
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          ))
        ) : (
          /* No matching eventList entry — show basic card */
          <motion.div {...fade(0.2)}>
            <GlassCard showBeam>
              <p className="text-white/40 text-sm text-center py-8">
                Detailed rules for this event will be announced soon. Stay tuned!
              </p>
            </GlassCard>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ── Coordinator card sub-component ──────────────────────────────────────────
function CoordinatorCard({
  name,
  mobile,
  accent,
}: {
  name: string;
  mobile: string;
  accent: { from: string; to: string };
}) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl border"
      style={{
        background: `linear-gradient(135deg, ${accent.from}08, ${accent.to}08)`,
        borderColor: `${accent.from}20`,
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: `linear-gradient(135deg, ${accent.from}30, ${accent.to}30)`,
          border: `1px solid ${accent.from}40`,
        }}
      >
        <Users className="w-4 h-4" style={{ color: accent.from }} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90 leading-snug">{name}</p>
        <a
          href={`tel:${mobile.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-1.5 mt-1 text-xs no-underline"
          style={{ color: accent.from, textDecoration: "none" }}
        >
          <Phone className="w-3 h-3" />
          {mobile}
        </a>
      </div>
    </div>
  );
}
