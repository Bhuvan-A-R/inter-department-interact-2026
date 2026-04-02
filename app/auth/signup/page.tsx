"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
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
import { LoadingButton } from "@/components/LoadingButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { colleges } from "@/data/colleges";

// Import images (ensure these paths are correct)
import gatLogo from "@/public/images/gat-logo.png";
import vtulogo from "@/public/images/vtulogo.png";
import bgImage from "@/public/images/GAT IMAGE.png";

// Define the sign-up schema
const signupSchema = z.object({
  collegeName: z.string().min(3, "College name must be at least 3 characters"),
  collegeCode: z
    .string()
    .min(3, "College code must be at least 3 characters")
    .max(3),
  region: z.string().min(3, "Region must be at least 3 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

export default function SignUp() {
  const router = useRouter();
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [collegeSearchTerm, setCollegeSearchTerm] = useState("");

  // Refs to keep the search inputs focused
  const collegeSearchInputRef = useRef<HTMLInputElement>(null);

  // Filter colleges based on the search term.
  // We map each region to a filtered list of colleges,
  // then only include regions that have matching colleges.
  const filteredColleges = colleges
    .map((region) => ({
      ...region,
      colleges: region.colleges.filter((college) =>
        college.name.toLowerCase().includes(collegeSearchTerm.toLowerCase()),
      ),
    }))
    .filter((region) => region.colleges.length > 0);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      collegeName: "",
      collegeCode: "",
      region: "",
      phone: "",
      email: "",
      otp: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
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
      console.error("Failed to send OTP:", error);
      form.setError("email", {
        message: "Failed to send OTP. Please try again.",
      });
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Signup successful! Redirecting to login...");
        router.push("/auth/signin");
      } else {
        const { errors } = data;
        if (errors) {
          for (const field in errors) {
            form.setError(field as any, { message: errors[field] });
          }
        }
        toast.error("Signup failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      toast.error("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 backdrop-blur-xl bg-white/30"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      }}
    >
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          backgroundImage: `url('${bgImage.src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
        }}
      />

      {/* Content Container */}
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

          {/* Form Content */}
          <CardContent className="backdrop-blur-xl bg-white/20 p-6 border-t border-white/30">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* College Selection with Search */}
                <FormField
                  control={form.control}
                  name="collegeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-bold drop-shadow-lg">
                        College
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const selectedRegion = colleges.find((region) =>
                            region.colleges.some(
                              (college) => college.code === value,
                            ),
                          );
                          const selectedCollege = selectedRegion?.colleges.find(
                            (college) => college.code === value,
                          );
                          form.setValue("collegeCode", value);
                          form.setValue(
                            "collegeName",
                            selectedCollege?.name || "",
                          );
                          form.setValue("region", selectedRegion?.region || "");
                          // Refocus the search input so the cursor remains in the box.
                          setTimeout(() => {
                            collegeSearchInputRef.current?.focus();
                          }, 0);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-200 border border-gray-400 text-gray-900 text-lg rounded-lg">
                            <SelectValue placeholder="Select your college" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-200 border-gray-400 text-black">
                          <div
                            className="px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              ref={collegeSearchInputRef}
                              placeholder="Search college..."
                              value={collegeSearchTerm}
                              onChange={(e) =>
                                setCollegeSearchTerm(e.target.value)
                              }
                              onKeyDown={(e) => e.stopPropagation()}
                              className="w-full"
                            />
                          </div>
                          {filteredColleges.length > 0 ? (
                            filteredColleges.map((region) => (
                              <SelectGroup key={region.region}>
                                <SelectLabel className="text-black">
                                  {region.region}
                                </SelectLabel>
                                {region.colleges.map((college) => (
                                  <SelectItem
                                    key={college.code}
                                    value={college.code}
                                  >
                                    {college.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ))
                          ) : (
                            <div className="px-2 py-1 text-gray-500">
                              College not found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-bold drop-shadow-lg">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-gray-200 border border-gray-400 text-black placeholder-black-900 text-lg rounded-lg w-full"
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />

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
                            className="bg-gray-200 text-black hover:bg-gray-400 border border-gray-400 text-bold whitespace-nowrap px-4 shadow-lg"
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

                {/* OTP Input */}
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black font-bold drop-shadow-lg">
                        Enter OTP Number
                      </FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
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
                      <FormMessage className="text-black-900" />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-black text-white hover:bg-gray-800 font-bold transition-all duration-300 hover:scale-105 py-3 rounded-lg shadow-lg"
                >
                  Sign Up
                </LoadingButton>
              </form>
            </Form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="backdrop-blur-xl bg-white/20 p-4 flex flex-col gap-6 border-t border-white/30">
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/20 px-2 text-black/90 font-bold drop-shadow-lg">
                    Already Registered?
                  </span>
                </div>
              </div>
            <Button
              variant="outline"
              className="w-full bg-white text-black font-bold text-l hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 shadow-lg border-gray-300"
              onClick={() => router.push("/auth/signin")}
            >
              Log In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
