export interface Event {
  eventId: number;
  domain: string;
  eventName: string;
  venue: string;
  date: string;
  timings: string;
}

export const events: Event[] = [
  
  {
    eventId: 7,
    domain: "FACULTY",
    eventName: "Group Dance (Faculty)",
    venue: "Quadrangle Stage",
    date: "27th April",
    timings: "3pm to 5pm",
  },
  {
    eventId: 11,
    domain: "FACULTY",
    eventName: "Solo Dance (Faculty)",
    venue: "AIB 101",
    date: "27th April",
    timings: "2pm to 3pm",
  },
  {
    eventId: 22,
    domain: "FINE_ARTS",
    eventName: "Clay Modelling",
    venue: "Civil FM Lab",
    date: "27th April",
    timings: "2pm to 4pm",
  },
  {
    eventId: 25,
    domain: "FINE_ARTS",
    eventName: "On Spot Photography",
    venue: "Main Building 316",
    date: "27th April",
    timings: "1pm to 4pm",
  },
  {
    eventId: 33,
    domain: "LITERARY",
    eventName: "Debate",
    venue: "Silver Jubilee Presentation Hall / SJB - 001",
    date: "27th April",
    timings: "2pm to 4pm",
  },
  {
    eventId: 34,
    domain: "LITERARY",
    eventName: "Elocution",
    venue: "Main Buliding 316",
    date: "27th April",
    timings: "1pm to 3pm",
  },
  {
    eventId: 35,
    domain: "LITERARY",
    eventName: "Pick and Speak",
    venue: "Main Buliding 315",
    date: "27th April",
    timings: "1pm to 3pm",
  },
  {
    eventId: 37,
    domain: "LITERARY",
    eventName: "On-Spot Creative Visual Writing",
    venue: "Main Building 202",
    date: "27th April",
    timings: "4pm to 5pm",
  },
  {
    eventId: 55,
    domain: "TECHNICAL",
    eventName: "E-sports",
    venue: "Main Building 302 and 306",
    date: "27th April",
    timings: "2pm to 4pm",
  },
  {
    eventId: 56,
    domain: "TECHNICAL",
    eventName: "Frontend Frenzy",
    venue: "Main Building 208",
    date: "27th April",
    timings: "2pm to 4pm",
  },
  {
    eventId: 57,
    domain: "TECHNICAL",
    eventName: "Glow Up: ID Edition",
    venue: "Main Building 311",
    date: "27th April",
    timings: "2pm to 4pm",
  },
  {
    eventId: 59,
    domain: "TECHNICAL",
    eventName: "Shark-Tank Pitch",
    venue: "AIB 201 and 202",
    date: "27th April",
    timings: "3pm to 5pm",
  },
  {
    eventId: 62,
    domain: "THEATRE",
    eventName: "Mimicry",
    venue: "Main Building 416",
    date: "27th April",
    timings: "1pm to 2pm",
  },
  {
    eventId: 63,
    domain: "THEATRE",
    eventName: "Mono Acting",
    venue: "AIB 201",
    date: "27th April",
    timings: "1pm to 2pm",
  },
  {
    eventId: 64,
    domain: "THEATRE",
    eventName: "Skit",
    venue: "Auditorium",
    date: "27th April",
    timings: "2pm to 4pm",
  },
];

export const domains = [...new Set(events.map((e) => e.domain))];

export function getEventsByDomain(domain: string): Event[] {
  return events.filter((e) => e.domain === domain);
}

export function getEventsByDate(date: string): Event[] {
  return events.filter((e) => e.date === date);
}

export function getEventById(id: number): Event | undefined {
  return events.find((e) => e.eventId === id);
}