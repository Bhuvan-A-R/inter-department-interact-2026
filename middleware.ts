import { NextResponse, NextRequest } from "next/server";
import { verifySession } from "@/lib/session";
import { Redis } from "@upstash/redis"; // Use Upstash Redis

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    console.warn("[Redis] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. Rate limiting disabled.");
}

const redis = redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken
    })
    : null;

const GLOBAL_RATE_LIMIT_WINDOW = 60; // Time window in seconds
const GLOBAL_RATE_LIMIT_MAX = 100; // Maximum requests allowed per window
const OTP_RATE_LIMIT_WINDOW = 60; // Time window in seconds for OTP
const OTP_RATE_LIMIT_MAX = 5; // Maximum OTP requests per window

const protectedRoutes: string[] = [
    "/api/register",
    "/api/getallregister",
    "/api/eventsregister",
    "/api/getalleventregister",
    "/api/deleteeventregister",
    "/api/postdatetime",
    "/api/updateregisterdetails",
    "/api/updateregisterfiles",
    "/api/updateroleinevent",
    "/api/deleteregistrantevent",
    "/api/addeventregister",
    "/api/get-blocked-events",
    "/register",
    "/register/documentupload",
    "/register/eventregister",
    "/register/getallregister",
    "/register/getregister",
    "/register/updateregister",
    "/api/getPaymentInfo",
];

const adminRoutes: string[] = [
    "/adminDashboard",
];


export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Extract IP address
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip") ||
        "unknown";

    // Apply OTP-specific rate limiting (skip if Redis unavailable)
    if (path === "/api/sendOtp" && redis) {
        try {
            const otpRedisKey = `otp-rate-limit:${ip}`;
            const currentOtpRequests = await redis.incr(otpRedisKey);
            if (currentOtpRequests === 1) {
                await redis.expire(otpRedisKey, OTP_RATE_LIMIT_WINDOW);
            }

            if (currentOtpRequests > OTP_RATE_LIMIT_MAX) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Too many OTP requests, please try again later.",
                    },
                    { status: 429 }
                );
            }
        } catch (error) {
            console.error("[Redis OTP Error]", error);
        }
    }

    // Apply global rate limiting for all routes (skip if Redis unavailable)
    let currentGlobalRequests = 1;
    if (redis) {
        try {
            const globalRedisKey = `rate-limit:${ip}:${path}`;
            currentGlobalRequests = await redis.incr(globalRedisKey);
            if (currentGlobalRequests === 1) {
                await redis.expire(globalRedisKey, GLOBAL_RATE_LIMIT_WINDOW);
            }
        } catch (error) {
            console.error("[Redis Rate Limit Error]", error);
            // Continue without rate limiting
        }
    }

    if (currentGlobalRequests > GLOBAL_RATE_LIMIT_MAX) {
        return NextResponse.json(
            {
                success: false,
                message: "Too many requests, please try again later.",
            },
            { status: 429 }
        );
    }

    const requestHeaders = new Headers(request.headers);
    const referer = request.headers.get("referer") || "";
    const isRegisterPage = path.startsWith("/register");
    const isApiCall = path.startsWith("/api");
    const isFromRegister = referer.includes("/register");

    if (isRegisterPage || (isApiCall && isFromRegister)) {
        requestHeaders.set("x-spoc-context", "true");
    }

    const session = await verifySession();

    // Admin-only routes
    if (adminRoutes.some(route => path.startsWith(route)) && (!session?.id || session?.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
    }


    if (protectedRoutes.includes(path) && session?.id && session?.paymentUrl) {
        return NextResponse.redirect(new URL("/auth/countdown", request.nextUrl));
    }

    if (protectedRoutes.includes(path) && !session?.id) {
        return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/api/:path*",
        "/register/:path*",
        "/adminDashboard/:path*",
    ],
};
