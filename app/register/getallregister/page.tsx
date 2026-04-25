import prisma from "@/lib/db";
import { DataTable, Data } from "@/components/register/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Type } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PenSquare, UserPlus } from "lucide-react";
import { PaymentDialog } from "@/components/getRegister/paymentDialog";
import { interDepartmentEvents } from "@/data/eventCategories";

export const docStatusMap = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  APPROVED: "Success",
  REJECTED: "Failed",
} as const;

const formatEventLabel = (
  eventName: string,
  deptCode?: string | null,
  teamNumber?: number | null,
) => {
  const dept = deptCode ? ` ${deptCode}` : "";
  const team = teamNumber ? ` Team ${teamNumber}` : "";
  return `${eventName}${dept}${team}`.trim();
};

export default async function Page() {
  const session = await verifySession();
  if (!session) {
    redirect("/auth/signin");
  }
  const userIdFromSession = session.id as string;

  const currentUser = await prisma.users.findUnique({
    where: { id: userIdFromSession },
    select: { deptCode: true },
  });
  const deptCode = currentUser?.deptCode ?? "registrants";

  // Fetch all events for this user to check minimum participant requirements
  const userEvents = await prisma.events.findMany({
    where: { userId: userIdFromSession },
    select: {
      eventName: true,
      deptCode: true,
      teamNumber: true,
      minParticipant: true,
      registeredParticipant: true,
    }
  });

  const incompleteEvents = userEvents.map(e => {
    // Look up the official minParticipant from eventCategories.ts
    const officialEvent = interDepartmentEvents.find(ie => ie.eventName === e.eventName);
    const minRequired = officialEvent?.minParticipant ?? e.minParticipant;
    
    return {
      ...e,
      minParticipant: minRequired,
    };
  }).filter(
    e => e.registeredParticipant < e.minParticipant
  );

  const registrants = await prisma.registrants.findMany({
    where: { userId: userIdFromSession },
    include: {
      eventRegistrations: {
        include: { event: true },
      },
    },
    orderBy: { usn: "asc" },
  });

  // Build final rows for table
  const results: Data[] = [];

  for (const registrant of registrants) {
    const registrations = registrant.eventRegistrations.map((reg) => ({
      type: reg.type,
      eventName: reg.event?.eventName ?? null,
      deptCode: reg.event?.deptCode ?? null,
      teamNumber: reg.event?.teamNumber ?? null,
    }));
    const hasEvents = registrations.length > 0;
    const participantEvents = registrations
      .filter((r) => r.type === "PARTICIPANT" && r.eventName)
      .map((r) => ({
        eventName: formatEventLabel(r.eventName!, r.deptCode, r.teamNumber),
        role: "Participant" as const,
      }));
    const typeLabel = participantEvents.length > 0 ? "Participant" : "";

    // If no events or type not determined, push a blank record
    if (!hasEvents || typeLabel === "") {
      results.push({
        id: registrant.id,
        name: registrant.name,
        usn: registrant.usn,
        phone: registrant.phone,
        email: registrant.email,
        type: "",
        events: [],
        status: docStatusMap[registrant.docStatus],
      });
      continue;
    }

    // Combine events with role information
    const combinedEvents = participantEvents;

    results.push({
      id: `${registrant.id}#${typeLabel.toUpperCase()}`,
      name: registrant.name,
      usn: registrant.usn,
      phone: registrant.phone,
      email: registrant.email,
      type: typeLabel,
      events: combinedEvents,
      status: docStatusMap[registrant.docStatus],
    });
  }

  return (
    <div className="auth-shell items-start pt-20">
      <div className="relative z-10 w-full">
        <div className="w-full mt-20 flex flex-col md:flex-row gap-8 px-6 md:px-12 mb-10 items-start">
          {/* Left Side: Title, Control Buttons, and Table (80% width) */}
          <div className="flex-1 min-w-0 space-y-8">
            <div className="text-left">
              <h1 className="auth-title text-5xl md:text-6xl xl:text-7xl mb-2">
                Registration List
              </h1>
              <p className="text-black-200/60 text-xl">
                Manage your college's participant details and event registrations.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/register/modifyevents">
                <Button
                  variant="outline"
                  className="auth-button auth-button-secondary px-8"
                >
                  <PenSquare className="mr-2 h-5 w-5" />
                  Modify Events
                </Button>
              </Link>
              <Link href="/register/addRegistrant">
                <Button
                  variant="outline"
                  className="auth-button auth-button-secondary px-8"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add Registrant
                </Button>
              </Link>
              <PaymentDialog 
                className="auth-button px-8" 
                disabled={incompleteEvents.length > 0} 
              />
            </div>

            <div className="auth-section p-6 overflow-hidden w-full border border-white/5 rounded-3xl">
              <DataTable data={results} deptCode={deptCode} />
            </div>
          </div>

          {/* Right Side: Incomplete Teams Check (20% width) */}
          {incompleteEvents.length > 0 && (
            <div className="w-full md:w-[25%] shrink-0">
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-5 backdrop-blur-sm shadow-2xl shadow-red-500/5">
                <h2 className="text-red-500 font-bold text-lg mb-3 flex items-center">
                  <PenSquare className="mr-2 h-5 w-5" />
                  Action Required
                </h2>
                <p className="text-black-200/70 mb-5 text-xs leading-relaxed">
                  Incomplete teams detected. Please fill the remaining slots.
                </p>
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {incompleteEvents.map((e, index) => (
                    <div key={index} className="bg-white/5 border border-red-500/10 rounded-xl p-3 flex flex-col justify-between hover:bg-white/10 transition-all duration-300">
                      <div>
                        <p className="font-semibold text-black-600 text-sm mb-1 leading-tight">
                          {formatEventLabel(e.eventName, e.deptCode, e.teamNumber)}
                        </p>
                        <p className="text-[10px] text-black-400">
                          {e.registeredParticipant} / {e.minParticipant} filled
                        </p>
                      </div>
                      <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tighter">
                        Need {e.minParticipant - e.registeredParticipant} more
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
