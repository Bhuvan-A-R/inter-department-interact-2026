"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { EventCategory } from "@/data/eventCategories";

interface SelectYourEventsProps {
  allEvents: EventCategory[];
  selectedEvents: number[];
  onToggleSelect: (eventNo: number) => void;
  isDisabled: boolean;
}

const SelectYourEvents: React.FC<SelectYourEventsProps> = ({
  allEvents,
  selectedEvents,
  onToggleSelect,
  isDisabled,
}) => {
  const [deadlines, setDeadlines] = useState<Record<string, string>>({});

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
    return allEvents.reduce<Record<string, EventCategory[]>>((acc, evt) => {
      acc[evt.category] = acc[evt.category] || [];
      acc[evt.category].push(evt);
      return acc;
    }, {});
  }, [allEvents]);

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

  return (
    <div className="bg-card text-card-foreground shadow-2xl rounded-2xl p-6">
      <h2
        className="text-2xl font-semibold text-foreground mb-2"
        aria-label="Available events"
        tabIndex={0}
      >
        Select Your Events
      </h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
          <span className="text-sm font-medium text-muted-foreground">Closing Soon</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></div>
          <span className="text-sm font-medium text-muted-foreground">Registration Closed</span>
        </div>
      </div>

      {allEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground" role="status">
          No available events.
        </p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(groupedEvents).map(([category, events]) => {
            const selectedCount = events.filter((evt) =>
              selectedEvents.includes(evt.eventNo),
            ).length;
            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger
                  className="flex justify-between items-center w-full px-4 py-2 text-left rounded-lg hover:bg-secondary/80 transition-all duration-200"
                  aria-label={`Show or hide events for ${category}`}
                >
                  <div className="flex items-center justify-between w-full pr-4">
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
                      {selectedCount > 0 && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm">
                          {selectedCount}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
                    {events.map((event) => {
                      const isSelected = selectedEvents.includes(event.eventNo);
                      const deadline = deadlines[event.eventName];
                      const now = new Date();
                      const isClosed = deadline && now > new Date(deadline);
                      const isUpcoming = deadline && now < new Date(deadline);

                      return (
                        <div
                          key={event.eventNo}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          aria-label={`Select or deselect ${event.eventName}`}
                          onClick={() =>
                            !isDisabled && !isClosed && onToggleSelect(event.eventNo)
                          }
                          onKeyDown={(e) => {
                            if (
                              !isDisabled &&
                              !isClosed &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              onToggleSelect(event.eventNo);
                            }
                          }}
                          className={`p-4 border-2 rounded-lg shadow-md transition duration-300 outline-none focus:ring-2 focus:ring-blue-500 flex flex-col h-full ${
                            isClosed
                              ? "border-red-500 bg-red-50/30 opacity-80 cursor-not-allowed"
                              : isUpcoming
                                ? "border-yellow-500 bg-yellow-50/30"
                                : isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-card hover:border-blue-200"
                          } ${
                            !isDisabled && !isClosed ? "cursor-pointer" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-lg font-semibold ${
                              isClosed ? "text-red-900" : isUpcoming ? "text-yellow-900" : "text-foreground"
                            }`}>
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
                          <div className="mt-auto space-y-2">
                            <p className={`text-sm ${isClosed ? "text-red-700/70" : "text-muted-foreground"}`}>
                              Max Participants:{" "}
                              <span className={`font-medium ${isClosed ? "text-red-900" : "text-foreground"}`}>
                                {event.maxParticipant}
                              </span>
                            </p>
                            
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
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default SelectYourEvents;

