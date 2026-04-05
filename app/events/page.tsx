import React from "react";
import { eventCategories } from "@/data/eventCategories";

const EventPage = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Header */}
      <header className="relative py-24 md:py-32 text-center bg-gradient-to-b from-background to-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-primary font-bold text-4xl md:text-6xl xl:text-7xl mb-6">
            Events
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Welcome to the Events Page! Dive into the world of creativity,
            passion, and competition.
          </p>
        </div>
      </header>

      {/* Event Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {Object.entries(
          eventCategories.reduce<Record<string, typeof eventCategories>>(
            (acc, event) => {
              acc[event.category] = acc[event.category] || [];
              acc[event.category].push(event);
              return acc;
            },
            {},
          ),
        ).map(([category, events]) => (
          <section key={category} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                {category.replace(/_/g, " ")}
              </h2>
              <span className="text-sm md:text-base text-muted-foreground">
                {events.length} events
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.eventNo}
                  className="bg-card p-6 rounded-xl shadow-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary">
                      Event #{event.eventNo}
                    </span>
                    {/* <span className="text-xs text-muted-foreground">
                      Max {event.maxParticipant}
                    </span> */}
                  </div>
                  <h3 className="text-foreground font-semibold text-lg mb-2">
                    {event.eventName}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Participants: {event.maxParticipant}</span>
                    <span>Fee: {event.amount ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
