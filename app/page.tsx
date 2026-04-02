"use client";

import { useEffect, useState } from "react";
import "./globals.css";
import Header from "@/components/Background";
import GATInfoSection from "@/components/GATInfoSection";
import ThemeSection from "@/components/ThemeSection";
import Interact2K26Section from "@/components/Interact2K26Section";

// Import your images – update the paths as needed.
const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "INTERACT 2K26 IS BACK!";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-background sm:margins  md:pt-5 ">
      {/* Hero Section with Typing Effect */}
      <div className="text-center mb-12 pt-8">
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#003366] mb-4 h-20 flex items-center justify-center">
          {displayText}
          {displayText.length < fullText.length && (
            <span className="animate-pulse text-[#D32F23]">|</span>
          )}
        </h2>
      </div>

      <div className="relative z-10">
        {/* <GATInfoSection /> */}
        <Interact2K26Section />
        {/* <ThemeSection /> */}
      </div>
    </div>
  );
};

export default Home;
