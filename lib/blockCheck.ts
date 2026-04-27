import prisma from "@/lib/db";
import { events as masterEvents } from "@/data/scheduleInterDepartment";

export async function checkRegistrationBlocks(eventNames: string[]): Promise<string | null> {
    const blocks = await prisma.eventBlock.findMany();
    if (blocks.length === 0) return null;

    const now = new Date();

    for (const eventName of eventNames) {
        // Find if this specific event has a block
        const eventBlock = blocks.find(b => b.targetName === `Event: ${eventName}`);
        if (eventBlock && now > new Date(eventBlock.blockTime)) {
            const timeStr = new Date(eventBlock.blockTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            return `Registration for ${eventName} has been closed since ${timeStr}.`;
        }

        // Find the event in the schedule to get its date
        const scheduleEvent = masterEvents.find(e => e.eventName === eventName);
        if (scheduleEvent) {
            const dateBlock = blocks.find(b => b.targetName === `Date: ${scheduleEvent.date}`);
            if (dateBlock && now > new Date(dateBlock.blockTime)) {
                const timeStr = new Date(dateBlock.blockTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
                return `Registration for events on ${scheduleEvent.date} has been closed since ${timeStr}.`;
            }
        }
    }

    return null; // All good, no blocks violated
}

export async function getBlockedEvents(): Promise<string[]> {
    const blocks = await prisma.eventBlock.findMany();
    if (blocks.length === 0) return [];

    const now = new Date();
    const blockedEvents: string[] = [];

    // Get all event names from schedule
    const allEventNames = masterEvents.map(e => e.eventName);

    for (const eventName of allEventNames) {
        // Find if this specific event has a block
        const eventBlock = blocks.find(b => b.targetName === `Event: ${eventName}`);
        if (eventBlock && now > new Date(eventBlock.blockTime)) {
            blockedEvents.push(eventName);
            continue;
        }

        // Find the event in the schedule to get its date
        const scheduleEvent = masterEvents.find(e => e.eventName === eventName);
        if (scheduleEvent) {
            const dateBlock = blocks.find(b => b.targetName === `Date: ${scheduleEvent.date}`);
            if (dateBlock && now > new Date(dateBlock.blockTime)) {
                blockedEvents.push(eventName);
            }
        }
    }

    return blockedEvents;
}
