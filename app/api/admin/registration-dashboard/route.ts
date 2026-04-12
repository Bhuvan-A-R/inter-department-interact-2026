import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySession } from "@/lib/session";
import { events as scheduleEvents } from "@/data/scheduleInterDepartment";

type RegistrationRow = {
  registrantId: string;
  studentName: string;
  rollNo: string;
  department: string | null;
  email: string;
  eventName: string;
  eventDate: string | null;
  registrationDate: string | null;
};

const eventDateByName = new Map(
  scheduleEvents.map((event) => [event.eventName.toLowerCase(), event.date])
);

export async function GET() {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { message: "unauthorized" },
      { status: 401 }
    );
  }

  const [totalStudents, totalEvents, registrants, eventRegistrations] =
    await Promise.all([
      prisma.registrants.count(),
      prisma.events.count(),
      prisma.registrants.findMany({
        select: {
          id: true,
          deptCode: true,
          user: { select: { deptCode: true } },
        },
      }),
      prisma.eventRegistrations.findMany({
        include: {
          event: true,
          registrant: { include: { user: true } },
        },
      }),
    ]);

  const departmentSet = new Set<string>();
  registrants.forEach((registrant) => {
    const dept = registrant.deptCode || registrant.user?.deptCode;
    if (dept) {
      departmentSet.add(dept);
    }
  });

  const registrations: RegistrationRow[] = eventRegistrations.map((entry) => {
    const dept =
      entry.registrant.deptCode || entry.registrant.user?.deptCode || null;
    const baseEventName = entry.event?.eventName || "Unknown Event";
    const deptLabel = entry.event?.deptCode ? ` ${entry.event.deptCode}` : "";
    const teamLabel = entry.event?.teamNumber
      ? ` Team ${entry.event.teamNumber}`
      : "";
    const eventName = `${baseEventName}${deptLabel}${teamLabel}`.trim();
    const eventDate = eventDateByName.get(baseEventName.toLowerCase()) ?? null;

    return {
      registrantId: entry.registrantId,
      studentName: entry.registrant.name,
      rollNo: entry.registrant.usn,
      department: dept,
      email: entry.registrant.email,
      eventName,
      eventDate,
      registrationDate: null,
    };
  });

  return NextResponse.json({
    summary: {
      totalStudents,
      totalEvents,
      activeDepartments: departmentSet.size,
    },
    registrations,
  });
}
