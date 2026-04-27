"use client";

import React, { useEffect, useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ArrowLeft, Save } from "lucide-react";
import { Event } from "@/app/register/addRegistrant/page";
import { participantFormSchema } from "@/lib/schemas/register";

type SelectRolesAndEventsProps = {
  allEvents: Event[];
};

export default function SelectRolesAndEvents({
  allEvents,
}: SelectRolesAndEventsProps) {
  const router = useRouter();
  const [selectedEvents, setSelectedEvents] = useState<
    {
      eventId: string;
      eventNo: number;
      eventName: string;
      teamNumber?: number | null;
      type: "PARTICIPANT";
    }[]
  >([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [deadlines, setDeadlines] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof participantFormSchema>>({
    resolver: zodResolver(participantFormSchema),
    defaultValues: {
      name: "",
      usn: "",
      phone: "",
      events: [],
      email: "",
      gender: null,
      blood: null,
      documents: {
        photo: null,
        idCard: null,
      },
    },
  });

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

  useEffect(() => {
    setValue("events", selectedEvents);
  }, [selectedEvents, setValue]);

  const onToggleSelect = (event: Event) => {
    setSelectedEvents((prev) => {
      const idx = prev.findIndex((item) => item.eventId === event.id);
      if (idx >= 0) {
        return prev.filter((item) => item.eventId !== event.id);
      }
      return [
        ...prev,
        {
          eventId: event.id,
          eventName: event.eventName,
          eventNo: event.eventNo,
          teamNumber: event.teamNumber ?? null,
          type: "PARTICIPANT",
        },
      ];
    });
  };

  const onParticipantSubmit = async (
    data: z.infer<typeof participantFormSchema>,
  ) => {
    const payload = {
      ...data,
      gender: null,
      blood: null,
      documents: {
        photo: null,
        idCard: null,
      },
    };
    setDisabled(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to register");
      }
      toast.success("Registered Successfully.");
      router.push("/register/getallregister");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred.");
      }
    } finally {
      setDisabled(false);
    }
  };

  const onParticipantError = (
    err: FieldErrors<z.infer<typeof participantFormSchema>>,
  ) => {
    console.log("Validation Error:", err);
    toast.error("Please fix the validation errors and try again.");
  };

  const groupedEvents = allEvents.reduce(
    (acc, ev) => {
      acc[ev.category] = acc[ev.category] || [];
      acc[ev.category].push(ev);
      return acc;
    },
    {} as Record<string, Event[]>,
  );

  const categoryStats = React.useMemo(() => {
    const stats: Record<string, { upcoming: number; closed: number }> = {};
    const now = new Date();

    allEvents.forEach((evt) => {
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
  }, [deadlines, allEvents]);

  const formatEventLabel = (event: Event) => {
    const dept = event.deptCode ? ` ${event.deptCode}` : "";
    const team = event.teamNumber ? ` Team ${event.teamNumber}` : "";
    return `${event.eventName}${dept}${team}`.trim();
  };

  return (
    <Card className="shadow-xl w-full px-10">
      <form onSubmit={handleSubmit(onParticipantSubmit, onParticipantError)}>
        <CardHeader>
          <CardTitle className="text-center text-[#D32F23] font-bold">
            Register (Participant)
          </CardTitle>
          <CardDescription className="text-center text-[#F4D03F] font-bold mb-4">
            Add details for Participant
          </CardDescription>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
              <span className="text-sm font-medium text-muted-foreground">Closing Soon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></div>
              <span className="text-sm font-medium text-muted-foreground">Registration Closed</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start">
              <div className="w-full md:w-1/3 space-y-1.5">
                <Label htmlFor="name">
                  Name of the Student
                  <span className="block font-normal"><small className="text-red-600">(As mentioned on 10th or any equivalent marks card)*</small></span>
                </Label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Full Name - will be printed in your certificate"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="w-full md:w-1/3 space-y-1.5">
                <Label htmlFor="usn">
                  USN of the Student 
                  <span className="block font-normal mt-1"><small className="text-red-600">(Should be in format 1GA22CS000)*</small></span>
                </Label>
                <Input
                  {...register("usn")}
                  id="usn"
                  placeholder="University Seat Number"
                />
                {errors.usn && (
                  <p className="text-red-500 text-sm">{errors.usn.message}</p>
                )}
              </div>
              <div className="w-full md:w-1/3 space-y-1.5">
                <Label htmlFor="phone">
                  Phone number of the Student{" "}
                  <span className="block font-normal mt-1"><small className="text-red-600">(Correct Number and it should be entered once)*</small></span>
                </Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-10 w-full items-start">
              <div className="w-full md:w-1/3 space-y-1.5">
                <Label htmlFor="email">
                  Email 
                  <span className="block font-normal mt-1"><small className="text-red-600">(Correct E-Mail and it should be entered once)*</small></span>
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  name="email"
                  placeholder="Enter the email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-4 rounded-md">
            <h2
              className="text-2xl font-semibold text-foreground mb-4"
              aria-label="Available events"
              tabIndex={0}
            >
              Select the events that you are Participating in
            </h2>
            <h2
              className="text-xl font-semibold text-foreground mb-4"
              aria-label="Available events"
              tabIndex={0}
            >
              Click on the event tile to confirm selection of the event
            </h2>

            {allEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground" role="status">
                No available events.
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(groupedEvents).map(([category, events]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline px-4">
                      <div className="flex items-center justify-between w-full pr-4 text-left">
                        <span className="text-lg font-medium">
                          {category} ({events.length})
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
                          {selectedEvents.filter(s => events.some(e => e.id === s.eventId)).length > 0 && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">
                              {selectedEvents.filter(s => events.some(e => e.id === s.eventId)).length}
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1.5">
                        {events.map((event) => {
                          const selectedObj = selectedEvents.find(
                            (item) => item.eventId === event.id,
                          );
                          const isSelected = !!selectedObj;
                          
                          const deadline = deadlines[event.eventName];
                          const now = new Date();
                          const isClosed = deadline && now > new Date(deadline);
                          const isUpcoming = deadline && now < new Date(deadline);

                          return (
                            <div
                              key={event.id}
                              role="button"
                              tabIndex={0}
                              aria-pressed={isSelected}
                              onClick={() => !isClosed && onToggleSelect(event)}
                              onKeyDown={(e) => {
                                if ((e.key === "Enter" || e.key === " ") && !isClosed) {
                                  onToggleSelect(event);
                                }
                              }}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 flex flex-col h-full ${
                                isClosed
                                  ? "border-red-500 bg-red-50/30 opacity-80 cursor-not-allowed"
                                  : isUpcoming
                                    ? "border-yellow-500 bg-yellow-50/30"
                                    : isSelected
                                      ? "border-primary bg-primary/10"
                                      : "border-border bg-card"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-lg font-semibold ${
                                  isClosed ? "text-red-900" : isUpcoming ? "text-yellow-900" : ""
                                }`}>
                                  {formatEventLabel(event)}
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
                              <div className="mt-auto space-y-2">
                                <div className="space-y-1">
                                  {event.minParticipant > 1 && (
                                    <p className={`text-sm font-medium ${isClosed ? "text-red-700/70" : "text-amber-600 dark:text-amber-400"}`}>
                                      Min: {event.minParticipant}
                                    </p>
                                  )}
                                  <p className={`text-sm ${isClosed ? "text-red-700/70" : "text-muted-foreground"}`}>
                                    Max: {event.maxParticipant}
                                  </p>
                                </div>
                                
                                {isClosed ? (
                                  <div className="py-1 px-2 bg-red-600 border border-red-700 rounded text-[10px] text-white font-bold text-center">
                                    Registration Closed
                                  </div>
                                ) : isUpcoming && (
                                  <div className="py-1 px-2 bg-yellow-500 border border-yellow-600 rounded text-[10px] text-white font-bold text-center">
                                    Closing Soon: {new Date(deadline).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {errors.events && (
              <p className="text-red-500 text-sm">{errors.events.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-5">
          <Button className="px-8 text-xl" type="submit" disabled={disabled}>
            <Save className="w-5 h-5 mr-2" /> Save
          </Button>

          <Link href="/register/getallregister">
            <Button
              variant="outline"
              className="border hover:border-primary px-8 text-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
