"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DepartmentStanding } from '@/utils/excelResults';
import { Trophy, Medal, Star } from 'lucide-react';

interface Props {
  standing: DepartmentStanding;
  children: React.ReactNode;
}

export default function DepartmentDetailsWrapper({ standing, children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-heading font-black text-gat-midnight flex items-center gap-3">
            {standing.department}
            <span className="text-lg font-mono bg-gat-blue/10 text-gat-blue px-3 py-1 rounded-full">
              {standing.totalPoints} pts
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <h4 className="text-sm font-bold text-gat-steel uppercase tracking-wider">Points Breakdown</h4>
          {standing.breakdown.length === 0 ? (
            <p className="text-gat-steel italic">No podium finishes yet.</p>
          ) : (
            <div className="space-y-3">
              {standing.breakdown.sort((a, b) => a.position - b.position).map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-gat-off-white border border-gat-blue/5 hover:border-gat-blue/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.position === 1 ? 'bg-gat-gold/20' : 
                      item.position === 2 ? 'bg-gat-steel/20' : 
                      item.position === 3 ? 'bg-gat-steel/10' : 'bg-gat-blue/10'
                    }`}>
                      {item.position === 1 ? <Trophy className="w-5 h-5 text-gat-gold" /> : 
                       item.position === 2 ? <Medal className="w-5 h-5 text-gat-steel" /> : 
                       item.position === 3 ? <Medal className="w-5 h-5 text-gat-steel/70" /> :
                       <Star className="w-5 h-5 text-gat-blue" />}
                    </div>
                    <div>
                      <p className="font-bold text-gat-midnight leading-tight">{item.eventName}</p>
                      <p className="text-xs text-gat-steel uppercase tracking-wider font-bold">
                        {item.position === 1 ? 'First Place' : 
                         item.position === 2 ? 'Second Place' : 
                         item.position === 3 ? 'Third Place' : 'Participation'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-gat-blue">+{item.points}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
