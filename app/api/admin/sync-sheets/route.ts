import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySession } from "@/lib/session";
import { google } from "googleapis";

// Helper to get base event name
const getBaseEventName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "Unknown Event";
  const matchIndex = trimmed.toLowerCase().indexOf(" 1ga");
  if (matchIndex === -1) return trimmed;
  return trimmed.slice(0, matchIndex).trim() || "Unknown Event";
};

// Helper to get team name
const getTeamName = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "N/A";
  const matchIndex = trimmed.toLowerCase().indexOf(" 1ga");
  if (matchIndex === -1) return "N/A";
  const team = trimmed.slice(matchIndex + 1).trim();
  return team || "N/A";
};

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clearMode = searchParams.get("clear") === "true";

    const session = await verifySession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // 1. Fetch all registrations
    const eventRegistrations = await prisma.eventRegistrations.findMany({
      include: {
        event: true,
        registrant: {
          include: {
            user: true,
          },
        },
      },
    });

    // 2. Group by base event name
    const groupedData = new Map<string, any[]>();
    eventRegistrations.forEach((entry) => {
      const baseEventName = entry.event?.eventName || "Unknown Event";
      
      if (!groupedData.has(baseEventName)) {
        groupedData.set(baseEventName, []);
      }
      
      const registrantDept = entry.registrant.deptCode || entry.registrant.user?.deptCode || "N/A";
      
      // Construct team identifier: "DeptCode Team TeamNumber"
      const eventDeptCode = entry.event?.deptCode || "";
      const teamNumber = entry.event?.teamNumber || 1;
      const teamIdentifier = `${eventDeptCode} Team ${teamNumber}`.trim() || "N/A";

      groupedData.get(baseEventName)?.push([
        registrantDept,
        teamIdentifier,
        entry.registrant.name,
        entry.registrant.usn,
        entry.registrant.email,
        entry.registrant.phone || entry.registrant.user?.phone || "N/A",
      ]);
    });

    // 3. Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not configured");
    }

    // 4. Get existing sheets
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheet.data.sheets || [];
    let sheetTitles = new Set(existingSheets.map((s) => s.properties?.title));

    const MAIN_SHEET = "Main Summary";

    // 5. Handle Clear Mode: Delete all sheets except one (to avoid error)
    if (clearMode) {
      // First, ensure Main Summary exists (we'll keep this one or create a temp one)
      let tempSheetCreated = false;
      if (!sheetTitles.has(MAIN_SHEET)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{ addSheet: { properties: { title: MAIN_SHEET, index: 0 } } }]
          }
        });
        tempSheetCreated = true;
      }

      // Refresh sheet list
      const freshSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
      const currentSheets = freshSpreadsheet.data.sheets || [];
      const deleteRequests = currentSheets
        .filter(s => s.properties?.title !== MAIN_SHEET)
        .map(s => ({ deleteSheet: { sheetId: s.properties?.sheetId } }));

      if (deleteRequests.length > 0) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests: deleteRequests }
        });
      }
      
      // Update our tracking set
      sheetTitles = new Set([MAIN_SHEET]);
    }

    // 6. Prepare batch requests for creation
    const addSheetRequests: any[] = [];
    const eventSheetTitles: string[] = [];

    // Ensure Main sheet is in the list to be checked/created (if not in clear mode)
    if (!sheetTitles.has(MAIN_SHEET)) {
      addSheetRequests.push({
        addSheet: { properties: { title: MAIN_SHEET, index: 0 } },
      });
    }

    for (const [eventName] of groupedData.entries()) {
      const safeTitle = eventName.substring(0, 100).replace(/[\[\]\?\/\*\\:]/g, "");
      eventSheetTitles.push(safeTitle);
      
      if (!sheetTitles.has(safeTitle)) {
        addSheetRequests.push({
          addSheet: { properties: { title: safeTitle } },
        });
      }
    }

    // 7. Execute batch creation if needed
    if (addSheetRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: addSheetRequests },
      });
    }

    // 7. Get updated sheet info to get GIDs for linking
    const updatedSpreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const allSheets = updatedSpreadsheet.data.sheets || [];
    const titleToGid = new Map(allSheets.map(s => [s.properties?.title, s.properties?.sheetId]));

    // 8. Prepare batch value updates
    const dataUpdates: any[] = [];

    // Main Summary Content
    const syncTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const mainHeaders = ["Event Name", "Link to Sheet"];
    const mainRows = eventSheetTitles.sort().map(title => [
      title,
      `=HYPERLINK("#gid=${titleToGid.get(title)}", "Go to Sheet")`
    ]);

    dataUpdates.push({
      range: `${MAIN_SHEET}!A1`,
      values: [
        ["Registration Sync Summary"],
        [`Last Synced (IST): ${syncTime}`],
        [],
        mainHeaders,
        ...mainRows
      ],
    });

    // Event Sheets Content
    for (const [eventName, rows] of groupedData.entries()) {
      const safeTitle = eventName.substring(0, 100).replace(/[\[\]\?\/\*\\:]/g, "");
      const headers = ["Department", "Team", "Student Name", "USN/Roll No", "Email", "Phone"];
      dataUpdates.push({
        range: `${safeTitle}!A1`,
        values: [
          [`Event: ${eventName}`],
          [],
          headers,
          ...rows
        ],
      });
    }

    // 9. Execute batch value updates
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED", // Use USER_ENTERED for formulas
        data: dataUpdates,
      },
    });

    return NextResponse.json({
      data: { message: `Successfully synced ${groupedData.size} events. Check the '${MAIN_SHEET}' sheet.` },
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: { message: error.message || "Failed to sync with Google Sheets" } },
      { status: 500 }
    );
  }
}
