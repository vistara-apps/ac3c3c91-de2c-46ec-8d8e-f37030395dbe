'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { WarningBanner } from '@/components/WarningBanner';
import { WalletConnection } from '@/components/WalletConnection';
import { ShmooButton } from '@/components/ShmooButton';
import { StatsCard } from '@/components/StatsCard';
import { 
  loadUserStats, 
  saveUserStats, 
  calculateStreak, 
  generatePointId,
  cn 
} from '@/lib/utils';
import { ClickStats, ShmooPoint } from '@/lib/types';
import { isContractDeployed } from '@/lib/contracts';

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { setFrameReady } = useMiniKit();
  
  const [stats, setStats] = useState<ClickStats>({
    totalClicks: 0,
    streakCount: 0,
    lastClickTime: null,
    isStreakActive: false,
    longestStreak: 0,
    totalPointsGenerated: 0,
  });
  
  const [recentPoints, setRecentPoints] = useState<ShmooPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isContractAvailable = isContractDeployed(chainId);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Load user stats when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      const userStats = loadUserStats(address);
      setStats(userStats);
      
      // Load recent points from localStorage (simplified for demo)
      const pointsKey = `shmoo-points-${address.toLowerCase()}`;
      const storedPoints = localStorage.getItem(pointsKey);
      if (storedPoints) {
        try {
          const points = JSON.parse(storedPoints);
          setRecentPoints(points.slice(-5)); // Show last 5 points
        } catch (error) {
          console.error('Failed to load recent points:', error);
        }
      }
    } else {
      setStats({
        totalClicks: 0,
        streakCount: 0,
        lastClickTime: null,
        isStreakActive: false,
        longestStreak: 0,
        totalPointsGenerated: 0,
      });
      setRecentPoints([]);
    }
  }, [address, isConnected]);

  const handleSuccessfulClick = (pointId: string, txHash?: string) => {
    if (!address) return;

    const now = new Date();
    const wasStreakActive = calculateStreak(stats.lastClickTime);
    
    const newStats: ClickStats = {
      totalClicks: stats.totalClicks + 1,
      streakCount: wasStreakActive ? stats.streakCount + 1 : 1,
      lastClickTime: now,
      isStreakActive: true,
      longestStreak: Math.max(
        stats.longestStreak || 0, 
        wasStreakActive ? stats.streakCount + 1 : 1
      ),
      totalPointsGenerated: (stats.totalPointsGenerated || 0) + 1,
    };

    // Create new point record
    const newPoint: ShmooPoint = {
      pointId,
      userAddress: address,
      timestamp: now,
      transactionHash: txHash,
    };

    // Update state
    setStats(newStats);
    setRecentPoints(prev => [newPoint, ...prev.slice(0, 4)]);
    
    // Save to localStorage
    saveUserStats(address, newStats);
    
    const pointsKey = `shmoo-points-${address.toLowerCase()}`;
    const allPoints = [newPoint, ...recentPoints];
    localStorage.setItem(pointsKey, JSON.stringify(allPoints.slice(0, 50))); // Keep last 50
  };

  return (
    <main className="min-h-screen bg-bg">
      <div className="container-app">
        <WarningBanner />
        
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="w-8 h-8 text-shmoo-green" />
            </motion.div>
            <h1 className="text-heading gradient-text">Shmoo Clicker</h1>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3,
                delay: 1
              }}
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </motion.div>
          </div>
          <p className="text-body text-muted-foreground">
            Click your way to verifiable digital points on Base
          </p>
        </motion.div>

        {/* Wallet Connection */}
        <WalletConnection />

        {/* Stats Card */}
        <AnimatePresence>
          {isConnected && address && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <StatsCard stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Shmoo Button */}
        <ShmooButton 
          onSuccess={handleSuccessfulClick}
          disabled={!isConnected || !address}
        />

        {/* Recent Points */}
        <AnimatePresence>
          {isConnected && recentPoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card mb-6"
            >
              <h3 className="text-subheading mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-shmoo-green" />
                Recent Points
              </h3>
              <div className="space-y-2">
                {recentPoints.map((point, index) => (
                  <motion.div
                    key={point.pointId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-shmoo-green rounded-full" />
                      <div>
                        <div className="text-sm font-medium">
                          Point #{point.pointId.slice(-8)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {point.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {point.transactionHash && (
                      <a
                        href={`https://basescan.org/tx/${point.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Section */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="alert-info text-center mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Info className="w-4 h-4" />
                <span className="font-medium">How it works</span>
              </div>
              <p className="text-sm">
                {isContractAvailable 
                  ? "Each click generates a unique Shmoo point recorded on-chain. Keep clicking to maintain your streak!"
                  : "Demo mode: Points are tracked locally. Connect to Base mainnet for on-chain generation."
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 text-caption mb-2">
            <span>Built on</span>
            <a 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Base
            </a>
            <span>•</span>
            <span>Powered by</span>
            <a 
              href="https://onchainkit.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              OnchainKit
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            An experimental Base Mini App for generating verifiable digital points
          </p>
        </motion.div>
      </div>
    </main>
  );
}
