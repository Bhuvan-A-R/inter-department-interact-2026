"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

import { spocsData } from "@/data/spocsData";

export default function SpocsPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden pb-32"
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Background gradients and particles */}
      <ParticlesBackground />
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-50 transition-opacity duration-500" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 100%, hsl(var(--secondary) / 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Header Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="pill-badge mb-6 inline-flex uppercase tracking-widest text-xs font-bold">
            Meet the Team
          </span>
          <h1
            className="font-display text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
            style={{ color: "hsl(var(--foreground))" }}
          >
            DEPARTMENT <span style={{ color: "hsl(var(--primary))" }}>SPOCS</span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Reach out to your respective department Single Point of Contacts (SPOCs) for event
            registrations, specific queries, and internal coordination for INTERACT 2K26.
          </p>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {spocsData.map((spoc, index) => (
            <motion.div
              key={spoc.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden"
              style={{
                borderRadius: "var(--radius)",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                transition: "transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 16px 40px hsl(var(--primary) / 0.18)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)";
              }}
            >
              {/* Department Badge — top right */}
              <div
                className="absolute top-3 right-3 z-20 px-3 py-1 rounded font-display font-bold text-xs uppercase tracking-wider"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                  letterSpacing: "0.08em",
                }}
              >
                {spoc.department}
              </div>

              {/* Photo — fills top portion of card */}
              <div
                className="relative w-full overflow-hidden"
                style={{ height: "280px", background: "hsl(var(--muted) / 0.15)" }}
              >
                <Image
                  src={spoc.photo}
                  alt={spoc.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Gradient overlay at the bottom of photo */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(var(--card)) 30%, transparent 100%)",
                  }}
                />
              </div>

              {/* Info block */}
              <div className="px-5 pt-2 pb-6">
                {/* Name */}
                <h3
                  className="font-display text-lg font-black leading-tight mb-3 tracking-tight"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {spoc.name}
                </h3>

                {/* Divider */}
                <div
                  className="w-8 h-[2px] rounded-full mb-4"
                  style={{ background: "hsl(var(--secondary))" }}
                />

                {/* Contact */}
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${spoc.phone}`}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                      style={{ background: "hsl(var(--primary) / 0.1)" }}
                    >
                      <Phone size={12} style={{ color: "hsl(var(--primary))" }} />
                    </span>
                    {spoc.phone}
                  </a>
                  <a
                    href={`mailto:${spoc.email}`}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                      style={{ background: "hsl(var(--primary) / 0.1)" }}
                    >
                      <Mail size={12} style={{ color: "hsl(var(--primary))" }} />
                    </span>
                    {spoc.email}
                  </a>
                </div>
              </div>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 0 1.5px hsl(var(--primary) / 0.5)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
