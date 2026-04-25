import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { eventPrizeData } from '@/data/eventPrizes';
import { spocsData } from '@/data/spocsData';

export interface DepartmentStanding {
  department: string;
  totalPoints: number;
  breakdown: {
    eventName: string;
    position: number;
    points: number;
  }[];
}

export async function getCalculatedResults(): Promise<DepartmentStanding[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'results.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn('Results Excel file not found at:', filePath);
      return [];
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

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

    data.forEach(row => {
      const eventName = row['Event Name'];
      const firstDept = row['1st Place (Dept)'];
      const secondDept = row['2nd Place (Dept)'];
      const thirdDept = row['3rd Place (Dept)'];

      const eventInfo = eventPrizeData.find(e => e.eventName === eventName);
      if (!eventInfo) {
        console.warn(`Event prize data not found for: ${eventName}`);
        return;
      }

      const processPosition = (dept: string, position: number, points: number) => {
        if (!dept || !standingsMap[dept]) return;
        standingsMap[dept].totalPoints += points;
        standingsMap[dept].breakdown.push({
          eventName,
          position,
          points
        });
      };

      processPosition(firstDept, 1, eventInfo.pointsFirst);
      processPosition(secondDept, 2, eventInfo.pointsSecond);
      processPosition(thirdDept, 3, eventInfo.pointsThird);
    });

    // Convert to array and sort by total points
    const standings = Object.values(standingsMap).sort((a, b) => b.totalPoints - a.totalPoints);
    
    return standings;
  } catch (error) {
    console.error('Error calculating results:', error);
    return [];
  }
}
