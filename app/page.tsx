"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Music, Wrench, Gamepad2, Trophy } from "lucide-react";
import { motion } from "framer-motion";

// Helper for count-up animation
function CountUp({ to, duration = 1500, label }: { to: number; duration?: number; label: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(easeOut(progress) * to));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [to, duration]);

  return (
    <div className="flex flex-col items-center md:items-start">
      <div className="text-4xl md:text-5xl font-bold text-gat-gold font-mono">{count}+</div>
      <div className="text-xs md:text-sm text-gat-steel uppercase tracking-widest mt-1 font-heading">{label}</div>
    </div>
  );
}

const categories = [
  { name: "Technical", count: 18, color: "bg-gat-blue", text: "text-gat-blue", icon: <Code2 className="w-8 h-8" /> },
  { name: "Cultural", count: 15, color: "bg-gat-gold", text: "text-gat-gold", icon: <Music className="w-8 h-8" /> },
  { name: "Workshop", count: 8, color: "bg-gat-navy", text: "text-gat-navy", icon: <Wrench className="w-8 h-8" /> },
  { name: "Gaming", count: 5, color: "bg-gat-cobalt", text: "text-gat-cobalt", icon: <Gamepad2 className="w-8 h-8" /> },
  { name: "Sports", count: 6, color: "bg-gat-dark-gold", text: "text-gat-dark-gold", icon: <Trophy className="w-8 h-8" /> },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-body selection:bg-gat-blue/20">
      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section className="min-h-screen bg-hero-gradient relative overflow-hidden flex flex-col justify-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle,#8b97b6_1px,transparent_1px)] opacity-[0.08] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="inline-flex px-3 py-1 bg-gat-gold/20 text-gat-gold border border-gat-gold/40 rounded-full text-xs font-heading uppercase tracking-widest mb-6">
            Global Academy of Technology Presents
          </div>

          <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] text-white leading-[0.95] mb-4">
            TECHNO<br />
            <span className="text-gat-gold">CULTURAL</span><br />
            FEST 2026
          </h1>

          <p className="font-heading text-gat-steel tracking-[0.3em] text-sm md:text-base uppercase mb-12">
            Where Code Meets Culture
          </p>

          <div className="flex flex-wrap gap-8 md:gap-16 mb-12">
            <CountUp to={50} label="Events" />
            <CountUp to={3} label="Days" />
            <CountUp to={1000} label="Participants" />
            <div className="flex flex-col items-center md:items-start">
              <div className="text-4xl md:text-5xl font-bold text-gat-gold font-mono">₹2L+</div>
              <div className="text-xs md:text-sm text-gat-steel uppercase tracking-widest mt-1 font-heading">Prize Pool</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gat-gold text-gat-midnight font-bold tracking-wide rounded-lg hover:bg-gat-dark-gold cursor-pointer transition-all shadow-gold hover:-translate-y-1"
            >
              Explore Events <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white text-white font-bold tracking-wide rounded-lg hover:bg-white/10 transition-colors"
            >
              Register Free
            </Link>
          </div>

          <p className="mt-8 text-gat-steel text-sm font-mono opacity-80 border-l-2 border-gat-steel/30 pl-4">
            March 14–16, 2026 &nbsp;·&nbsp; GAT Campus, Bengaluru
          </p>
        </div>
      </section>

      {/* ── EVENT CATEGORIES SECTION ─────────────────────────────────────────── */}
      <section className="py-24 bg-gat-off-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gat-midnight mb-4">Choose Your Domain</h2>
            <p className="font-body text-gat-charcoal text-lg max-w-2xl mx-auto">From high-stakes hackathons to mesmerizing musical performances, find your stage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/events?category=${cat.name.toLowerCase()}`}
                  className="group block bg-white rounded-2xl p-8 text-center border border-gat-blue/10 hover:-translate-y-2 transition-all duration-300 shadow-card hover:shadow-card-hover hover:border-gat-blue/30"
                >
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gat-off-white group-hover:${cat.color} group-hover:text-white transition-colors duration-300 ${cat.text}`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gat-midnight mb-2">{cat.name}</h3>
                  <div className="inline-flex px-3 py-1 rounded-full bg-gat-off-white text-xs font-mono font-semibold text-gat-charcoal">
                    {cat.count} Events
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE TEASER SECTION ─────────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] uppercase text-gat-navy mb-4 font-heading">
                The Itinerary
              </p>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-gat-midnight mb-6 leading-tight">
                3 Days.<br />
                50+ Events.<br />
                <span className="text-gat-blue">Choose Your Adventure.</span>
              </h2>
              <p className="text-gat-charcoal text-lg mb-8 font-body leading-relaxed max-w-lg">
                Our schedule is packed with events that challenge, entertain, and inspire. Plan your days ahead to make the most out of INTERACT 2026.
              </p>
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gat-navy text-gat-navy font-bold rounded-lg hover:bg-gat-navy hover:text-white transition-colors"
              >
                View Full Schedule <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="bg-gat-off-white p-8 rounded-2xl border border-gat-blue/5">
              <div className="space-y-6">
                {[
                  { day: "Day 1", date: "March 14", highlight: "Inauguration & Mega Coding Challenge" },
                  { day: "Day 2", date: "March 15", highlight: "Cultural Showcases & Gaming Finals" },
                  { day: "Day 3", date: "March 16", highlight: "Pro-show & Valedictory Ceremony" },
                ].map((item) => (
                  <div key={item.day} className="flex gap-6 p-4 bg-white rounded-xl shadow-sm border border-gat-blue/5">
                    <div className="flex flex-col items-center justify-center p-3 bg-gat-blue/10 rounded-lg min-w-[80px]">
                      <span className="font-heading font-bold text-gat-blue text-sm">{item.day}</span>
                      <span className="font-mono text-xs text-gat-charcoal mt-1">{item.date}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-gat-midnight font-heading text-lg">{item.highlight}</span>
                      <span className="text-gat-steel text-sm mt-1 cursor-pointer hover:text-gat-blue hover:underline">View details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
