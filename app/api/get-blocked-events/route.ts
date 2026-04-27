import { getBlockedEvents } from "@/lib/blockCheck";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const blockedEvents = await getBlockedEvents();
        return NextResponse.json({ blockedEvents });
    } catch (error) {
        console.error("Error fetching blocked events:", error);
        return NextResponse.json(
            { error: "Failed to fetch blocked events" },
            { status: 500 }
        );
    }
}