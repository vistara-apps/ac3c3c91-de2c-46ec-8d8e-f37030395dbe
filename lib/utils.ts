import { ClickStats } from './types';

export function calculateStreak(lastClickTime: Date | null): boolean {
  if (!lastClickTime) return false;
  
  const now = new Date();
  const timeDiff = now.getTime() - lastClickTime.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  // Streak is active if last click was within 24 hours
  return hoursDiff <= 24;
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function generatePointId(txHash: string, logIndex: number): string {
  return `${txHash}-${logIndex}`;
}

export function getStorageKey(address: string): string {
  return `shmoo-stats-${address.toLowerCase()}`;
}

export function loadUserStats(address: string): ClickStats {
  if (typeof window === 'undefined') {
    return {
      totalClicks: 0,
      streakCount: 0,
      lastClickTime: null,
      isStreakActive: false,
    };
  }

  const key = getStorageKey(address);
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    return {
      totalClicks: 0,
      streakCount: 0,
      lastClickTime: null,
      isStreakActive: false,
    };
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
    };
  } catch {
    return {
      totalClicks: 0,
      streakCount: 0,
      lastClickTime: null,
      isStreakActive: false,
    };
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
