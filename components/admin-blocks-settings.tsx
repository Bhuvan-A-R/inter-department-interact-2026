"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { events } from "@/data/scheduleInterDepartment";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EventBlock = {
  id: string;
  targetName: string;
  blockTime: string;
};

export default function AdminBlocksSettings() {
  const [blocks, setBlocks] = React.useState<EventBlock[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [selectedTarget, setSelectedTarget] = React.useState<string>("");
  const [selectedBlockTime, setSelectedBlockTime] = React.useState<string>("");

  const dates = [...new Set(events.map(e => e.date))];
  const eventNames = [...new Set(events.map(e => e.eventName))];

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/admin/blocks");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks);
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

  const handleSaveBlock = async () => {
    if (!selectedTarget || !selectedBlockTime) {
      alert("Please select a target and block time.");
      return;
    }
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName: selectedTarget, blockTime: selectedBlockTime })
      });
      if (res.ok) {
        alert("Block time saved successfully.");
        fetchBlocks();
      } else {
        const err = await res.json();
        alert("Error saving: " + err.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlock = async (targetName: string) => {
    if (!confirm(`Are you sure you want to remove the block for ${targetName}?`)) return;
    try {
      const res = await fetch("/api/admin/blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName })
      });
      if (res.ok) {
        fetchBlocks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 text-black">
      <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Registration Blocks & Deadlines</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={selectedTarget} onValueChange={setSelectedTarget}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select specify Date or Event" />
            </SelectTrigger>
            <SelectContent>
              <optgroup label="By Date">
                {dates.map(date => (
                  <SelectItem key={`date-${date}`} value={`Date: ${date}`}>{date} (Whole Day)</SelectItem>
                ))}
              </optgroup>
              <optgroup label="By Specific Event">
                {eventNames.map(name => (
                  <SelectItem key={`event-${name}`} value={`Event: ${name}`}>{name}</SelectItem>
                ))}
              </optgroup>
            </SelectContent>
          </Select>
          <Input 
            type="datetime-local" 
            value={selectedBlockTime} 
            onChange={e => setSelectedBlockTime(e.target.value)} 
            className="w-full md:w-[250px]"
          />
          <Button onClick={handleSaveBlock}>Set Block Deadline</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target (Date or Event)</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-black/70">Loading blocks...</TableCell>
              </TableRow>
            ) : blocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-black/70">No active blocks.</TableCell>
              </TableRow>
            ) : (
              blocks.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.targetName}</TableCell>
                  <TableCell>{new Date(b.blockTime).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteBlock(b.targetName)}>Remove</Button>
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
