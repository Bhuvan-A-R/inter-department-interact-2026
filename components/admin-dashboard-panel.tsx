"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Summary = {
  totalStudents: number;
  totalEvents: number;
  activeDepartments: number;
};

type RegistrationRow = {
  registrantId: string;
  studentName: string;
  rollNo: string;
  department: string | null;
  email: string;
  phone: string | null;
  eventName: string;
  eventDate: string | null;
  registrationDate: string | null;
  eventId: number | null;
  domain: string | null;
};

type DashboardResponse = {
  summary: Summary;
  registrations: RegistrationRow[];
};

type EventSummary = {
  eventName: string;
  eventDate: string | null;
  count: number;
  participantCount: number;
  registrations: RegistrationRow[];
  eventId: number | null;
  domain: string | null;
  departmentTeams?: Record<string, number>;
};

type DepartmentSummary = {
  department: string;
  count: number;
  participantCount: number;
  registrations: RegistrationRow[];
};

const safeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const exportToExcel = (
  filename: string,
  headers: string[],
  rows: string[][],
) => {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Calculate column widths
  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    rows.forEach(row => {
      const val = row[i] ? String(row[i]).length : 0;
      if (val > maxLen) maxLen = val;
    });
    return { wch: maxLen + 2 }; // Add some padding
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
  XLSX.writeFile(workbook, filename);
};

const formatValue = (value: string | null) => value ?? "N/A";

const getBaseEventName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "Unknown Event";
  const matchIndex = trimmed.toLowerCase().indexOf(" 1ga");
  if (matchIndex === -1) return trimmed;
  return trimmed.slice(0, matchIndex).trim() || "Unknown Event";
};

const getTeamName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "N/A";
  const matchIndex = trimmed.toLowerCase().indexOf(" 1ga");
  if (matchIndex === -1) return "N/A";
  const team = trimmed.slice(matchIndex + 1).trim();
  return team || "N/A";
};

