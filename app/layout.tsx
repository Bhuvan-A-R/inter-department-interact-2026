import React from "react";
import Navbar from "../components/Navbar";
import Footer from ".././components/Footer";
import "./globals.css";
import AuthContextProvider from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  metadataBase: new URL("https://www.vtufestinteract.com"),
  title: {
    default: "Home - INTERACT 2026",
    template: "%s - INTERACT 2026",
  },
  description:
    "Join Global Academy of Technology for INTERACT 2026 – a celebration of innovation, creativity, and technology at one of the biggest college fests. Explore events, workshops, and performances designed for a memorable experience.",
  keywords: [
    "INTERACT 2026",
    "Global Academy of Technology",
    "gat fest 2026",
    "college fest",
    "tech fest",
    "university festival",
    "innovation",
    "creativity",
    "technology events",
  ],
  authors: [{ name: "Bhuvan S A", url: "https://www.bhuvansa.com/" }],
  creator: "Bhuvan S A",
  publisher: "Global Academy of Technology",
  openGraph: {
    url: "https://www.vtufestinteract.com",
    siteName: "INTERACT 2026",
    type: "website",
    title: "INTERACT 2026",
    description:
      "Join Global Academy of Technology for INTERACT 2026 – a celebration of innovation, creativity, and technology with events, workshops, and performances designed for an unforgettable experience.",
    images: [
      {
        url: "https://www.vtufestinteract.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "INTERACT 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INTERACT 2026",
    description:
      "Experience the best of innovation and creativity at INTERACT 2026 hosted by Global Academy of Technology.",
    site: "@vtufest2026",
    creator: "@bhuvansa",
    images: ["https://www.vtufestinteract.com/images/og-image.jpg"],
  },
};

// Global layout for pages
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inter Tight — premium heading font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Persistent 5% grain / noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Cursor radial spotlight — updated via --mx/--my CSS vars from useMouseSpotlight */}
        <div className="cursor-spotlight" aria-hidden="true" />

        <ThemeProvider>
          <AuthContextProvider>
            <Navbar />
            <main className="pt-20">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Toaster
              theme="dark"
              toastOptions={{
                style: {
                  background: "rgba(10,10,10,0.9)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f4f4f5",
                },
              }}
            />
            <Footer />
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
