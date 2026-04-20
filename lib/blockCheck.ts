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
            return `Registration for ${eventName} has been closed since ${new Date(eventBlock.blockTime).toLocaleString()}.`;
        }

        // Find the event in the schedule to get its date
        const scheduleEvent = masterEvents.find(e => e.eventName === eventName);
        if (scheduleEvent) {
            const dateBlock = blocks.find(b => b.targetName === `Date: ${scheduleEvent.date}`);
            if (dateBlock && now > new Date(dateBlock.blockTime)) {
                return `Registration for events on ${scheduleEvent.date} has been closed since ${new Date(dateBlock.blockTime).toLocaleString()}.`;
            }
        }
    }

    return null; // All good, no blocks violated
}
