import { google } from 'googleapis';
import { eventPrizeData } from '@/data/eventPrizes';
import { spocsData } from '@/data/spocsData';
import { unstable_noStore as noStore } from 'next/cache';

export interface DepartmentStanding {
  department: string;
  totalPoints: number;
  breakdown: {
    eventName: string;
    position: number;
    points: number;
    type: 'Podium' | 'Participation';
  }[];
}

// Simple in-memory cache to avoid Google Sheets Quota limits
let cachedStandings: DepartmentStanding[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 seconds

export async function getCalculatedResults(): Promise<DepartmentStanding[]> {
  const now = Date.now();
  if (cachedStandings && (now - lastFetchTime) < CACHE_TTL) {
    return cachedStandings;
  }
  
  noStore();
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.Results_GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      console.warn('Results_GOOGLE_SHEET_ID is not configured');
      return [];
    }

    const standingsMap: Record<string, DepartmentStanding> = {};

    // Initialize all departments from spocsData
    const allDepts = Array.from(new Set(spocsData.map(s => s.department)));
    allDepts.forEach(dept => {
      standingsMap[dept] = {
        department: dept,
        totalPoints: 0,
        breakdown: []
      };
    });

    // 1. Fetch Podium Results
    // Headers: Event ID, Domain, Event Name, 1st Place (Dept), 2nd Place (Dept), 3rd Place (Dept)
    const podiumRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Podium - Results!A2:F200', // Adjusted to column F
    });
    const podiumRows = podiumRes.data.values || [];

    podiumRows.forEach(row => {
      // Index mapping: 0=ID, 1=Domain, 2=Name, 3=1st, 4=2nd, 5=3rd
      const eventName = row[2];
      const firstDept = row[3];
      const secondDept = row[4];
      const thirdDept = row[5];

      if (!eventName) return;

      const eventInfo = eventPrizeData.find(e => e.eventName === eventName);
      if (!eventInfo) {
        // console.warn(`Event prize data not found for: ${eventName}`);
        return;
      }

      const processPosition = (dept: string, position: number, points: number) => {
        if (!dept) return;
        // Map shorthand names to full department names if necessary
        const targetDept = allDepts.find(d => 
          d.toLowerCase() === dept.toLowerCase() || 
          d.toLowerCase().includes(dept.toLowerCase())
        ) || dept;

        if (!standingsMap[targetDept]) return;

        standingsMap[targetDept].totalPoints += points;
        standingsMap[targetDept].breakdown.push({
          eventName,
          position,
          points,
          type: 'Podium'
        });
      };

      processPosition(firstDept, 1, eventInfo.pointsFirst);
      processPosition(secondDept, 2, eventInfo.pointsSecond);
      processPosition(thirdDept, 3, eventInfo.pointsThird);
    });

    // 2. Fetch Participation Points
    // Headers: Event ID, Domain, Event Name, 1GAAE, 1GAAIML, ...
    const partRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Particpation Points!A1:AZ200',
    });
    const partData = partRes.data.values || [];

    if (partData.length > 0) {
      const headers = partData[0];
      const rows = partData.slice(1);

      rows.forEach(row => {
        const eventName = row[2]; // Event Name is at index 2
        if (!eventName) return;
        
        // Iterate through department columns (starting from index 3)
        for (let i = 3; i < headers.length; i++) {
          const deptCode = headers[i];
          const points = parseInt(row[i]) || 0;

          if (points > 0) {
            // Find the full department name from spocsData or mapping
            // Many columns use deptCode like "1GACSE", we need to map to "CSE" or full name
            const dept = allDepts.find(d => 
              d.toLowerCase() === deptCode.toLowerCase() || 
              deptCode.toLowerCase().includes(d.toLowerCase())
            ) || deptCode;

            if (standingsMap[dept]) {
              standingsMap[dept].totalPoints += points;
              standingsMap[dept].breakdown.push({
                eventName,
                position: 0,
                points,
                type: 'Participation'
              });
            }
          }
        }
      });
    }

    // Convert to array and sort by total points
    const standings = Object.values(standingsMap).sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Sort breakdown for each standing: 1st, 2nd, 3rd, then Participation
    standings.forEach(s => {
      s.breakdown.sort((a, b) => {
        if (a.position === 0) return 1;
        if (b.position === 0) return -1;
        return a.position - b.position;
      });
    });
    
    // Update cache
    cachedStandings = standings;
    lastFetchTime = Date.now();
    
    return standings;
  } catch (error) {
    console.error('Error calculating results from Google Sheets:', error);
    return [];
  }
}
