import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySession } from "@/lib/session";
import { events as scheduleEvents } from "@/data/scheduleInterDepartment";
import { interDepartmentEvents as categoryEvents } from "@/data/eventCategories";

type RegistrationRow = {
  registrantId: string;
  studentName: string;
  rollNo: string;
  department: string | null;
  email: string;
  phone: string;
  eventName: string;
  eventDate: string | null;
  registrationDate: string | null;
  eventId: number | null;
  domain: string | null;
};

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();

const eventMetadataMap = new Map();

// Load from schedule
scheduleEvents.forEach(e => {
  const key = normalize(e.eventName);
  eventMetadataMap.set(key, {
    date: e.date,
    id: e.eventId,
    domain: e.domain
  });
});

// Load from categories (may overwrite or fill gaps)
categoryEvents.forEach(e => {
  const key = normalize(e.eventName);
  const existing = eventMetadataMap.get(key) || {};
  eventMetadataMap.set(key, {
    ...existing,
    id: existing.id || e.eventNo,
    domain: existing.domain || e.category
  });
});

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
    const metadata = eventMetadataMap.get(normalize(baseEventName));
    const eventDate = metadata?.date ?? null;
    const eventId = metadata?.id ?? entry.event?.eventNo ?? null;
    const domain = metadata?.domain ?? entry.event?.category ?? null;

    return {
      registrantId: entry.registrantId,
      studentName: entry.registrant.name,
      rollNo: entry.registrant.usn,
      department: dept,
      email: entry.registrant.email,
      phone: entry.registrant.phone || entry.registrant.user?.phone || "",
      eventName,
      eventDate,
      registrationDate: null,
      eventId,
      domain,
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
