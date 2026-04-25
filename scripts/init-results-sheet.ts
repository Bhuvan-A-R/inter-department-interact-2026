import { google } from 'googleapis';
import prisma from '../lib/db';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.Results_GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Results_GOOGLE_SHEET_ID is not configured');
    }

    // 1. Fetch all events from DB (Distinct by eventNo)
    const allEvents = await prisma.events.findMany({
      orderBy: { eventNo: 'asc' },
    });
    
    // Group by eventNo to get unique events
    const uniqueEventsMap = new Map<number, any>();
    allEvents.forEach(e => {
      if (!uniqueEventsMap.has(e.eventNo)) {
        uniqueEventsMap.set(e.eventNo, e);
      }
    });
    const events = Array.from(uniqueEventsMap.values()).sort((a, b) => a.eventNo - b.eventNo);

    // 2. Fetch all unique departments (excluding Admin)
    const departments = await prisma.users.findMany({
      where: { NOT: { deptCode: '1GAAdmin' } },
      select: { deptCode: true },
      distinct: ['deptCode'],
    });
    const deptCodes = departments.map(d => d.deptCode).sort();

    // 3. Read Excel data for existing winners
    const excelPath = path.join(process.cwd(), 'public', 'data', 'results.xlsx');
    let excelData: any[] = [];
    if (fs.existsSync(excelPath)) {
      const workbook = XLSX.readFile(excelPath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      excelData = XLSX.utils.sheet_to_json(sheet);
    }

    // 4. Prepare Podium Data
    const podiumRows = events.map(event => {
      const excelMatch = excelData.find(e => e['Event Name'] === event.eventName);
      return [
        event.eventNo,
        event.category,
        event.eventName,
        excelMatch ? excelMatch['1st Place (Dept)'] || '' : '',
        excelMatch ? excelMatch['2nd Place (Dept)'] || '' : '',
        excelMatch ? excelMatch['3rd Place (Dept)'] || '' : '',
      ];
    });

    const podiumHeaders = ["Event ID", "Domain", "Event Name", "1st Place (Dept)", "2nd Place (Dept)", "3rd Place (Dept)"];

    // 5. Prepare Participation Data
    const participationRows = events.map(event => {
      const row = [event.eventNo, event.category, event.eventName];
      deptCodes.forEach(() => row.push("0")); // Initialize with 0
      return row;
    });

    const participationHeaders = ["Event ID", "Domain", "Event Name", ...deptCodes];

    // 6. Update Google Sheets
    console.log('Clearing old data...');
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: 'Podium - Results!A:F' });
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: 'Particpation Points!A:AZ' });

    console.log('Updating Podium - Results...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Podium - Results!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [podiumHeaders, ...podiumRows],
      },
    });

    console.log('Updating Particpation Points...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Particpation Points!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [participationHeaders, ...participationRows],
      },
    });

    console.log('Successfully initialized results Google Sheet!');
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
