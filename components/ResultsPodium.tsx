"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import GlassCard from './ui/GlassCard';

interface PodiumStepProps {
  department: string;
  points: number;
  position: 1 | 2 | 3;
}

const PodiumStep = ({ department, points, position }: PodiumStepProps) => {
  const configs = {
    1: {
      height: 'h-64',
      color: 'bg-gat-gold',
      icon: <Trophy className="w-12 h-12 text-gat-gold" />,
      label: '1st',
      delay: 0.2,
      beamColor1: "#f3c317", // gat-gold
      beamColor2: "#9a8531"  // gat-dark-gold
    },
    2: {
      height: 'h-48',
      color: 'bg-gat-steel',
      icon: <Medal className="w-10 h-10 text-gat-steel" />,
      label: '2nd',
      delay: 0.4,
      beamColor1: "#8b97b6", // gat-steel
      beamColor2: "#353636"  // gat-charcoal
    },
    3: {
      height: 'h-40',
      color: 'bg-gat-steel/70',
      icon: <Medal className="w-8 h-8 text-gat-steel/70" />,
      label: '3rd',
      delay: 0.6,
      beamColor1: "#8b97b6",
      beamColor2: "#353636"
    }
  };

  const config = configs[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: config.delay, duration: 0.8, type: 'spring' }}
      className="flex flex-col items-center flex-1"
    >
      <div className="mb-4 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: config.delay }}
        >
          {config.icon}
        </motion.div>
        <h3 className="mt-2 text-2xl font-black text-gat-midnight">{department}</h3>
        <p className="text-sm font-bold text-gat-steel">{points} Points</p>
      </div>
      
      <GlassCard 
        className={`w-full ${config.height} flex flex-col items-center justify-start pt-6 rounded-t-3xl border-b-0`}
        beamColor1={config.beamColor1}
        beamColor2={config.beamColor2}
      >
        <span className="text-4xl font-black text-gold drop-shadow-md">
          {config.label}
        </span>
      </GlassCard>
    </motion.div>
  );
};

interface ResultsPodiumProps {
  standings: {
    department: string;
    totalPoints: number;
  }[];
}

const ResultsPodium = ({ standings }: ResultsPodiumProps) => {
  const first = standings[0];
  const second = standings[1];
  const third = standings[2];

  if (!first) return null;

  return (
    <div className="flex items-end justify-center w-full max-w-4xl mx-auto gap-2 md:gap-4 px-4 pt-10">
      {/* 2nd Place (Right) */}
      {second && <PodiumStep department={second.department} points={second.totalPoints} position={2} />}
      
      {/* 1st Place (Middle) */}
      {first && <PodiumStep department={first.department} points={first.totalPoints} position={1} />}
      
      {/* 3rd Place (Left) */}
      {third && <PodiumStep department={third.department} points={third.totalPoints} position={3} />}
    </div>
  );
};

export default ResultsPodium;
