export interface EventPrizeData {
    eventNo: number;
    eventName: string;
    prizeFirst?: number;
    prizeSecond?: number;
    prizeThird?: number;
    pointsFirst: number;
    pointsSecond?: number;
    pointsThird?: number;
}

export const eventPrizes: EventPrizeData[] = [
    {
        eventNo: 1,
        eventName: "Classical Solo Dance",
        prizeFirst: 1000,
        // prizeSecond: 600,
        // prizeThird: 400,
        pointsFirst: 5,
        pointsSecond: 3,
        pointsThird: 1,
    },
];
