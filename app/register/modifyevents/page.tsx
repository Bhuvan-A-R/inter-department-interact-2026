"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { eventCategories } from "@/data/eventCategories";
import { LoadingButton } from "@/components/LoadingButton";
type RegisteredEvent = {
  id: string;
  eventNo: number;
  eventName: string;
  deptCode?: string | null;
  teamNumber?: number | null;
};

export default function EventRegister() {
  const router = useRouter();
  const [selectedEvents, setSelectedEvents] = useState<Record<number, number>>(
    {},
  );
  // const [responseBody, setResponseBody] = useState<object | null>(null);

  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deadlines, setDeadlines] = useState<Record<string, string>>({});
  const [blockedEvents, setBlockedEvents] = useState<string[]>([]);

  const handleDelete = async (id: string, name: string) => {
    setEventToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/deleteeventregister", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: eventToDelete.id }),
      });
      const data = await response.json();
      const message =
        typeof data?.message === "string"
          ? data.message
          : "Failed to delete event.";
      if (!response.ok) {
        toast.error(message);
        return;
      }
      setRegisteredEvents((prev) =>
        prev.filter((event) => event.id !== eventToDelete.id),
      );
      toast.success(message);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  useEffect(() => {
    async function fetchRegisteredEvents() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/getalleventregister", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setRegisteredEvents(data.userEvents);
      } catch (error) {
        console.error("Error fetching registered events:", error);
        toast.error("Failed to fetch registered events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRegisteredEvents();
  }, [selectedEvents]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch("/api/get-all-deadlines");
        if (response.ok) {
          const data = await response.json();
          setDeadlines(data.deadlines);
        }
      } catch (error) {
        console.error("Failed to fetch deadlines:", error);
      }
    };
    fetchDeadlines();
  }, []);

  const groupedEvents = React.useMemo(() => {
    const grouped: Record<string, typeof eventCategories> = {};

    eventCategories.forEach((evt) => {
      grouped[evt.category] = grouped[evt.category] || [];
      grouped[evt.category].push(evt);
    });

    return grouped;
  }, []);

  const categoryStats = React.useMemo(() => {
    const stats: Record<string, { upcoming: number; closed: number }> = {};
    const now = new Date();

    eventCategories.forEach((evt) => {
      const deadline = deadlines[evt.eventName];
      const isClosed = deadline && now > new Date(deadline);
      const isUpcoming = deadline && now < new Date(deadline);

      if (!stats[evt.category]) {
        stats[evt.category] = { upcoming: 0, closed: 0 };
      }
      if (isClosed) stats[evt.category].closed++;
      else if (isUpcoming) stats[evt.category].upcoming++;
    });

    return stats;
  }, [deadlines]);

  const toggleSelection = (eventNo: number) => {
    setSelectedEvents((prev) => {
      const next = { ...prev };
      if (next[eventNo]) {
        delete next[eventNo];
      } else {
        next[eventNo] = 1;
      }
      return next;
    });
  };

  const updateTeamCount = (eventNo: number, delta: number) => {
    setSelectedEvents((prev) => {
      if (!prev[eventNo]) return prev;
      const nextCount = Math.max(1, prev[eventNo] + delta);
      return { ...prev, [eventNo]: nextCount };
    });
  };

  const formatEventLabel = (event: RegisteredEvent) => {
    const dept = event.deptCode ? ` ${event.deptCode}` : "";
    const team = event.teamNumber ? ` Team ${event.teamNumber}` : "";
    return `${event.eventName}${dept}${team}`.trim();
  };

  const generateResponse = async () => {
    setIsLoading(true);
    try {
      const selectedEventList = eventCategories.filter(
        (event) => selectedEvents[event.eventNo],
      );
      if (selectedEventList.length === 0) {
        toast.error("Select at least one event.");
        return;
      }
      const eventPayload = selectedEventList.map((event) => ({
        eventNo: event.eventNo,
        eventName: event.eventName,
        category: event.category,
        maxParticipant: event.maxParticipant,
        amount: event.amount ?? 0,
        teamCount: selectedEvents[event.eventNo] ?? 1,
      }));
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/eventsregister",
        data: { events: eventPayload },
      };

      const response = await axios.request(config);
      if (response.status === 200 || response.status === 201) {
        console.log("Response successfully sent:", response.data);
        toast.success("Response sent successfully!");
        setSelectedEvents({});
      } else {
        console.error("Unexpected response status:", response.status);
        toast.error("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error while sending response:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Failed to register events.");
      } else {
        toast.error(
          "Failed to send response. Please check your connection or server.",
        );
      }
    } finally {
      setIsLoading(false);
      router.push("/register/getallregister");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="auth-shell py-16 px-4"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          },
        }}
      />
      <div className="w-full px-4 mt-20">
        <h1 className="text-3xl font-bold mb-2 text-foreground text-center">
          Event Registration
        </h1>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
            <span className="text-sm font-medium text-muted-foreground">Registration Closing Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></div>
            <span className="text-sm font-medium text-muted-foreground">Registration Closed</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Event Selection Section */}
          <div className="lg:w-2/3 w-full bg-card text-card-foreground shadow-2xl rounded-2xl">
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Select Your Events
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {Object.keys(groupedEvents).map((category) => {
                  const selectedCount = groupedEvents[category].filter(
                    (event) => selectedEvents[event.eventNo],
                  ).length;
                  const totalEvents = groupedEvents[category].length;

                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="flex justify-between items-center w-full px-4 py-2 text-left text-foreground hover:bg-secondary/80 rounded-lg transition-all duration-200">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="text-lg font-medium">
                            {category} ({totalEvents})
                          </span>
                          <div className="flex items-center gap-2">
                            {categoryStats[category]?.upcoming > 0 && (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-[10px] font-black shadow-sm">
                                {categoryStats[category].upcoming}
                              </div>
                            )}
                            {categoryStats[category]?.closed > 0 && (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-[10px] font-black shadow-sm">
                                {categoryStats[category].closed}
                              </div>
                            )}
                            {selectedCount > 0 && (
                              <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
                          {groupedEvents[category].map((event) => {
                            const isSelected = !!selectedEvents[event.eventNo];
                            const deadline = deadlines[event.eventName];
                            const now = new Date();
                            const isClosed = deadline && now > new Date(deadline);
                            const isUpcoming = deadline && now < new Date(deadline);
                            
                            const teamCount =
                              selectedEvents[event.eventNo] ?? 1;
                            return (
                              <motion.div
                                key={event.eventNo}
                                onClick={() =>
                                  !isClosed && toggleSelection(event.eventNo)
                                }
                                className={`p-4 border-2 rounded-lg shadow-md transition duration-300 ${
                                  isClosed
                                    ? "border-red-500 bg-red-50/30 opacity-90 cursor-not-allowed"
                                    : isSelected
                                      ? "border-primary bg-primary/10 cursor-pointer"
                                      : isUpcoming
                                        ? "border-yellow-500 bg-yellow-50/30 cursor-pointer"
                                        : "border-border bg-card hover:border-primary/50 cursor-pointer"
                                }`}
                                whileHover={!isClosed ? { scale: 1.03 } : {}}
                                whileTap={!isClosed ? { scale: 0.98 } : {}}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h3
                                    className={`text-lg font-semibold ${
                                      isClosed 
                                        ? "text-red-900" 
                                        : isUpcoming 
                                          ? "text-yellow-900" 
                                          : "text-foreground"
                                    }`}
                                  >
                                    {event.eventName}
                                  </h3>
                                  {isClosed ? (
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      Closed
                                    </span>
                                  ) : isUpcoming ? (
                                    <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      Upcoming
                                    </span>
                                  ) : null}
                                </div>
                                <p className={`text-sm ${
                                  isClosed 
                                    ? "text-red-700/70" 
                                    : isUpcoming 
                                      ? "text-yellow-700/70" 
                                      : "text-muted-foreground"
                                }`}>
                                  Max Participants:{" "}
                                  <span className={`font-medium ${
                                    isClosed 
                                      ? "text-red-900" 
                                      : isUpcoming 
                                        ? "text-yellow-900" 
                                        : "text-foreground"
                                  }`}>
                                    {event.maxParticipant}
                                  </span>
                                </p>
                                {isClosed ? (
                                  <div className="mt-3 py-1.5 px-2 bg-red-600 border border-red-700 rounded text-[11px] text-white font-bold text-center shadow-sm">
                                    Registration Deadline Passed
                                  </div>
                                ) : (
                                  <>
                                    {isUpcoming && (
                                      <div className="mt-3 py-1 px-2 bg-yellow-500 border border-yellow-600 rounded text-[10px] text-white font-bold text-center shadow-sm">
                                        Closing Soon: {new Date(deadline).toLocaleString("en-IN", { 
                                          dateStyle: "short", 
                                          timeStyle: "short" 
                                        })}
                                      </div>
                                    )}
                                    <div className="mt-3 flex items-center gap-3">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateTeamCount(event.eventNo, -1);
                                        }}
                                        disabled={!isSelected || teamCount <= 1}
                                      >
                                        -
                                      </Button>
                                      <span className="min-w-6 text-center font-medium">
                                        {teamCount}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateTeamCount(event.eventNo, 1);
                                        }}
                                        disabled={!isSelected}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>

          {/* Selected and Registered Events Section */}
          <div className="lg:w-1/3 w-full space-y-6">
            {/* Registered Events */}
            <div className="bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Registered Events
                  </h2>
                  {registeredEvents?.length > 0 && (
                    <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {registeredEvents?.length}
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {registeredEvents?.length > 0 ? (
                    registeredEvents?.map((event, index) => (
                      <li
                        key={event.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/80 transition-colors duration-200"
                      >
                        <span className="">
                          <span className="font-medium">{index + 1}. </span>
                          {formatEventLabel(event)}
                        </span>
                        <button
                          onClick={() =>
                            handleDelete(event.id, formatEventLabel(event))
                          }
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          disabled={isLoading}
                        >
                          &times;
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No events registered
                    </p>
                  )}
                </ul>
              </div>
            </div>

            {/* Selected Events */}
            <div className="bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Selected Events
                  </h2>
                  {Object.keys(selectedEvents).length > 0 && (
                    <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {Object.keys(selectedEvents).length}
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {Object.keys(selectedEvents).length > 0 ? (
                    eventCategories
                      .filter((event) => selectedEvents[event.eventNo])
                      .map((event, index) => (
                        <li
                          key={event.eventNo}
                          className="p-2 rounded-md hover:bg-secondary/80 transition-colors duration-200"
                        >
                          <span className="">
                            <span className="font-medium">{index + 1}. </span>
                            {event.eventName} (Teams:{" "}
                            {selectedEvents[event.eventNo]})
                          </span>
                        </li>
                      ))
                  ) : (
                    <p className="text-muted-foreground">No events selected</p>
                  )}
                </ul>
                <LoadingButton
                  loading={isLoading}
                  onClick={generateResponse}
                  disabled={Object.keys(selectedEvents).length === 0}
                  className="w-full auth-button"
                >
                  Submit
                </LoadingButton>
                <Button
                  variant="outline"
                  onClick={() => router.push("/register/getallregister")}
                  className="w-full mt-2 auth-button auth-button-secondary"
                >
                  View All Registrations
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete the event `{eventToDelete?.name}
                `
                <br />
                <br />
                <span className="text-red-500">
                  * If you delete the event, the participant will be removed
                  from the events. You can use the update menu to add events for
                  each registrant.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-border hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading ? "Loading..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
