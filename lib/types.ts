// Core data model interfaces as specified
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
  transactionHash?: string;
  blockNumber?: number;
}

export interface ClickStats {
  totalClicks: number;
  streakCount: number;
  lastClickTime: Date | null;
  isStreakActive: boolean;
  longestStreak?: number;
  totalPointsGenerated?: number;
}

// Transaction and blockchain related types
export interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
  timestamp?: Date;
}

export interface ShmooPointTransaction {
  hash: string;
  pointId: string;
  userAddress: string;
  timestamp: Date;
  blockNumber?: number;
  gasUsed?: bigint;
  fee?: bigint;
}

// UI Component types
export interface ButtonVariant {
  variant: 'primary' | 'outline' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export interface CardVariant {
  variant: 'default' | 'compact' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
}

export interface AlertVariant {
  variant: 'warning' | 'info' | 'success' | 'error';
  dismissible?: boolean;
}

// Progress tracking types
export interface ProgressData {
  current: number;
  total: number;
  percentage: number;
  label?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  isActive: boolean;
  lastClickTime: Date | null;
  nextResetTime?: Date;
}

// Analytics and metrics types
export interface UserMetrics {
  totalClicks: number;
  totalPointsGenerated: number;
  currentStreak: number;
  longestStreak: number;
  averageClicksPerDay: number;
  firstClickDate: Date | null;
  lastClickDate: Date | null;
  totalDaysActive: number;
}

// App state types
export interface AppState {
  isConnected: boolean;
  userAddress: string | null;
  chainId: number | null;
  stats: ClickStats;
  transaction: TransactionStatus;
  isLoading: boolean;
  error: string | null;
}

// Configuration types
export interface AppConfig {
  contractAddress: string | null;
  chainId: number;
  requiredChainId: number;
  apiEndpoints: {
    alchemy?: string;
    walletConnect?: string;
  };
  features: {
    onChainGeneration: boolean;
    streakTracking: boolean;
    analytics: boolean;
  };
}
