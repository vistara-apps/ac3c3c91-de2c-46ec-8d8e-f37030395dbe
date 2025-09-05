'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { WarningBanner } from '@/components/WarningBanner';
import { WalletConnection } from '@/components/WalletConnection';
import { ShmooButton } from '@/components/ShmooButton';
import { StatsCard } from '@/components/StatsCard';
import { loadUserStats, saveUserStats, calculateStreak } from '@/lib/utils';
import { ClickStats } from '@/lib/types';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { setFrameReady } = useMiniKit();
  const [stats, setStats] = useState<ClickStats>({
    totalClicks: 0,
    streakCount: 0,
    lastClickTime: null,
    isStreakActive: false,
  });

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
          <StatsCard stats={stats} />
        )}

        <ShmooButton 
          onSuccess={handleSuccessfulClick}
          disabled={!isConnected || !address}
        />

        {isConnected && (
          <div className="alert-info text-center">
            <p className="text-sm">
              Each click generates a unique Shmoo point recorded on-chain.
              Keep clicking to maintain your streak!
            </p>
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
