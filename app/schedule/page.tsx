"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Filter } from "lucide-react";
import { events } from "@/data/scheduleInterDepartment";

// ── Track config ──────────────────────────────────────────────────────────────
const TRACKS = [
  { label: "27-04-2026", dateKey: "27th April", trackNo: 1, color: "hsl(var(--primary))", bg: "hsl(var(--primary) / 0.1)", border: "hsl(var(--primary) / 0.2)" },
  { label: "28-04-2026", dateKey: "28th April", trackNo: 2, color: "#7c3aed", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)" },
  { label: "29-04-2026", dateKey: "29th April", trackNo: 3, color: "#2563eb", bg: "rgba(37,99,235,0.1)",  border: "rgba(37,99,235,0.2)"  },
  { label: "04-05-2026", dateKey: "4th May",    trackNo: 4, color: "#16a34a", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.2)"  },
  { label: "05-05-2026", dateKey: "5th May",    trackNo: 5, color: "#ea580c", bg: "rgba(234,88,12,0.1)", border: "rgba(234,88,12,0.2)"  },
  { label: "06-05-2026", dateKey: "6th May",    trackNo: 6, color: "#db2777", bg: "rgba(219,39,119,0.1)", border: "rgba(219,39,119,0.2)"  },
];

const DOMAIN_COLORS: Record<string, string> = {
  THEATRE:          "#ea580c",
  DANCE:            "#9333ea",
  MUSIC:            "#0891b2",
  FASHION:          "#e11d48",
  LITERARY:         "#0284c7",
  FINE_ARTS:        "#65a30d",
  GENERAL_EVENTS:   "#d97706",
  FACULTY:          "#4b5563",
  SPORTS:           "#ef4444",
  TECHNICAL:        "#2563eb",
};

function trackForDate(dateKey: string) {
  return TRACKS.find((t) => dateKey.includes(t.dateKey));
}

const ALL_DOMAINS = ["All", ...Array.from(new Set(events.map((e) => e.domain)))];

