'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { WarningBanner } from '@/components/WarningBanner';
import { WalletConnection } from '@/components/WalletConnection';
import { ShmooButton } from '@/components/ShmooButton';
import { StatsCard } from '@/components/StatsCard';
import { PaymentButton } from '@/components/PaymentButton';
import { PaymentStatus } from '@/components/PaymentStatus';
import { loadUserStats, saveUserStats, calculateStreak } from '@/lib/utils';
import { ClickStats, PaymentResult } from '@/lib/types';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { setFrameReady } = useMiniKit();
  const [stats, setStats] = useState<ClickStats>({
    totalClicks: 0,
    streakCount: 0,
    lastClickTime: null,
    isStreakActive: false,
  });
  const [paymentHistory, setPaymentHistory] = useState<PaymentResult[]>([]);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Load user stats when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      const userStats = loadUserStats(address);
      setStats(userStats);
    } else {
      setStats({
        totalClicks: 0,
        streakCount: 0,
        lastClickTime: null,
        isStreakActive: false,
      });
    }
  }, [address, isConnected]);

  const handleSuccessfulClick = () => {
    if (!address) return;

    const now = new Date();
    const wasStreakActive = calculateStreak(stats.lastClickTime);
    
    const newStats: ClickStats = {
      totalClicks: stats.totalClicks + 1,
      streakCount: wasStreakActive ? stats.streakCount + 1 : 1,
      lastClickTime: now,
      isStreakActive: true,
    };

    setStats(newStats);
    saveUserStats(address, newStats);
  };

  const handlePaymentSuccess = (result: PaymentResult) => {
    console.log('Payment successful:', result);
    setPaymentHistory(prev => [...prev, result]);
    
    // Optionally trigger a successful click when payment is made
    handleSuccessfulClick();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // You could show a toast notification here
  };

  return (
    <main className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <WarningBanner />
        
        <div className="text-center mb-8">
          <h1 className="text-heading mb-2">Shmoo Clicker</h1>
          <p className="text-body text-gray-600">
            Click your way to verifiable digital points
          </p>
        </div>

        <WalletConnection />

        {isConnected && address && (
          <>
            <StatsCard stats={stats} />
            <PaymentStatus className="mb-6" />
          </>
        )}

        <div className="space-y-4">
          <ShmooButton 
            onSuccess={handleSuccessfulClick}
            disabled={!isConnected || !address}
          />
          
          {isConnected && address && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-center mb-4">💳 x402 Payment Flow</h3>
              <PaymentButton
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                disabled={!isConnected || !address}
                amount="0.01"
                description="Test x402 payment for Shmoo Clicker"
              />
            </div>
          )}
        </div>

        {isConnected && (
          <div className="alert-info text-center">
            <p className="text-sm">
              Each click generates a unique Shmoo point recorded on-chain.
              Keep clicking to maintain your streak!
            </p>
          </div>
        )}

        {paymentHistory.length > 0 && (
          <div className="mt-6 bg-white border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">🧾 Payment History</h3>
            <div className="space-y-2">
              {paymentHistory.slice(-3).map((payment, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">
                    Payment #{paymentHistory.length - index}
                  </span>
                  <span className={`font-medium ${
                    payment.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {payment.success ? '✅ Success' : '❌ Failed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-caption">
            Built on Base • Powered by OnchainKit
          </p>
        </div>
      </div>
    </main>
  );
}
