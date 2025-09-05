'use client';

import { ClickStats } from '@/lib/types';
import { Zap, Target, Calendar } from 'lucide-react';

interface StatsCardProps {
  stats: ClickStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="card mb-6">
      <h3 className="text-heading mb-4 text-center">Your Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{stats.totalClicks}</div>
          <div className="text-caption">Total Clicks</div>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Zap className="w-6 h-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-accent">{stats.streakCount}</div>
          <div className="text-caption">Streak</div>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Calendar className="w-6 h-6 text-shmoo-green" />
          </div>
          <div className="text-sm font-bold text-shmoo-green">
            {stats.isStreakActive ? 'Active' : 'Inactive'}
          </div>
          <div className="text-caption">Status</div>
        </div>
      </div>
    </div>
  );
}
