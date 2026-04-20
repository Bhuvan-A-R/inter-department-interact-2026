"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { events } from "@/data/scheduleInterDepartment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

type EventBlock = {
  id: string;
  targetName: string;
  blockTime: string;
};

// Formats an ISO string (e.g. 2026-04-20T12:00:00Z) to YYYY-MM-DDThh:mm for the input
const formatForInput = (isoDate: string) => {
    const d = new Date(isoDate);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
}

const getBaseEventName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "Unknown Event";
  const matchIndex = trimmed.toLowerCase().indexOf(" 1ga");
  if (matchIndex === -1) return trimmed;
  return trimmed.slice(0, matchIndex).trim() || "Unknown Event";
};

export default function EventDeadlinesPage() {
  const [blocks, setBlocks] = React.useState<EventBlock[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [eventCounts, setEventCounts] = React.useState<Record<string, number>>({});
  
  // State for user inputs per event (event name -> datetime string)
  const [inputs, setInputs] = React.useState<Record<string, string>>({});

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/admin/blocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks);
        
        const newInputs: Record<string, string> = {};
        data.blocks.forEach((b: EventBlock) => {
           if (b.targetName.startsWith("Event: ")) {
               const eventName = b.targetName.replace("Event: ", "");
               newInputs[eventName] = formatForInput(b.blockTime);
           }
        });
        setInputs(newInputs);
      }
      
      const dashboardRes = await fetch("/api/admin/registration-dashboard");
      if (dashboardRes.ok) {
         const dData = await dashboardRes.json();
         const counts: Record<string, number> = {};
         dData.registrations.forEach((r: any) => {
            const ev = getBaseEventName(r.eventName || "");
            counts[ev] = (counts[ev] || 0) + 1;
         });
         setEventCounts(counts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlocks();
  }, []);

  const handleSaveBlock = async (eventName: string) => {
    const datetimeStr = inputs[eventName];
    if (!datetimeStr) {
      alert("Please select a date and time to save.");
      return;
    }
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName: `Event: ${eventName}`, blockTime: datetimeStr })
      });
      if (res.ok) {
        alert("Deadline saved successfully for " + eventName);
        fetchBlocks();
      } else {
        const err = await res.json();
        alert("Error saving: " + err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlock = async (eventName: string) => {
    if (!confirm(`Are you sure you want to remove the deadline for ${eventName}?`)) return;
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName: `Event: ${eventName}` })
      });
      if (res.ok) {
        setInputs(prev => {
            const next = { ...prev };
            delete next[eventName];
            return next;
        });
        fetchBlocks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 text-black">
      <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-8 shadow-sm">
        <h2 className="text-3xl font-bold mb-2">Event Registration Deadlines</h2>
        <p className="text-black/70 mb-8">
            Manage the exact date and time registrations should visually and functionally close for each specific event. 
            Events without a listed deadline will remain open indefinitely until overridden.
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Event Name</TableHead>
              <TableHead className="w-1/3">Deadline (Date & Time)</TableHead>
              <TableHead className="w-1/3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-black/70 py-6">Loading events...</TableCell>
              </TableRow>
            ) : (
                events.map(event => (
                  <TableRow key={event.eventId}>
                    <TableCell className="font-medium">
                        {event.eventName}
                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                           {eventCounts[event.eventName] || 0} Registered
                        </span>
                        <div className="text-xs text-black/50 mt-1">Scheduled for: {event.date} - {event.timings}</div>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="datetime-local" 
                        value={inputs[event.eventName] || ""}
                        onChange={(e) => setInputs({ ...inputs, [event.eventName]: e.target.value })}
                        className="w-full max-w-[250px]"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        <Button size="sm" onClick={() => handleSaveBlock(event.eventName)}>
                           Save / Edit
                        </Button>
                        {!!inputs[event.eventName] && (
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteBlock(event.eventName)}>
                                Remove
                            </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
