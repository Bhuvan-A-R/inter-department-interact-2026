import { google } from 'googleapis';
import { eventPrizeData } from '@/data/eventPrizes';
import { spocsData } from '@/data/spocsData';
import { unstable_noStore as noStore } from 'next/cache';

export interface DepartmentStanding {
  department: string;
  totalPoints: number;
  podiumPoints: number;
  participationPoints: number;
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

    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title || '') || [];
    
    // Find sheets matching our needs (case-insensitive)
    const consolidatedSheetName = sheetNames.find(n => n.toLowerCase().includes('consolidated'));
    const podiumSheetName = sheetNames.find(n => 
      n.toLowerCase().includes('podium') || 
      n.toLowerCase().includes('poudium')
    );
    const participationSheetName = sheetNames.find(n => 
      n.toLowerCase().includes('particip') || 
      n.toLowerCase().includes('particp')
    );

    if (!podiumSheetName) {
      console.warn('Podium sheet not found. Available:', sheetNames);
    }
    if (!participationSheetName) {
      console.warn('Participation sheet not found. Available:', sheetNames);
    }

    const standingsMap: Record<string, DepartmentStanding> = {};

    // Initialize all departments from spocsData
    // Sort by length descending to match longest department names first (e.g., CSAIML before AIML)
    const allDepts = Array.from(new Set(spocsData.map(s => s.department)))
      .sort((a, b) => b.length - a.length);
    
    allDepts.forEach(dept => {
      standingsMap[dept] = {
        department: dept,
        totalPoints: 0,
        podiumPoints: 0,
        participationPoints: 0,
        breakdown: []
      };
    });

    // Helper for robust department mapping
    const findTargetDept = (input: string) => {
      if (!input) return null;
      const code = input.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      return allDepts.find(d => {
        const search = d.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
        return code === search || 
               code === search.toLowerCase() ||
               code.endsWith(search) || 
               code.includes(`ga${search}`) ||
               code.includes(`gac${search}`);
      }) || input;
    };

    // 1. If Consolidated sheet exists, use it primarily
    if (consolidatedSheetName) {
      const consolidatedRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${consolidatedSheetName}!A1:C100`, // Assuming Dept, Rolling, Participation
      });
      const rows = consolidatedRes.data.values || [];
      rows.forEach(row => {
        const targetDept = findTargetDept(row[0]);
        if (targetDept && standingsMap[targetDept]) {
          standingsMap[targetDept].podiumPoints = parseInt(row[1]) || 0;
          standingsMap[targetDept].participationPoints = parseInt(row[2]) || 0;
        }
      });
    }

    // 2. Fetch Podium Results (only if not already filled by consolidated or as additional info)
    if (podiumSheetName) {
      const podiumRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${podiumSheetName}!A2:F200`, 
      });
      const podiumRows = podiumRes.data.values || [];

      podiumRows.forEach(row => {
        const eventName = row[2];
        const firstDept = row[3];
        const secondDept = row[4];
        const thirdDept = row[5];

        if (!eventName) return;

        const eventInfo = eventPrizeData.find(e => e.eventName === eventName);
        if (!eventInfo) return;

        const processPosition = (deptName: string, position: number, points: number) => {
          const targetDept = findTargetDept(deptName);
          if (!targetDept || !standingsMap[targetDept]) return;

          // Only add to breakdown if using consolidated for totals
          if (!consolidatedSheetName) {
            standingsMap[targetDept].podiumPoints += points;
          }
          
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
    }

    // 3. Fetch Participation Points (only if not already filled by consolidated)
    if (participationSheetName && !consolidatedSheetName) {
      const partRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${participationSheetName}!A1:B100`, 
      });
      const partRows = partRes.data.values || [];

      partRows.forEach(row => {
        const deptCode = row[0];
        const points = parseInt(row[1]) || 0;

        if (deptCode && points > 0) {
          const targetDept = findTargetDept(deptCode);
          if (targetDept && standingsMap[targetDept]) {
            standingsMap[targetDept].participationPoints += points;
            standingsMap[targetDept].breakdown.push({
              eventName: 'Participation Points',
              position: 0,
              points,
              type: 'Participation'
            });
          }
        }
      });
    }

    // Convert to array
    const standings = Object.values(standingsMap);
    
    // Sort breakdown for each standing
    standings.forEach(s => {
      s.breakdown.sort((a, b) => {
        if (a.position === 0) return 1;
        if (b.position === 0) return -1;
        return a.position - b.position;
      });
    });
    
    cachedStandings = standings;
    lastFetchTime = Date.now();
    
    return standings;
  } catch (error) {
    console.error('Error calculating results from Google Sheets:', error);
    return [];
  }
}
