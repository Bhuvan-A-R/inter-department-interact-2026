import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSession, decrypt, SessionPayload } from "@/lib/session";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    
    console.log("SPOC Login API - Session:", session);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const dbUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        paymentUrl: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // create a stateless session for the SPOC
    const token: SessionPayload = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      paymentUrl: dbUser.paymentUrl ? true : false,
    };
    await createSession(token, "spoc_session");

    return NextResponse.json({
      success: true,
      message: "Switched to SPOC session",
      role: dbUser.role,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Server error try again later",
    }, { status: 500 });
  }
}
