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

  if (standings.length === 0 || standings.every(s => s.totalPoints === 0)) {
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

  const podiumDepts = standings.slice(0, 3);
  const remainingDepts = standings.slice(3);

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Podium Section */}
        <div className="mb-20">
          <ResultsPodium standings={podiumDepts} />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl border border-gat-blue/10 shadow-card overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gat-blue/5">
            <h2 className="text-2xl font-heading font-bold text-gat-midnight">Full Rankings</h2>
            <p className="text-sm text-gat-steel">Click on a department to see point details</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gat-off-white/50">
                <TableRow>
                  <TableHead className="w-20 text-center">Rank</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Total Points</TableHead>
                  <TableHead className="text-center w-32">Awards</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((standing, index) => (
                  <DepartmentDetailsWrapper key={standing.department} standing={standing}>
                    <TableRow className="cursor-pointer hover:bg-gat-blue/5 transition-colors group">
                      <TableCell className="text-center font-bold text-gat-steel group-hover:text-gat-blue">
                        #{index + 1}
                      </TableCell>
                      <TableCell className="font-heading font-bold text-gat-midnight">
                        {standing.department}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-center bg-gat-blue/10 text-gat-blue px-3 py-1 rounded-full font-mono font-bold">
                          {standing.totalPoints}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {standing.breakdown.filter(b => b.position === 1).length > 0 && (
                            <Badge className="bg-gat-gold hover:bg-gat-dark-gold text-gat-midnight border-none">
                              {standing.breakdown.filter(b => b.position === 1).length}🥇
                            </Badge>
                          )}
                          {standing.breakdown.filter(b => b.position === 2).length > 0 && (
                            <Badge className="bg-gat-steel hover:bg-gat-charcoal hover:text-white text-gat-midnight border-none">
                              {standing.breakdown.filter(b => b.position === 2).length}🥈
                            </Badge>
                          )}
                          {standing.breakdown.filter(b => b.position === 3).length > 0 && (
                            <Badge className="bg-gat-steel/50 hover:bg-gat-steel text-gat-midnight border-none">
                              {standing.breakdown.filter(b => b.position === 3).length}🥉
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </DepartmentDetailsWrapper>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gat-steel font-bold">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gat-gold" />
            <span>1st Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gat-steel" />
            <span>2nd Place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gat-steel/50" />
            <span>3rd Place</span>
          </div>
        </div>
      </div>
    </div>
  );
}