export default function SchedulePage() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [activeDomain, setActiveDomain] = useState("All");

  const filtered = events.filter((e) => {
    const track = trackForDate(e.date);
    const matchTrack = activeTrack === null || track?.trackNo === activeTrack;
    const matchDomain = activeDomain === "All" || e.domain === activeDomain;
    return matchTrack && matchDomain;
  });

  return (
    <div className="relative min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ 
          background: `
            radial-gradient(ellipse 65% 55% at 60% 35%, hsl(var(--primary) / 0.07) 0%, transparent 65%),
            radial-gradient(ellipse 45% 45% at 5% 85%,  hsl(var(--secondary) / 0.05) 0%, transparent 55%),
            hsl(var(--background))
          `
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="relative z-10 py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-4 mt-5"
          >
            <span className="pill-badge">
              INTERACT 2K26 · Global Academy of Technology
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-8xl font-black tracking-tight mb-5"
            style={{ color: "hsl(var(--foreground))" }}
          >
            SCHEDULE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body-out text-base md:text-lg max-w-xl mx-auto px-4"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {TRACKS.length} tracks. {events.length} events. One unforgettable fest.
          </motion.p>
        </div>
        <div className="mt-10 h-px max-w-sm mx-auto" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }} />
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ── Section heading ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--secondary)))" }} />
          <div>
            <p className="eyebrow !mb-0.5">Event Category</p>
            <h2 className="font-display text-2xl md:text-3xl font-black" style={{ color: "hsl(var(--foreground))" }}>
              Inter Department Events
            </h2>
          </div>
        </motion.div>

        {/* ── Track filter pills ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 mb-6"
        >
          <button
            onClick={() => setActiveTrack(null)}
            className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200"
            style={{
              background: activeTrack === null ? "hsl(var(--foreground) / 0.1)" : "hsl(var(--foreground) / 0.04)",
              borderColor: activeTrack === null ? "hsl(var(--foreground) / 0.2)" : "hsl(var(--foreground) / 0.08)",
              color: activeTrack === null ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
            }}
          >
            All Tracks
          </button>
          {TRACKS.map((t) => (
            <button
              key={t.trackNo}
              onClick={() => setActiveTrack(activeTrack === t.trackNo ? null : t.trackNo)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200"
              style={{
                background: activeTrack === t.trackNo ? t.bg : "hsl(var(--foreground) / 0.04)",
                borderColor: activeTrack === t.trackNo ? t.border : "hsl(var(--foreground) / 0.08)",
                color: activeTrack === t.trackNo ? t.color : "hsl(var(--muted-foreground))",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
              <span className="whitespace-nowrap text-[10px]">Track {t.trackNo} · {t.dateKey}</span>
            </button>
          ))}
        </motion.div>

        {/* ── Domain filter pills ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 mb-8"
        >
          {ALL_DOMAINS.map((d) => {
            const dc = d === "All" ? "hsl(var(--primary))" : DOMAIN_COLORS[d] ?? "hsl(var(--foreground))";
            const active = activeDomain === d;
            return (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className="px-3 py-2 rounded-xl text-[11px] font-bold border transition-all duration-200 flex items-center justify-center text-center"
                style={{
                  background: active ? `${dc}18` : "hsl(var(--foreground) / 0.04)",
                  borderColor: active ? `${dc}50` : "hsl(var(--border))",
                  color: active ? dc : "hsl(var(--muted-foreground))",
                }}
              >
                {d.replace("_", " ")}
              </button>
            );
          })}
        </motion.div>

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <div
              className="grid text-[10px] font-bold tracking-widest uppercase border-b"
              style={{
                gridTemplateColumns: "3rem 1fr 8rem 9rem 9rem 11rem",
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--muted) / 0.05)",
                color: "hsl(var(--muted-foreground))",
                padding: "0.75rem 1.25rem",
              }}
            >
              <span>#</span>
              <span>Event</span>
              <span>Domain</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Date</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Time</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Venue</span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                No events match the selected filters.
              </div>
            ) : (
              filtered.map((ev, idx) => {
                const track = trackForDate(ev.date);
                const domainColor = DOMAIN_COLORS[ev.domain] ?? "hsl(var(--foreground))";
                const isEven = idx % 2 === 0;

                return (
                  <motion.div
                    key={ev.eventId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.018, 0.4) }}
                    className="grid items-center border-b last:border-b-0 transition-colors duration-150 hover:bg-muted/5"
                    style={{
                      gridTemplateColumns: "3rem 1fr 8rem 9rem 9rem 11rem",
                      borderColor: "hsl(var(--border) / 0.5)",
                      background: isEven ? "transparent" : "hsl(var(--muted) / 0.02)",
                      padding: "0.85rem 1.25rem",
                      gap: "0.5rem",
                    }}
                  >
                    <span className="text-[11px] font-bold" style={{ color: "hsl(var(--muted-foreground) / 0.4)" }}>
                      {String(ev.eventId).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold leading-snug pr-4" style={{ color: "hsl(var(--foreground))" }}>
                      {ev.eventName}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase"
                      style={{ color: domainColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: domainColor }} />
                      {ev.domain}
                    </span>
                    {track ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit"
                        style={{ background: track.bg, borderColor: track.border, color: track.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: track.color }} />
                        {track.label}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{ev.date}</span>
                    )}
                    <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{ev.timings}</span>
                    <span className="text-xs leading-snug" style={{ color: "hsl(var(--muted-foreground))" }}>{ev.venue}</span>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                No events match filters.
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "hsl(var(--border) / 0.5)" }}>
                {filtered.map((ev, idx) => {
                  const track = trackForDate(ev.date);
                  const domainColor = DOMAIN_COLORS[ev.domain] ?? "hsl(var(--foreground))";
                  return (
                    <motion.div
                      key={ev.eventId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.4) }}
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className="text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: domainColor }}
                          >
                            {ev.domain}
                          </span>
                          <h3 className="text-base font-bold leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                            {ev.eventName}
                          </h3>
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: "hsl(var(--muted-foreground) / 0.3)" }}>
                          #{String(ev.eventId).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {track && (
                          <div
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{ background: track.bg, borderColor: track.border, color: track.color }}
                          >
                            <Calendar className="w-3 h-3" />
                            {track.label}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                          <Clock className="w-3 h-3 opacity-50" />
                          {ev.timings}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                          <MapPin className="w-3 h-3 opacity-50" />
                          {ev.venue}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Result count */}
        <p className="mt-4 text-xs text-right" style={{ color: "hsl(var(--muted-foreground) / 0.5)" }}>
          Showing {filtered.length} of {events.length} events
        </p>

        {/* Legend */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {TRACKS.map((t) => (
            <span
              key={t.trackNo}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold border"
              style={{ background: t.bg, borderColor: t.border, color: t.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              {t.dateKey} — Event Track {t.trackNo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
