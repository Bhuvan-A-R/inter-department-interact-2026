import prisma from "@/lib/db";
import { DataTable, Data } from "@/components/register/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Type } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PenSquare, UserPlus } from "lucide-react";
import { PaymentDialog } from "@/components/getRegister/paymentDialog";

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

  const incompleteEvents = userEvents.filter(
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
      type: typeLabel,
      events: combinedEvents,
      status: docStatusMap[registrant.docStatus],
    });
  }

  return (
    <div className="auth-shell items-start pt-20">
      <div className="relative z-10 w-full">
        <div className="mt-4 justify-center flex flex-col gap-4">
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="auth-title text-5xl md:text-5xl xl:text-5xl mb-6">
              Registration List
            </h1>
          </div>
        </div>
        {incompleteEvents.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-red-500 font-bold text-xl mb-2 flex items-center">
                <PenSquare className="mr-2 h-6 w-6" />
                Action Required: Incomplete Teams
              </h2>
              <p className="text-black-200/80 mb-4">
                The following events require more participants before you can proceed to payment. 
                Please add the remaining members using the &quot;Add Registrant&quot; button.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incompleteEvents.map((e, index) => (
                  <div key={index} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <p className="font-semibold text-black-600">
                      {formatEventLabel(e.eventName, e.deptCode, e.teamNumber)}
                    </p>
                    <p className="text-sm text-red-400 font-medium">
                      Need {e.minParticipant - e.registeredParticipant} more participant(s)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-4 gap-4 mb-3 flex-wrap">
          <Link href="/register/modifyevents">
            <Button
              variant="outline"
              className="auth-button auth-button-secondary px-6"
            >
              <PenSquare className="mr-2 h-5 w-5" />
              Modify Events
            </Button>
          </Link>
          <Link href="/register/addRegistrant">
            <Button
              variant="outline"
              className="auth-button auth-button-secondary px-6"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Add Registrant
            </Button>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-6xl auth-section p-4">
          <DataTable data={results} />
        </div>

        <div className="flex flex-col items-center mt-8 mb-5 gap-4">
          {/* Render PaymentDialog only once. Assume PaymentDialog uses the trigger passed via children or className. */}
          <PaymentDialog className="auth-button px-6" />
        </div>
      </div>
    </div>
  );
}
