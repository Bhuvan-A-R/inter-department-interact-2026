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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown } from "lucide-react";

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
};

type DashboardResponse = {
  summary: Summary;
  registrations: RegistrationRow[];
};

type EventSummary = {
  eventName: string;
  eventDate: string | null;
  count: number;
  registrations: RegistrationRow[];
};

type DepartmentSummary = {
  department: string;
  count: number;
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
    const map = new Map<string, EventSummary>();
    registrations.forEach((row) => {
      const key = getBaseEventName(row.eventName || "");
      if (!map.has(key)) {
        map.set(key, {
          eventName: key,
          eventDate: row.eventDate ?? null,
          count: 0,
          registrations: [],
        });
      }
      const entry = map.get(key)!;
      entry.count += 1;
      entry.registrations.push(row);
      if (!entry.eventDate && row.eventDate) {
        entry.eventDate = row.eventDate;
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.eventName.localeCompare(b.eventName),
    );
  }, [registrations]);

  const departmentSummaries = React.useMemo<DepartmentSummary[]>(() => {
    const map = new Map<string, DepartmentSummary>();
    registrations.forEach((row) => {
      const key = row.department || "Unknown";
      if (!map.has(key)) {
        map.set(key, { department: key, count: 0, registrations: [] });
      }
      const entry = map.get(key)!;
      entry.count += 1;
      entry.registrations.push(row);
    });
    return Array.from(map.values()).sort((a, b) =>
      a.department.localeCompare(b.department),
    );
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
            Total Events
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
      </div>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white/80 px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Event-wise Registrations</h2>
        </div>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Export</TableHead>
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
                    <TableCell className="font-medium">
                      {event.eventName}
                    </TableCell>
                    <TableCell>{event.count}</TableCell>
                    <TableCell>{formatValue(event.eventDate)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          exportEventRegistrations(event.eventName)
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
                <TableHead>Registrations</TableHead>
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
