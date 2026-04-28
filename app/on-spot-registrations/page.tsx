"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

/**
 * PASTE YOUR LINKS HERE
 * label: The text shown on the button
 * url:   The link to redirect to (can be external https://... or internal /events/...)
 */
const links = [
  {
    label: "INTERACT 2026 – Event Payment Details",
    url: "/event-payment-details",
  },
  {
    label: "INTERACT 2026 – On Spot Registration - DAY - 02",
    url: "https://forms.gle/2E894wz2Ap7PRtsP6",
  },
  // { label: "INTERACT 2026 - ID - On - Spot Registartion Approved Data", url: "https://docs.google.com/spreadsheets/d/1DflVRV5w05uaj7QmBLmyNWHr_wBH_OBTwlrsFA71RJg/edit?usp=sharing" },

  // Add more here...
];

export default function OnSpotRegistrations() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      <ParticlesBackground />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <span className="pill-badge">
              <Sparkles size={14} className="text-secondary" />
              Quick Registration
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none uppercase">
            ON-SPOT <br />
            <span className="text-primary">PORTAL</span>
          </h1>

          <p className="text-muted-foreground text-lg font-body-out">
            Select an event to start your registration.
          </p>
        </motion.div>

        {/* Buttons List */}
        <div className="flex flex-col gap-4">
          {links.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.url}
                target={item.url.startsWith("http") ? "_blank" : "_self"}
                className="group w-full flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm"
              >
                <span className="font-display text-xl font-bold group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <div className="flex items-center gap-2 text-primary group-hover:text-white transition-colors font-bold">
                  {item.url.startsWith("http") ? (
                    <ExternalLink size={18} />
                  ) : (
                    <ArrowRight size={20} />
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-sm text-muted-foreground font-body-out"
        >
          Clicking a button will redirect you to the registration page.
        </motion.p>
      </div>
    </div>
  );
}
