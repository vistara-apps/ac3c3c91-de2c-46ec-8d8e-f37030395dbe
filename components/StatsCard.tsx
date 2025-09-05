'use client';

import { motion } from 'framer-motion';
import { Flame, Target, Clock, TrendingUp, Award, Zap } from 'lucide-react';
import { ClickStats } from '@/lib/types';
import { 
  formatAddress, 
  formatClickTime, 
  formatRelativeTime, 
  getTimeUntilStreakReset,
  calculateStreakProgress,
  formatNumber,
  cn
} from '@/lib/utils';
import { useAccount } from 'wagmi';

interface StatsCardProps {
  stats: ClickStats;
  className?: string;
}

export function StatsCard({ stats, className }: StatsCardProps) {
  const { address } = useAccount();
  const streakProgress = calculateStreakProgress(stats);
  const timeUntilReset = getTimeUntilStreakReset(stats.lastClickTime);

  const statItems = [
    {
      icon: Target,
      label: 'Total Clicks',
      value: formatNumber(stats.totalClicks),
      color: 'text-shmoo-green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: formatNumber(stats.streakCount),
      color: 'text-accent',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      icon: Award,
      label: 'Longest Streak',
      value: formatNumber(stats.longestStreak || 0),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Zap,
      label: 'Points Generated',
      value: formatNumber(stats.totalPointsGenerated || stats.totalClicks),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <motion.div 
      className={cn("card mb-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-subheading mb-2 gradient-text">Your Stats</h2>
        {address && (
          <p className="text-caption">
            Wallet: {formatAddress(address)}
          </p>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={cn(
              "relative p-4 rounded-lg border-2 border-transparent",
              "hover:border-gray-200 transition-all duration-200",
              item.bgColor
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon className={cn("w-5 h-5", item.iconColor)} />
              {item.label === 'Current Streak' && stats.isStreakActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
              )}
            </div>
            <div className={cn("text-2xl font-bold mb-1", item.color)}>
              {item.value}
            </div>
            <div className="text-caption text-xs">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Streak Progress */}
      {stats.streakCount > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Streak Progress
            </span>
            <span className="text-xs text-muted-foreground">
              {streakProgress.current} / {streakProgress.total}
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${streakProgress.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
      
      {/* Last Click Info */}
      {stats.lastClickTime && (
        <motion.div 
          className="pt-4 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-gray-700">Last Click</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatClickTime(stats.lastClickTime)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
              stats.isStreakActive 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            )}>
              <motion.div 
                className={cn(
                  "w-2 h-2 rounded-full",
                  stats.isStreakActive ? 'bg-green-500' : 'bg-gray-400'
                )}
                animate={stats.isStreakActive ? { 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1] 
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {stats.isStreakActive ? 'Streak Active' : 'Streak Inactive'}
            </div>
            
            {stats.isStreakActive && timeUntilReset && (
              <span className="text-xs text-muted-foreground">
                Resets {timeUntilReset}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {stats.totalClicks === 0 && (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No clicks yet!</p>
          <p className="text-caption">
            Click the Shmoo button to start generating points
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
