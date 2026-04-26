import React from 'react';
import { getCalculatedResults, DepartmentStanding } from '@/utils/excelResults';
import ResultsPodium from '@/components/ResultsPodium';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DepartmentDetailsWrapper from '@/components/DepartmentDetailsWrapper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResultsPage() {
  const standings = await getCalculatedResults();

  if (standings.length === 0 || (standings.every(s => s.podiumPoints === 0) && standings.every(s => s.participationPoints === 0))) {
    return (
      <div className="min-h-screen bg-gat-off-white pt-24 pb-20 flex flex-col items-center justify-center px-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-gat-blue/10 blur-2xl rounded-full animate-pulse" />
          <div className="relative bg-white p-12 rounded-[3rem] border border-gat-blue/10 shadow-card text-center max-w-lg">
            <div className="w-20 h-20 bg-gat-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
              <span className="text-4xl">⏳</span>
            </div>
            <h1 className="text-4xl font-heading font-black text-gat-midnight mb-4 uppercase tracking-tight">
              Results Awaited
            </h1>
            <p className="text-gat-steel text-lg leading-relaxed">
              The excitement is building! Our team is currently finalizing the scores for the ongoing events. 
              Check back soon for the official standings.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 bg-gat-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 bg-gat-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-gat-blue rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rollingStandings = [...standings]
    .sort((a, b) => b.podiumPoints - a.podiumPoints);
    
  const participationStandings = [...standings]
    .sort((a, b) => b.participationPoints - a.participationPoints);

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-gat-steel font-bold mb-2">
            INTERACT 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-gat-midnight mb-4">
            Championship Standings
          </h1>
          <div className="h-1.5 w-24 bg-gat-blue mx-auto rounded-full" />
        </div>

        {/* Tables Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Rolling Trophy Table */}
          <div className="bg-white rounded-[2.5rem] border border-gat-blue/10 shadow-card overflow-hidden">
            <div className="p-8 border-b border-gat-blue/5 bg-gradient-to-br from-gat-blue/[0.02] to-transparent">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gat-gold/10 rounded-2xl flex items-center justify-center text-xl">
                  🏆
                </div>
                <h2 className="text-2xl font-heading font-bold text-gat-midnight">Rolling Trophy</h2>
              </div>
              <p className="text-sm text-gat-steel">Points from podium finishes (1st, 2nd, 3rd)</p>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gat-off-white/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-20 text-center font-bold">Rank</TableHead>
                    <TableHead className="font-bold">Department</TableHead>
                    <TableHead className="text-right font-bold">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rollingStandings.map((standing, index) => (
                    <DepartmentDetailsWrapper key={standing.department} standing={standing}>
                      <TableRow className="cursor-pointer hover:bg-gat-blue/5 transition-colors group">
                        <TableCell className="text-center font-bold text-gat-steel group-hover:text-gat-blue">
                          #{index + 1}
                        </TableCell>
                        <TableCell className="font-heading font-bold text-gat-midnight">
                          {standing.department}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center justify-center bg-gat-blue/10 text-gat-blue px-3 py-1 rounded-full font-mono font-bold group-hover:bg-gat-blue group-hover:text-white transition-colors">
                            {standing.podiumPoints}
                          </span>
                        </TableCell>
                      </TableRow>
                    </DepartmentDetailsWrapper>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Participation Trophy Table */}
          <div className="bg-white rounded-[2.5rem] border border-gat-blue/10 shadow-card overflow-hidden">
            <div className="p-8 border-b border-gat-blue/5 bg-gradient-to-br from-gat-blue/[0.02] to-transparent">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gat-blue/10 rounded-2xl flex items-center justify-center text-xl">
                  🤝
                </div>
                <h2 className="text-2xl font-heading font-bold text-gat-midnight">Participation Trophy</h2>
              </div>
              <p className="text-sm text-gat-steel">Points awarded solely for event participation</p>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gat-off-white/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold pl-8">Department Name</TableHead>
                    <TableHead className="text-right font-bold pr-8">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participationStandings.map((standing) => (
                    <TableRow key={standing.department} className="hover:bg-gat-blue/5 transition-colors group">
                      <TableCell className="font-heading font-bold text-gat-midnight pl-8">
                        {standing.department}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <span className="inline-flex items-center justify-center bg-gat-steel/10 text-gat-steel px-3 py-1 rounded-full font-mono font-bold group-hover:bg-gat-steel group-hover:text-white transition-colors">
                          {standing.participationPoints}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-gat-steel italic">
          * Click on any department in the Rolling Trophy table to view detailed podium breakdown.
        </div>
      </div>
    </div>
  );
}