export default function AdminDashboardPanel() {
  const [data, setData] = React.useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [syncing, setSyncing] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof EventSummary;
    direction: "asc" | "desc";
  } | null>({ key: "eventId", direction: "asc" });

  const requestSort = (key: keyof EventSummary) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSyncToSheets = async (clear = false) => {
    setSyncing(true);
    try {
      const response = await fetch(`/api/admin/sync-sheets${clear ? "?clear=true" : ""}`, {
        method: "POST",
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.data?.message || "Synced successfully!");
      } else {
        toast.error(result.error?.message || "Sync failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during sync.");
    } finally {
      setSyncing(false);
    }
  };

  React.useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/admin/registration-dashboard", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch admin registration data");
        }
        const payload = (await response.json()) as DashboardResponse;
        if (isMounted) {
          setData(payload);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const registrations = data?.registrations ?? [];

  const eventSummaries = React.useMemo<EventSummary[]>(() => {
    const map = new Map<string, { summary: EventSummary; teams: Set<string>; deptTeams: Map<string, Set<string>> }>();
    registrations.forEach((row) => {
      const key = getBaseEventName(row.eventName || "");
      if (!map.has(key)) {
        map.set(key, {
          summary: {
            eventName: key,
            eventDate: row.eventDate ?? null,
            count: 0,
            participantCount: 0,
            registrations: [],
          },
          teams: new Set<string>(),
          deptTeams: new Map<string, Set<string>>(),
        });
      }
      const entry = map.get(key)!;
      entry.summary.registrations.push(row);
      entry.summary.participantCount += 1;
      if (!entry.summary.eventId && row.eventId) {
        entry.summary.eventId = row.eventId;
      }
      if (!entry.summary.domain && row.domain) {
        entry.summary.domain = row.domain;
      }
      if (row.eventName) {
        entry.teams.add(row.eventName);
        const dept = row.department || "Unknown";
        if (!entry.deptTeams.has(dept)) {
          entry.deptTeams.set(dept, new Set<string>());
        }
        entry.deptTeams.get(dept)!.add(row.eventName);
      }
      if (!entry.summary.eventDate && row.eventDate) {
        entry.summary.eventDate = row.eventDate;
      }
    });
    const summaries = Array.from(map.values()).map((e) => {
      const departmentTeams: Record<string, number> = {};
      e.deptTeams.forEach((teams, dept) => {
        departmentTeams[dept] = teams.size;
      });
      return {
        ...e.summary,
        count: e.teams.size,
        departmentTeams,
      };
    });

    if (sortConfig !== null) {
      summaries.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return summaries;
  }, [registrations, sortConfig]);

  const departmentSummaries = React.useMemo<DepartmentSummary[]>(() => {
    const map = new Map<string, { summary: DepartmentSummary; teams: Set<string> }>();
    registrations.forEach((row) => {
      const key = row.department || "Unknown";
      if (!map.has(key)) {
        map.set(key, {
          summary: { department: key, count: 0, participantCount: 0, registrations: [] },
          teams: new Set<string>(),
        });
      }
      const entry = map.get(key)!;
      entry.summary.registrations.push(row);
      entry.summary.participantCount += 1;
      if (row.eventName) {
        entry.teams.add(row.eventName);
      }
    });
    return Array.from(map.values())
      .map((e) => ({
        ...e.summary,
        count: e.teams.size,
      }))
      .sort((a, b) => a.department.localeCompare(b.department));
  }, [registrations]);

  const exportEventRegistrations = (eventName: string) => {
    const selected = eventSummaries.find(
      (item) => item.eventName === eventName,
    );
    if (!selected) return;
    const rows = selected.registrations.map((row) => [
      row.studentName,
      row.rollNo,
      formatValue(row.department),
      getTeamName(row.eventName),
      row.email,
      formatValue(row.phone),
      formatValue(row.registrationDate),
    ]);
    exportToExcel(
      `${safeFileName(eventName)}_registrations.xlsx`,
      [
        "Student Name",
        "Roll No",
        "Department",
        "Team",
        "Email",
        "Phone",
        "Registration Date",
      ],
      rows,
    );
  };

  const exportDepartmentRegistrations = (department: string) => {
    const selected = departmentSummaries.find(
      (item) => item.department === department,
    );
    if (!selected) return;
    const rows = selected.registrations.map((row) => [
      row.studentName,
      row.rollNo,
      row.eventName,
      getTeamName(row.eventName),
      row.email,
      formatValue(row.phone),
      formatValue(row.registrationDate),
    ]);
    exportToExcel(
      `${safeFileName(department)}_registrations.xlsx`,
      [
        "Student Name",
        "Roll No",
        "Event Name",
        "Team",
        "Email",
        "Phone",
        "Registration Date",
      ],
      rows,
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-black">
        <p className="text-lg">Loading registration dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-black">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-black">
        <p className="text-lg">No registration data available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 text-black">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white/80 px-5 py-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-black/70">
            Total Students Registered
          </p>
          <p className="mt-2 text-3xl font-bold text-black">
            {data.summary.totalStudents}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/80 px-5 py-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-black/70">
            Total Teams Registered
          </p>
          <p className="mt-2 text-3xl font-bold text-black">
            {data.summary.totalEvents}
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white/80 px-5 py-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-black/70">
            Active Departments
          </p>
          <p className="mt-2 text-3xl font-bold text-black">
            {data.summary.activeDepartments}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" /> Export by Event
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 overflow-auto">
            {eventSummaries.length === 0 ? (
              <DropdownMenuItem disabled>No events found</DropdownMenuItem>
            ) : (
              eventSummaries.map((event) => (
                <DropdownMenuItem
                  key={event.eventName}
                  onClick={() => exportEventRegistrations(event.eventName)}
                >
                  {event.eventName}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" /> Export by Department
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 overflow-auto">
            {departmentSummaries.length === 0 ? (
              <DropdownMenuItem disabled>No departments found</DropdownMenuItem>
            ) : (
              departmentSummaries.map((dept) => (
                <DropdownMenuItem
                  key={dept.department}
                  onClick={() => exportDepartmentRegistrations(dept.department)}
                >
                  {dept.department}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => handleSyncToSheets(false)}
          disabled={syncing}
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync to Sheets"}
        </Button>

        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => {
            if (confirm("Are you sure? This will delete all existing event tabs and recreate them.")) {
              handleSyncToSheets(true);
            }
          }}
          disabled={syncing}
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Clearing..." : "Clear & Sync to Sheets"}
        </Button>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white/80 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Event-wise Registrations</h2>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-black/5 text-center"
                  onClick={() => requestSort("eventId")}
                >
                  # {sortConfig?.key === "eventId" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-black/5"
                  onClick={() => requestSort("domain")}
                >
                  Domain {sortConfig?.key === "domain" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-black/5"
                  onClick={() => requestSort("eventName")}
                >
                  Event Name {sortConfig?.key === "eventName" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-black/5"
                  onClick={() => requestSort("count")}
                >
                  Teams {sortConfig?.key === "count" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-black/5"
                  onClick={() => requestSort("participantCount")}
                >
                  Participants {sortConfig?.key === "participantCount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-black/5"
                  onClick={() => requestSort("eventDate")}
                >
                  Date {sortConfig?.key === "eventDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-black/70">
                    No event registrations found.
                  </TableCell>
                </TableRow>
              ) : (
                eventSummaries.map((event) => (
                  <TableRow key={event.eventName}>
                    <TableCell className="text-center text-black/50">
                      {event.eventId || "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-black/60">
                      {event.domain || "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.eventName}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="cursor-pointer underline decoration-dotted underline-offset-4 text-blue-600 hover:text-blue-800">
                            {event.count}
                          </span>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Department-wise Teams for {event.eventName}</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-2 mt-4 text-sm">
                            {event.departmentTeams && Object.keys(event.departmentTeams).length > 0 ? (
                              Object.entries(event.departmentTeams)
                                .sort((a, b) => b[1] - a[1]) // Sort by count desc
                                .map(([dept, count]) => (
                                <div key={dept} className="flex justify-between items-center py-2 border-b last:border-0">
                                  <span className="font-medium">{dept}</span>
                                  <span className="bg-black/10 px-2 py-1 rounded-md font-semibold">{count}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No departments found.</p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{event.participantCount}</TableCell>
                    <TableCell>{formatValue(event.eventDate)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          exportEventRegistrations(event.eventName)
                        }
                      >
                        Excel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white/80 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">
            Department-wise Registrations
          </h2>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Export</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentSummaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-black/70">
                    No department registrations found.
                  </TableCell>
                </TableRow>
              ) : (
                departmentSummaries.map((dept) => (
                  <TableRow key={dept.department}>
                    <TableCell className="font-medium">
                      {dept.department}
                    </TableCell>
                    <TableCell>{dept.count}</TableCell>
                    <TableCell>{dept.participantCount}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          exportDepartmentRegistrations(dept.department)
                        }
                      >
                        Download Excel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
