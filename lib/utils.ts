import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';
import { ClickStats, UserMetrics, StreakData, ProgressData } from './types';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Streak calculation functions
export function calculateStreak(lastClickTime: Date | null): boolean {
  if (!lastClickTime) return false;
  
  const now = new Date();
  const timeDiff = now.getTime() - lastClickTime.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  // Streak is active if last click was within 24 hours
  return hoursDiff <= 24;
}

export function getStreakResetTime(lastClickTime: Date | null): Date | null {
  if (!lastClickTime) return null;
  
  const resetTime = new Date(lastClickTime);
  resetTime.setHours(resetTime.getHours() + 24);
  return resetTime;
}

export function getTimeUntilStreakReset(lastClickTime: Date | null): string {
  const resetTime = getStreakResetTime(lastClickTime);
  if (!resetTime) return '';
  
  const now = new Date();
  if (resetTime <= now) return 'Streak expired';
  
  return formatDistanceToNow(resetTime, { addSuffix: true });
}

// Address formatting functions
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAddressLong(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

// Point ID generation
export function generatePointId(txHash: string, logIndex: number): string {
  return `${txHash}-${logIndex}`;
}

// Storage functions
export function getStorageKey(address: string): string {
  return `shmoo-stats-${address.toLowerCase()}`;
}

export function getPointsStorageKey(address: string): string {
  return `shmoo-points-${address.toLowerCase()}`;
}

// Enhanced user stats functions
export function loadUserStats(address: string): ClickStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  const key = getStorageKey(address);
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    return getDefaultStats();
  }

  try {
    const parsed = JSON.parse(stored);
    const lastClickTime = parsed.lastClickTime ? new Date(parsed.lastClickTime) : null;
    const isStreakActive = calculateStreak(lastClickTime);
    
    return {
      totalClicks: parsed.totalClicks || 0,
      streakCount: isStreakActive ? parsed.streakCount || 0 : 0,
      lastClickTime,
      isStreakActive,
      longestStreak: parsed.longestStreak || 0,
      totalPointsGenerated: parsed.totalPointsGenerated || 0,
    };
  } catch {
    return getDefaultStats();
  }
}

export function saveUserStats(address: string, stats: ClickStats): void {
  if (typeof window === 'undefined') return;
  
  const key = getStorageKey(address);
  localStorage.setItem(key, JSON.stringify({
    ...stats,
    lastClickTime: stats.lastClickTime?.toISOString(),
  }));
}

function getDefaultStats(): ClickStats {
  return {
    totalClicks: 0,
    streakCount: 0,
    lastClickTime: null,
    isStreakActive: false,
    longestStreak: 0,
    totalPointsGenerated: 0,
  };
}

// Date formatting functions
export function formatClickTime(date: Date | null): string {
  if (!date) return 'Never';
  
  if (isToday(date)) {
    return `Today at ${format(date, 'HH:mm')}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  }
  
  return format(date, 'MMM d, yyyy');
}

export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';
  return formatDistanceToNow(date, { addSuffix: true });
}

// Progress calculation functions
export function calculateProgress(current: number, target: number): ProgressData {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  return {
    current,
    total: target,
    percentage,
    label: `${current} / ${target}`,
  };
}

export function calculateStreakProgress(stats: ClickStats): ProgressData {
  const target = (stats.longestStreak || 0) + 1;
  return calculateProgress(stats.streakCount, target);
}

// Metrics calculation functions
export function calculateUserMetrics(stats: ClickStats): UserMetrics {
  const now = new Date();
  const firstClickDate = stats.lastClickTime; // Simplified for demo
  const daysSinceFirst = firstClickDate 
    ? Math.max(1, Math.ceil((now.getTime() - firstClickDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  
  return {
    totalClicks: stats.totalClicks,
    totalPointsGenerated: stats.totalPointsGenerated || stats.totalClicks,
    currentStreak: stats.streakCount,
    longestStreak: stats.longestStreak || stats.streakCount,
    averageClicksPerDay: stats.totalClicks / daysSinceFirst,
    firstClickDate: firstClickDate,
    lastClickDate: stats.lastClickTime,
    totalDaysActive: daysSinceFirst,
  };
}

// Validation functions
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

// Number formatting functions
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

// Error handling functions
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

// Local storage helpers
export function clearUserData(address: string): void {
  if (typeof window === 'undefined') return;
  
  const statsKey = getStorageKey(address);
  const pointsKey = getPointsStorageKey(address);
  
  localStorage.removeItem(statsKey);
  localStorage.removeItem(pointsKey);
}

// Animation helpers
export function triggerHapticFeedback(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function playClickSound(): void {
  // Create a simple click sound using Web Audio API
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context is not available
      console.debug('Audio feedback not available:', error);
    }
  }
}
