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

export interface PaymentConfig {
  amount: string;
  currency: 'USDC';
  network: 'base' | 'base-sepolia';
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  paymentResponse?: any;
}
