export interface EventPrizeData {
    eventNo: number;
    eventName: string;
    prizeFirst?: number;
    prizeSecond?: number;
    prizeThird?: number;
    pointsFirst: number;
    pointsSecond: number;
    pointsThird: number;
}

export const eventPrizeData: EventPrizeData[] = [

    // ─────────────────────────────────────────
    // DANCE  (eventNo 1–5)
    // ─────────────────────────────────────────
    {
        eventNo: 1,
        eventName: "Classical Solo Dance",
        prizeFirst: 1000,
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 2,
        eventName: "Dance Battle",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 3,
        eventName: "Duo Dance Freestyle",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 4,
        eventName: "Western Group Dance (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 5,
        eventName: "Western Solo Dance",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // FACULTY  (eventNo 6–18)
    // ─────────────────────────────────────────
    {
        eventNo: 6,
        eventName: "Cooking Without Fire (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 7,
        eventName: "Group Dance (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 8,
        eventName: "Group Ramp Walk (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 9,
        eventName: "Group Song (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 10,
        eventName: "Rangoli (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 11,
        eventName: "Solo Dance (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 12,
        eventName: "Solo Ramp Walk (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 13,
        eventName: "Voice of GAT (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 14,
        eventName: "Short Pitch Cricket (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 15,
        eventName: "Pickle Ball (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 16,
        eventName: "Chess (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 17,
        eventName: "Carrom (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 18,
        eventName: "Slow Bike Race (Faculty)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // FASHION  (eventNo 19–20)
    // ─────────────────────────────────────────
    {
        eventNo: 19,
        eventName: "Group Ramp Walk (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 20,
        eventName: "Solo Ramp Walk (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // FINE ARTS  (eventNo 21–26)
    // ─────────────────────────────────────────
    {
        eventNo: 21,
        eventName: "Cartooning",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 22,
        eventName: "Clay Modelling",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 23,
        eventName: "Collage Making",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 24,
        eventName: "On Spot Painting",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 25,
        eventName: "On Spot Photography",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 26,
        eventName: "Rangoli (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // GENERAL EVENTS  (eventNo 27–32)
    // ─────────────────────────────────────────
    {
        eventNo: 27,
        eventName: "Content Creation",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 28,
        eventName: "Cooking Without Fire (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 29,
        eventName: "Entertainment Quiz",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 30,
        eventName: "Face Painting",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 31,
        eventName: "Kannada Quiz",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 32,
        eventName: "Minute to Win it",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // LITERARY  (eventNo 33–37)
    // ─────────────────────────────────────────
    {
        eventNo: 33,
        eventName: "Debate",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 34,
        eventName: "Elocution",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 35,
        eventName: "On-Spot Creative Writing",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 36,
        eventName: "Pick and Speak",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 37,
        eventName: "Poetry",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // MUSIC  (eventNo 38–42)
    // ─────────────────────────────────────────
    {
        eventNo: 38,
        eventName: "Classical Solo Vocal",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 39,
        eventName: "Group Song (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 40,
        eventName: "Instrumental Solo",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 41,
        eventName: "Voice of GAT (Student)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 42,
        eventName: "Western Solo Vocal",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // SPORTS  (eventNo 43–52)
    // ─────────────────────────────────────────
    {
        eventNo: 43,
        eventName: "Carrom",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 44,
        eventName: "Chess",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 45,
        eventName: "Basketball (3v3)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 46,
        eventName: "Deadlift",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 47,
        eventName: "Pickleball",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 48,
        eventName: "Short Pitch Cricket",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 49,
        eventName: "Throwball",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 50,
        eventName: "Treasure Hunt",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 51,
        eventName: "Tug of War",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 52,
        eventName: "Volleyball",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // TECHNICAL  (eventNo 53–60)
    // ─────────────────────────────────────────
    {
        eventNo: 53,
        eventName: "AI Reel Contest",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 54,
        eventName: "Debug the Bug",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 55,
        eventName: "E-sports",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 56,
        eventName: "Frontend Frenzy",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 57,
        eventName: "Glow Up: ID Edition",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 58,
        eventName: "Re-brand it & Slay it!",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 59,
        eventName: "Shark-Tank Pitch",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 60,
        eventName: "Technical Quiz (Brain Brawl)",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // THEATRE  (eventNo 61–64)
    // ─────────────────────────────────────────
    {
        eventNo: 61,
        eventName: "Mime",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 62,
        eventName: "Mimicry",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 63,
        eventName: "Mono Acting",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
    {
        eventNo: 64,
        eventName: "Skit",
        pointsFirst: 10,
        pointsSecond: 7,
        pointsThird: 5,
    },
];