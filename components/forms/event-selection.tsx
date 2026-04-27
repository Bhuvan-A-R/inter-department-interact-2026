"use client";

import { Card } from "@/components/ui/card";
import { EVENTS_CATEGORIES } from "@/lib/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface Event {
  name: string;
  attended: boolean;
}

interface EventSelectionProps {
  events: Event[];
  onChange: (events: Event[]) => void;
}

export function EventSelection({ events, onChange }: EventSelectionProps) {
  const [blockedEvents, setBlockedEvents] = useState<string[]>([]);

  useEffect(() => {
    const fetchBlockedEvents = async () => {
      try {
        const response = await fetch("/api/get-blocked-events");
        if (response.ok) {
          const data = await response.json();
          setBlockedEvents(data.blockedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch blocked events:", error);
      }
    };
    fetchBlockedEvents();
  }, []);

  const handleEventChange = (eventName: string, checked: boolean) => {
    // Don't allow selecting blocked events
    if (blockedEvents.includes(eventName) && checked) {
      return;
    }

    const existingEvent = events.find((e) => e.name === eventName);

    if (existingEvent) {
      const updatedEvents = events.map((event) =>
        event.name === eventName ? { ...event, attended: checked } : event,
      );
      onChange(updatedEvents);
    } else {
      onChange([...events, { name: eventName, attended: checked }]);
    }
  };

  const isEventSelected = (eventName: string) => {
    return events.some((event) => event.name === eventName && event.attended);
  };

  const isEventBlocked = (eventName: string) => {
    return blockedEvents.includes(eventName);
  };

  const categories = Object.entries(EVENTS_CATEGORIES);
  const midpoint = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, midpoint);
  const rightCategories = categories.slice(midpoint);

  const CategorySection = ({
    categories,
  }: {
    categories: [string, readonly string[]][];
  }) => (
    <div className="space-y-6">
      {categories.map(([category, categoryEvents]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-lg font-semibold text-primary">{category}</h4>
          <div className="space-y-2">
            {categoryEvents.map((eventName) => {
              const blocked = isEventBlocked(eventName);
              return (
                <div
                  key={eventName}
                  className={`flex items-center space-x-2 pl-4 py-1 rounded-md transition-colors ${
                    blocked
                      ? "opacity-50 cursor-not-allowed bg-gray-100"
                      : "hover:bg-accent cursor-pointer"
                  }`}
                >
                  <Checkbox
                    id={eventName}
                    checked={isEventSelected(eventName)}
                    disabled={blocked}
                    onCheckedChange={(checked) =>
                      handleEventChange(eventName, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={eventName}
                    className={`text-sm flex-1 ${
                      blocked ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {eventName}
                    {blocked && (
                      <span className="text-red-500 text-xs ml-2">
                        (Registration Closed)
                      </span>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Select Events</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <CategorySection categories={leftCategories} />
        </div>
        <div className="border-l pl-6">
          <CategorySection categories={rightCategories} />
        </div>
      </div>
    </Card>
  );
}
