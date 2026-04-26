"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { events } from "@/data/scheduleInterDepartment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

type EventBlock = {
  id: string;
  targetName: string;
  blockTime: string;
};

// Formats an ISO string (e.g. 2026-04-20T12:00:00Z) to YYYY-MM-DDThh:mm in IST (UTC+5:30)
const formatForInput = (isoDate: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    // Add 5.5 hours (19800000 ms) to get IST representation
    const istTime = new Date(d.getTime() + 19800000);
    return istTime.toISOString().slice(0, 16);
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

  // Selection state for bulk actions
  const [selectedEvents, setSelectedEvents] = React.useState<Set<string>>(new Set());
  const [bulkInput, setBulkInput] = React.useState("");
  const [isBulkSaving, setIsBulkSaving] = React.useState(false);

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

  const toggleSelectAll = () => {
    if (selectedEvents.size === events.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(events.map(e => e.eventName)));
    }
  };

  const toggleSelect = (eventName: string) => {
    const next = new Set(selectedEvents);
    if (next.has(eventName)) next.delete(eventName);
    else next.add(eventName);
    setSelectedEvents(next);
  };

  const handleBulkSave = async () => {
    if (!bulkInput) {
      alert("Please select a date and time for bulk update.");
      return;
    }
    if (selectedEvents.size === 0) {
      alert("Please select at least one event.");
      return;
    }

    setIsBulkSaving(true);
    try {
      const promises = Array.from(selectedEvents).map(eventName => 
        fetch("/api/admin/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            targetName: `Event: ${eventName}`, 
            blockTime: bulkInput + "+05:30" 
          })
        })
      );
      
      await Promise.all(promises);
      alert(`Successfully updated deadlines for ${selectedEvents.size} events.`);
      fetchBlocks();
      setSelectedEvents(new Set());
    } catch (err) {
      console.error(err);
      alert("Error during bulk update.");
    } finally {
      setIsBulkSaving(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.size === 0) return;
    if (!confirm(`Are you sure you want to remove deadlines for ${selectedEvents.size} selected events?`)) return;

    setIsBulkSaving(true);
    try {
      const promises = Array.from(selectedEvents).map(eventName => 
        fetch("/api/admin/blocks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetName: `Event: ${eventName}` })
        })
      );
      
      await Promise.all(promises);
      alert(`Successfully removed deadlines for ${selectedEvents.size} events.`);
      fetchBlocks();
      setSelectedEvents(new Set());
    } catch (err) {
      console.error(err);
      alert("Error during bulk delete.");
    } finally {
      setIsBulkSaving(false);
    }
  };

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
        body: JSON.stringify({ 
          targetName: `Event: ${eventName}`, 
          blockTime: datetimeStr + "+05:30" // Explicitly mark as IST
        })
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

        {/* Bulk Action Bar */}
        <div className={`mb-6 p-4 rounded-xl border transition-all ${selectedEvents.size > 0 ? "bg-blue-50 border-blue-200 opacity-100" : "bg-gray-50 border-gray-100 opacity-50 pointer-events-none"}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-900">{selectedEvents.size} Events Selected</span>
              {selectedEvents.size > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedEvents(new Set())} className="text-blue-700 hover:text-blue-900">
                  Clear Selection
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Input 
                type="datetime-local" 
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                className="bg-white"
              />
              <Button 
                onClick={handleBulkSave} 
                disabled={isBulkSaving || !bulkInput}
                className="whitespace-nowrap"
              >
                {isBulkSaving ? "Updating..." : "Set Deadline"}
              </Button>
              <Button 
                variant="destructive"
                onClick={handleBulkDelete} 
                disabled={isBulkSaving}
                className="whitespace-nowrap"
              >
                {isBulkSaving ? "Removing..." : "Remove Deadlines"}
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedEvents.size === events.length && events.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-1/3">Event Name</TableHead>
              <TableHead className="w-1/3">Deadline (Date & Time)</TableHead>
              <TableHead className="w-1/3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-black/70 py-6">Loading events...</TableCell>
              </TableRow>
            ) : (
                events.map(event => (
                  <TableRow 
                    key={event.eventId} 
                    className={`cursor-pointer transition-colors ${selectedEvents.has(event.eventName) ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-gray-50"}`}
                    onClick={() => toggleSelect(event.eventName)}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedEvents.has(event.eventName)}
                        onCheckedChange={() => toggleSelect(event.eventName)}
                      />
                    </TableCell>
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
                           Save
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
