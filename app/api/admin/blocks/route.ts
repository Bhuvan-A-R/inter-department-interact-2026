import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/db";

export async function GET() {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const blocks = await prisma.eventBlock.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, blocks });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { targetName, blockTime } = await req.json();

        if (!targetName || !blockTime) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const block = await prisma.eventBlock.upsert({
            where: { targetName },
            update: { blockTime: new Date(blockTime) },
            create: { targetName, blockTime: new Date(blockTime) }
        });

        return NextResponse.json({ success: true, block });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { targetName } = await req.json();

        if (!targetName) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await prisma.eventBlock.delete({
            where: { targetName }
        });

        return NextResponse.json({ success: true, message: "Block removed" });
    } catch (err) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
