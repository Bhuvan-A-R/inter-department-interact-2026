"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { eventCategories } from "@/data/eventCategories";
import { events as scheduledEvents } from "@/data/scheduleInterDepartment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

type EventBlock = {
  id: string;
  targetName: string;
  blockTime: string;
};

type EventDisplay = {
  eventId: number;
  eventName: string;
  category: string;
  date: string;
  timings: string;
};

const scheduleMap = new Map(
  scheduledEvents.map((event) => [
    event.eventName,
    { date: event.date, timings: event.timings },
  ]),
);

const allEvents: EventDisplay[] = eventCategories.map((event) => ({
  eventId: event.eventNo,
  eventName: event.eventName,
  category: event.category,
  date: scheduleMap.get(event.eventName)?.date ?? "TBA",
  timings: scheduleMap.get(event.eventName)?.timings ?? "TBA",
}));

type SortConfig = {
  key: "eventName" | "category" | "count" | "date" | null;
  direction: "asc" | "desc";
};

// Formats an ISO string to local YYYY-MM-DDThh:mm for datetime-local inputs
const formatForInput = (isoDate: string) => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

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
  const [eventCounts, setEventCounts] = React.useState<Record<string, number>>(
    {},
  );

  // State for user inputs per event (event name -> datetime string)
  const [inputs, setInputs] = React.useState<Record<string, string>>({});

  // Selection state for bulk actions
  const [selectedEvents, setSelectedEvents] = React.useState<Set<string>>(
    new Set(),
  );
  const [bulkInput, setBulkInput] = React.useState("");
  const [isBulkSaving, setIsBulkSaving] = React.useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: "eventName",
    direction: "asc",
  });

  const sortedEvents = React.useMemo(() => {
    const items = [...allEvents];
    if (sortConfig.key) {
      items.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === "count") {
          valA = eventCounts[a.eventName] || 0;
          valB = eventCounts[b.eventName] || 0;
        } else if (sortConfig.key === "date") {
          // Parse "27th April" -> 27, etc.
          const parseDay = (s: string) => parseInt(s) || 0;
          valA = parseDay(a.date);
          valB = parseDay(b.date);
        } else {
          valA = a[sortConfig.key!] || "";
          valB = b[sortConfig.key!] || "";
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [allEvents, sortConfig, eventCounts]);

  const requestSort = (key: SortConfig["key"]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortConfig["key"]) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "🔼" : "🔽";
  };

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
    if (selectedEvents.size === allEvents.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(allEvents.map((e) => e.eventName)));
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
      const promises = Array.from(selectedEvents).map((eventName) =>
        fetch("/api/admin/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetName: `Event: ${eventName}`,
            blockTime: bulkInput + "+05:30",
          }),
        }),
      );

      await Promise.all(promises);
      alert(
        `Successfully updated deadlines for ${selectedEvents.size} events.`,
      );
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
    if (
      !confirm(
        `Are you sure you want to remove deadlines for ${selectedEvents.size} selected events?`,
      )
    )
      return;

    setIsBulkSaving(true);
    try {
      const promises = Array.from(selectedEvents).map((eventName) =>
        fetch("/api/admin/blocks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetName: `Event: ${eventName}` }),
        }),
      );

      await Promise.all(promises);
      alert(
        `Successfully removed deadlines for ${selectedEvents.size} events.`,
      );
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
          blockTime: datetimeStr + "+05:30", // Explicitly mark as IST
        }),
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
    if (
      !confirm(`Are you sure you want to remove the deadline for ${eventName}?`)
    )
      return;
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName: `Event: ${eventName}` }),
      });
      if (res.ok) {
        setInputs((prev) => {
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
        <h2 className="text-3xl font-bold mb-2">
          Event Registration Deadlines
        </h2>
        <p className="text-black/70 mb-8">
          Manage the exact date and time registrations should visually and
          functionally close for each specific event. Events without a listed
          deadline will remain open indefinitely until overridden.
        </p>

        {/* Bulk Action Bar */}
        <div
          className={`mb-6 p-4 rounded-xl border transition-all ${selectedEvents.size > 0 ? "bg-blue-50 border-blue-200 opacity-100" : "bg-gray-50 border-gray-100 opacity-50 pointer-events-none"}`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-900">
                {selectedEvents.size} Events Selected
              </span>
              {selectedEvents.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvents(new Set())}
                  className="text-blue-700 hover:text-blue-900"
                >
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
                  checked={
                    selectedEvents.size === allEvents.length &&
                    allEvents.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead
                className="w-1/4 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => requestSort("eventName")}
              >
                <div className="flex items-center gap-1">
                  Event Name {getSortIcon("eventName")}
                </div>
              </TableHead>
              <TableHead
                className="w-1/6 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => requestSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category {getSortIcon("category")}
                </div>
              </TableHead>
              <TableHead
                className="w-1/6 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => requestSort("count")}
              >
                <div className="flex items-center gap-1">
                  Registrations {getSortIcon("count")}
                </div>
              </TableHead>
              <TableHead
                className="w-1/4 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Schedule {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead className="w-1/4">Deadline (Date & Time)</TableHead>
              <TableHead className="w-1/6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-black/70 py-6"
                >
                  Loading events...
                </TableCell>
              </TableRow>
            ) : (
              sortedEvents.map((event) => (
                <TableRow
                  key={event.eventId}
                  className={`cursor-pointer transition-colors ${selectedEvents.has(event.eventName) ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => toggleSelect(event.eventName)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedEvents.has(event.eventName)}
                      onCheckedChange={() => toggleSelect(event.eventName)}
                    />
                  </TableCell>
                  <TableCell className="font-bold text-base">
                    {event.eventName}
                  </TableCell>
                  <TableCell className="text-sm text-black/70">
                    {event.category}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      {eventCounts[event.eventName] || 0} Registered
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-black/70">
                    {event.date === "TBA"
                      ? "TBA"
                      : `${event.date} (${event.timings})`}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Input
                      type="datetime-local"
                      value={inputs[event.eventName] || ""}
                      onChange={(e) =>
                        setInputs({
                          ...inputs,
                          [event.eventName]: e.target.value,
                        })
                      }
                      className="w-full max-w-[250px]"
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-row items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveBlock(event.eventName)}
                      >
                        Save
                      </Button>
                      {!!inputs[event.eventName] && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBlock(event.eventName)}
                        >
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
