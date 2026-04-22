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
        // prizeFirst: 1000,
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 2,
        eventName: "Dance Battle",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 3,
        eventName: "Duo Dance Freestyle",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 4,
        eventName: "Western Group Dance (Student)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 5,
        eventName: "Western Solo Dance",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },

    // ─────────────────────────────────────────
    // FACULTY  (eventNo 6–18)
    // ─────────────────────────────────────────
    {
        eventNo: 6,
        eventName: "Cooking Without Fire (Faculty)",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 7,
        eventName: "Group Dance (Faculty)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 8,
        eventName: "Group Ramp Walk (Faculty)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 9,
        eventName: "Group Song (Faculty)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 10,
        eventName: "Rangoli (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 11,
        eventName: "Solo Dance (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 12,
        eventName: "Solo Ramp Walk (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 13,
        eventName: "Voice of GAT (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 14,
        eventName: "Short Pitch Cricket (Faculty)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 15,
        eventName: "Pickle Ball (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 16,
        eventName: "Chess (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 17,
        eventName: "Carrom (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 18,
        eventName: "Slow Bike Race (Faculty)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },

    // ─────────────────────────────────────────
    // FASHION  (eventNo 19–20)
    // ─────────────────────────────────────────
    {
        eventNo: 19,
        eventName: "Group Ramp Walk (Student)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
        prizeFirst: 3000,
    },
    {
        eventNo: 20,
        eventName: "Solo Ramp Walk (Student)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
        prizeFirst: 500,
    },

    // ─────────────────────────────────────────
    // FINE ARTS  (eventNo 21–26)
    // ─────────────────────────────────────────
    {
        eventNo: 21,
        eventName: "Cartooning",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 22,
        eventName: "Clay Modelling",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 23,
        eventName: "Collage Making",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 24,
        eventName: "On Spot Painting",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 25,
        eventName: "On Spot Photography",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 26,
        eventName: "Rangoli (Student)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },

    // ─────────────────────────────────────────
    // GENERAL EVENTS  (eventNo 27–32)
    // ─────────────────────────────────────────
    {
        eventNo: 27,
        eventName: "Content Creation",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
        prizeFirst: 2000,
    },
    {
        eventNo: 28,
        eventName: "Cooking Without Fire (Student)",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 29,
        eventName: "Entertainment Quiz",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 30,
        eventName: "Face Painting",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 31,
        eventName: "Kannada Quiz",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 32,
        eventName: "Minute to Win it",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },

    // ─────────────────────────────────────────
    // LITERARY  (eventNo 33–37)
    // ─────────────────────────────────────────
    {
        eventNo: 33,
        eventName: "Debate",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 34,
        eventName: "Elocution",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 35,
        eventName: "On-Spot Creative Writing",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 36,
        eventName: "Pick and Speak",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 37,
        eventName: "Poetry",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },

    // ─────────────────────────────────────────
    // MUSIC  (eventNo 38–42)
    // ─────────────────────────────────────────
    {
        eventNo: 38,
        eventName: "Classical Solo Vocal",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 39,
        eventName: "Group Song (Student)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 40,
        eventName: "Instrumental Solo",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 41,
        eventName: "Voice of GAT (Student)",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 42,
        eventName: "Western Solo Vocal",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },

    // ─────────────────────────────────────────
    // SPORTS  (eventNo 43–52)
    // ─────────────────────────────────────────
    {
        eventNo: 43,
        eventName: "Carrom",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 44,
        eventName: "Chess",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 45,
        eventName: "Basketball (3v3)",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 46,
        eventName: "Deadlift",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 47,
        eventName: "Pickleball",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 48,
        eventName: "Short Pitch Cricket",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 49,
        eventName: "Throwball",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 50,
        eventName: "Treasure Hunt",
        pointsFirst: 7,
        pointsSecond: 5,
        pointsThird: 3,
    },
    {
        eventNo: 51,
        eventName: "Tug of War",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 52,
        eventName: "Volleyball",
        pointsFirst: 15,
        pointsSecond: 10,
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
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
    {
        eventNo: 62,
        eventName: "Mimicry",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 63,
        eventName: "Mono Acting",
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
    {
        eventNo: 64,
        eventName: "Skit",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },

    // ─────────────────────────────────────────
    // Updated  (eventNo 65)
    // ─────────────────────────────────────────
    {
        eventNo: 65,
        eventName: "Tug of War (FACULTY) (M & W)",
        pointsFirst: 15,
        pointsSecond: 10,
        pointsThird: 5,
    },
];