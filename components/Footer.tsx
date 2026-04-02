"use client";

import Image from "next/image";
import insta from "@/public/images/flogo2.png";
import yt from "@/public/images/flogo1.png";
import facebook from "@/public/images/flogo3.png";
import linkedin from "@/public/images/flogo4.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      aria-label="Site Footer"
      className="backdrop-blur-xl bg-white/90 dark:bg-black/80 shadow-2xl border-b border-white/20 text-black border-t border-black/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Left block */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src="/images/gat-logo.png"
                alt="GAT logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <p className="text-xl font-bold text-black/90">
                  Global Academy of Technology
                </p>
                <p className="text-sm text-black">Bengaluru, Karnataka</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-4">
              <Image
                src="/images/vtulogo.png"
                alt="VTU logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <p className="text-xl font-bold">
                  Visvesvaraya Technological University
                </p>
                <p className="text-sm text-black">VTU</p>
              </div>
            </div> */}
            <p className="text-sm leading-relaxed text-black">
              Growing Ahead of Time.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:scale-110"
              >
                <Image src={linkedin} alt="LinkedIn" width={24} height={24} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:scale-110"
              >
                <Image src={insta} alt="Instagram" width={24} height={24} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:scale-110"
              >
                <Image src={yt} alt="YouTube" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* Sitemap column */}
          <div>
            <h3 className="text-lg font-semibold text-black/90 mb-4">
              Site Map
            </h3>
            <ul className="space-y-2 text-black">
              <li>
                <a href="/auth/teampage" className="hover:text-[#FFC25A]">
                  Our Team
                </a>
              </li>
              <li>
                <a href="/auth/instructions" className="hover:text-[#FFC25A]">
                  Registration Instructions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="text-lg font-semibold text-black/90 mb-4">Legal</h3>
            <ul className="space-y-2 text-black">
              <li>
                <a href="/privacy-policy" className="hover:text-[#FFC25A]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-services" className="hover:text-[#FFC25A]">
                  Terms of Services
                </a>
              </li>
              {/* <li>
                <a href="/lawyers-corners" className="hover:text-[#FFC25A]">
                  Lawyer&apos;s Corners
                </a>
              </li> */}
            </ul>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-2 inline-flex items-center gap-2 border border-white/50 px-4 py-2 text-sm uppercase tracking-wide hover:bg-white/10 transition"
            >
              ↑ Back to Top
            </button>
          </div>
        </div>

        <div className="mt-10 border-t border-[#1F6F62] pt-6 text-center text-sm text-black/70">
          Copyright © 2026 interact2k26.com, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
