"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/LoadingButton";
import { useAuthContext } from "@/contexts/auth-context";
import { loginSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Import logos and background image – paths unchanged
import gatLogo from "@/public/images/gat-logo.png";
import bgImage from "@/public/images/GAT IMAGE.png";
import MagneticButton from "@/components/ui/MagneticButton";

// ─────────────────────────────────────────────────────────────────────────────
// ALL AUTH LOGIC BELOW IS UNCHANGED. Only classNames / JSX structure is updated.
// ─────────────────────────────────────────────────────────────────────────────

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setIsLoggedIn } = useAuthContext();
  const [visibility, setVisibility] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        email: values.email,
        password: values.password,
      });
      if (response.data.success) {
        setIsLoggedIn(true);
        toast.success("Login successful!", {
          description: "You have been logged in successfully",
        });

        // Role-based redirect – unchanged
        const role = response.data.role;
        if (role === "ADMIN") {
          router.push("/adminDashboard");
        } else if (role === "SPOC") {
          router.push("/register/firstEventSelection");
        } else {
          router.push("/register/firstEventSelection");
        }
      } else {
        form.setError("email", { type: "manual", message: "Invalid credentials" });
        form.setError("password", { type: "manual", message: "Invalid credentials" });
        setError(response.data.message);
        setIsLoading(false);
      }
    } catch (error: unknown) {
      setError("An error occurred during login");
      console.error(error);
      setIsLoading(false);
    }
  }

  // ── Visual layer ────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-[#020202] flex items-center justify-center p-4 overflow-hidden">
      {/* Background image (reduced opacity) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${bgImage.src}')`,
          opacity: 0.06,
        }}
      />

      {/* Ambient gradient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(0,242,255,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Announcement marquee */}
      <div className="absolute top-0 left-0 right-0 border-b border-white/5 bg-white/[0.02] py-2.5 overflow-hidden z-20">
        <div className="whitespace-nowrap animate-marquee-dark flex">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs font-semibold tracking-widest uppercase text-[#00f2ff]/50 mx-12 flex-shrink-0">
              Registrations Starting Soon · Stay tuned for updates · INTERACT 2K26 ·
            </span>
          ))}
        </div>
      </div>

      {/* ── Sign-in card ──────────────────────────────────────────────────────── */}
      <motion.div
        id="signin-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glassmorphic card shell */}
        <div className="bento-card overflow-hidden">
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            <div className="flex flex-col items-center text-center gap-3">
              {/* Logo */}
              <div className="mb-2">
                <Image
                  src={gatLogo}
                  alt="GAT Logo"
                  width={52}
                  height={52}
                  className="object-contain brightness-0 invert opacity-80"
                />
              </div>

              {/* Title */}
              <div className="flex items-center gap-2">
                <h1
                  className="text-4xl font-black silver-text tracking-tighter"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  INTERACT
                </h1>
                <span
                  className="text-2xl font-black blue-text tracking-tight"
                  style={{ fontFamily: "'Inter Tight', sans-serif" }}
                >
                  2K26
                </span>
              </div>

              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30">
                Inter-Department Event Registration Portal
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                        Registered Email ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#00f2ff]/40 focus:ring-1 focus:ring-[#00f2ff]/30 rounded-xl h-11 transition-all duration-200"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs font-semibold tracking-widest uppercase">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#00f2ff]/40 focus:ring-1 focus:ring-[#00f2ff]/30 rounded-xl h-11 pr-10 transition-all duration-200"
                            type={visibility ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <button
                            type="button"
                            id="password-visibility-toggle"
                            onClick={() => setVisibility((prev) => !prev)}
                            className="absolute right-3 top-3 text-white/30 hover:text-white/70 transition-colors duration-200"
                          >
                            {visibility ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Inline error */}
                {error && (
                  <div className="text-xs text-red-400 text-center bg-red-400/5 border border-red-400/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <MagneticButton className="w-full">
                  <LoadingButton
                    type="submit"
                    id="signin-submit-btn"
                    loading={isLoading}
                    className="w-full bg-gradient-to-r from-[#00f2ff] to-[#0070f3] text-black font-black tracking-wide hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-shadow duration-300 rounded-xl h-11"
                  >
                    Sign In
                  </LoadingButton>
                </MagneticButton>
              </form>
            </Form>
          </div>

          {/* Card footer note */}
          <div className="px-8 pb-7 border-t border-white/[0.06] pt-5">
            <p className="text-xs text-white/25 text-center leading-relaxed">
              <span className="text-[#00f2ff]/50 font-semibold">Note:</span> Only SPOCs can log in.
              Participants should reach out to their respective department SPOCs for registrations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
