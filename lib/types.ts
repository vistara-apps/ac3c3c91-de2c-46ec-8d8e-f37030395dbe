export interface User {
  userAddress: string;
  streakCount: number;
  lastClickTimestamp: Date;
  totalClicks: number;
}

export interface ShmooPoint {
  pointId: string;
  userAddress: string;
  timestamp: Date;
}

export interface ClickStats {
  totalClicks: number;
  streakCount: number;
  lastClickTime: Date | null;
  isStreakActive: boolean;
}
