import { deleteEventOfRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";
import { checkRegistrationBlocks } from "@/lib/blockCheck";
import prisma from "@/lib/db";

export async function DELETE(request: Request) {

    const { eventId } = await request.json();

    if (!eventId) {
        return NextResponse.json({ success: false, message: "Event Deleted" }, { status: 400 });
    }

    // Fetch the event registration to get the event name
    const eventRegistration = await prisma.eventRegistrations.findUnique({
        where: { id: eventId },
        include: { event: true }
    });

    if (!eventRegistration) {
        return NextResponse.json({ success: false, message: "Event registration not found" }, { status: 400 });
    }

    // Check if the event is blocked due to deadline
    const blockError = await checkRegistrationBlocks([eventRegistration.event.eventName]);
    if (blockError) {
        return NextResponse.json(
            { success: false, message: blockError },
            { status: 400 }
        );
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const deleteEvent = await deleteEventOfRegistrant(eventId as string);
        return NextResponse.json({ success: true, message: "event deleted" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 400 });
    }
}