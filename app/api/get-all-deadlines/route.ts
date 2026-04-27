import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const blocks = await prisma.eventBlock.findMany();
        const deadlines: Record<string, string> = {};
        
        blocks.forEach(block => {
            if (block.targetName.startsWith("Event: ")) {
                const eventName = block.targetName.replace("Event: ", "");
                deadlines[eventName] = block.blockTime.toISOString();
            }
        });

        return NextResponse.json({ deadlines });
    } catch (error) {
        console.error("Error fetching deadlines:", error);
        return NextResponse.json(
            { error: "Failed to fetch deadlines" },
            { status: 500 }
        );
    }
}
