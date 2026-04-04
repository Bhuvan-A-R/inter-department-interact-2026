import { saveDateTimeOfArrival } from "@/app/prismaClient/queryFunction";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
    try {
        await saveDateTimeOfArrival(
            userId as string,
            dateOfArrival as string,
            timeOfArrival as string
        );
        return NextResponse.json(
            { success: true, message: "DateTime added" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Arrival date/time fields are not available in the current schema.",
            },
            { status: 400 }
        );
    }

    if (!dateOfArrival || !timeOfArrival) {
        return NextResponse.json(
            { success: false, message: "date /time is missing" },
            { status: 404 }
        );
    }

    try {
        await saveDateTimeOfArrival(
            userId,
            dateOfArrival as string,
            timeOfArrival as string
        );
        return NextResponse.json(
            { success: true, message: "saved successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error },
            { status: 400 }
        );
    }
}
