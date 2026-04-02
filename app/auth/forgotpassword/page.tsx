"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { resetPasswordSchema } from "@/lib/schemas/auth";
import axios from "axios";
import { toast } from "sonner";
import bgImage from "../../../components/images/GATBGIMG.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [confirmVisibility, setConfirmVisibility] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const sendOTP = async () => {
    const email = form.getValues("email");
    if (!email) {
      form.setError("email", { message: "Please enter your email" });
      return;
    }
    setIsSendingOTP(true);
    try {
      const response = await axios.post("/api/sendEmailOtp", { email });
      if (response.data.success) {
        form.clearErrors("email");
        toast.success(
          "OTP sent successfully! Check your email. OTP is valid for 5 minutes.",
        );
        setResendTimer(60); // 60 seconds cooldown
      } else {
        form.setError("email", {
          message: response.data.message || "Failed to send OTP.",
        });
        toast.error(
          response.data.message || "Failed to send OTP. Please try again.",
        );
      }
    } catch (error: unknown) {
      form.setError("email", {
        message: "Failed to send OTP. Please try again.",
      });
      toast.error("Failed to send OTP. Please try again.");
      console.error(error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/resetpassword", values);
      if (response.data.success) {
        toast.success("Password reset successful! Redirecting to login...");
        router.push("/auth/signin");
      } else {
        if (response.data.error === "Invalid OTP") {
          form.setError("otp", { message: "Invalid OTP. Please try again." });
          toast.error("Invalid OTP. Please try again.");
        } else if (response.data.error === "User does not exist") {
          form.setError("email", { message: "No user found with this email." });
          toast.error("No user found with this email.");
        } else {
          toast.error(
            response.data.message || "Password reset failed. Please try again.",
          );
        }
      }
    } catch {
      toast.error("An error occurred during password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-10 backdrop-blur-xl bg-white/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      }}
    >
      {/* Background Image with reduced opacity */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center backdrop-blur-2xl"
        style={{
          backgroundImage: `url('${bgImage.src}')`,
          opacity: 0.6,
        }}
      />

      {/* Content over the background */}
      <div className="relative z-10">
        <Card className="w-full max-w-md rounded-lg shadow-2xl overflow-hidden border-0 transition-shadow duration-300 hover:shadow-3xl">
          {/* Header */}
          <CardHeader className="backdrop-blur-xl bg-gray-200 p-6 text-center border-b border-white/30">
            <div className="flex items-center justify-center gap-2 ml-10 mr-10">
              {/* <div className="transition-transform duration-300 hover:scale-105">
                <Image
                  src={gatLogo}
                  alt="GAT Logo"
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-lg"
                />
              </div> */}
              <div className="transition-transform duration-300 hover:scale-105">
                <CardTitle className="text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-red-600 via-[#800000] to-red-900 bg-clip-text text-transparent drop-shadow-lg leading-tight">
                  INTERACT
                </CardTitle>
              </div>
              <div className="transition-transform duration-300 hover:scale-105 flex items-center">
                <CardDescription className="text-3xl font-extrabold text-[#1e3a8a] uppercase tracking-wide drop-shadow-lg animate-bounce leading-tight">
                  <sub className="text-base align-top font-semibold text-[#1e3a8a]"></sub>
                  2K26
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Form content */}
          <CardContent className="backdrop-blur-xl bg-white/20 p-7 border-t border-white/30">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-bold drop-shadow-lg">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            className="flex-1 bg-gray-200 border border-gray-400 text-black placeholder-black-900 text-lg rounded-lg"
                            placeholder="Enter your email"
                            {...field}
                          />
                          <Button
                            type="button"
                            onClick={sendOTP}
                            disabled={isSendingOTP || resendTimer > 0}
                            className="bg-black text-white hover:bg-gray-800 font-bold whitespace-nowrap px-4 shadow-lg"
                          >
                            {isSendingOTP
                              ? "Sending..."
                              : resendTimer > 0
                                ? `Resend (${resendTimer}s)`
                                : "Send OTP"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-gray-900" />
                    </FormItem>
                  )}
                />

                {/* OTP Field */}
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-900 font-bold">
                        Enter OTP
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-center space-x-2">
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            className="bg-gray-200"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={0}
                                className="bg-gray-200 border border-gray-400 txt-black text-xl rounded-md"
                              />
                              <InputOTPSlot
                                index={1}
                                className="bg-gray-200 border border-gray-400 text-black text-xl rounded-md"
                              />
                            </InputOTPGroup>
                            <InputOTPSeparator className="text-black-900" />
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={2}
                                className="bg-gray-200 border border-gray-400 text-black text-xl rounded-md"
                              />
                              <InputOTPSlot
                                index={3}
                                className="bg-gray-200 border border-gray-400 text-black text-xl rounded-md"
                              />
                            </InputOTPGroup>
                            <InputOTPSeparator className="text-black-900" />
                            <InputOTPGroup>
                              <InputOTPSlot
                                index={4}
                                className="bg-gray-200 border border-gray-400 text-black text-xl rounded-md"
                              />
                              <InputOTPSlot
                                index={5}
                                className="bg-gray-200 border border-gray-400 text-black text-xl rounded-md"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-900 font-bold">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-gray-200 border-gray-400 focus:border-yellow-400 text-gray-900 focus:ring-2 focus:ring-yellow-400"
                          placeholder="Enter your new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black-900 font-bold">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={confirmVisibility ? "text" : "password"}
                            className="bg-background border-input focus:border-primary text-gray-900 focus:ring-2 focus:ring-yellow-400 pr-10"
                            placeholder="Confirm your new password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmVisibility((prev) => !prev)
                            }
                            className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800"
                          >
                            {confirmVisibility ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-black text-white hover:bg-gray-800 font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Reset Password
                </LoadingButton>
              </form>
            </Form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="bg-[#990000] p-5 flex flex-col gap-6">
            <Button
              variant="outline"
              className="w-full bg-white text-black font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg border-gray-300"
              onClick={() => router.push("/auth/signin")}
            >
              Back to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
