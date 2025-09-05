'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { motion } from 'framer-motion';
import { Sparkles, Zap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  SHMOO_CONTRACT_ABI, 
  getContractAddress, 
  CONTRACT_CONFIG, 
  isContractDeployed,
  generateMockTxHash,
  generateMockPointId 
} from '@/lib/contracts';
import { cn, triggerHapticFeedback, playClickSound, getErrorMessage } from '@/lib/utils';

interface ShmooButtonProps {
  onSuccess: (pointId: string, txHash?: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ShmooButton({ onSuccess, disabled = false, className }: ShmooButtonProps) {
  const [isClicking, setIsClicking] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  
  const { address } = useAccount();
  const chainId = useChainId();
  
  const contractAddress = getContractAddress(chainId);
  const isContractAvailable = isContractDeployed(chainId);
  
  const { writeContract, data: hash, error, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && hash) {
      const pointId = generateMockPointId();
      onSuccess(pointId, hash);
      setShowSparkles(true);
      
      toast.success('Shmoo Point Generated! 🎉', {
        duration: 4000,
      });
      
      // Hide sparkles after animation
      setTimeout(() => setShowSparkles(false), 2000);
    }
  }, [isSuccess, hash, onSuccess]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(`Click failed: ${getErrorMessage(error)}`, {
        duration: 5000,
      });
    }
  }, [error]);

  const handleClick = async () => {
    if (!address || disabled || isClicking) return;
    
    // Reset any previous errors
    reset();
    setIsClicking(true);
    setClickCount(prev => prev + 1);
    
    // Provide immediate feedback
    triggerHapticFeedback();
    playClickSound();
    
    try {
      if (isContractAvailable && contractAddress) {
        // Real on-chain transaction
        await writeContract({
          address: contractAddress,
          abi: SHMOO_CONTRACT_ABI,
          functionName: 'generateShmooPoint',
          value: CONTRACT_CONFIG.generatePointFee,
          gas: CONTRACT_CONFIG.gasLimit,
        });
      } else {
        // Demo mode - simulate transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful transaction
        const mockTxHash = generateMockTxHash();
        const pointId = generateMockPointId();
        
        onSuccess(pointId, mockTxHash);
        setShowSparkles(true);
        
        toast.success('Demo Shmoo Point Generated! 🎉', {
          duration: 4000,
        });
        
        setTimeout(() => setShowSparkles(false), 2000);
      }
    } catch (err) {
      console.error('Click failed:', err);
      toast.error(`Click failed: ${getErrorMessage(err)}`);
    } finally {
      setIsClicking(false);
    }
  };

  const isLoading = isClicking || isConfirming;
  const canClick = address && !disabled && !isLoading;

  return (
    <div className={cn("text-center mb-8 relative", className)}>
      {/* Sparkles animation */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 128, // Center of button
                y: 64,  // Center of button
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: 128 + (Math.random() - 0.5) * 200,
                y: 64 + (Math.random() - 0.5) * 200,
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main button */}
      <motion.button
        onClick={handleClick}
        disabled={!canClick}
        className={cn(
          "relative w-64 h-32 text-4xl font-bold rounded-3xl transition-all duration-200",
          "bg-gradient-to-br from-shmoo-green to-green-600",
          "text-white shadow-lg",
          canClick && "hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer",
          canClick && "hover:from-green-500 hover:to-green-700",
          !canClick && "opacity-50 cursor-not-allowed",
          isLoading && "animate-pulse-glow"
        )}
        whileTap={canClick ? { scale: 0.95 } : {}}
        whileHover={canClick ? { scale: 1.05 } : {}}
      >
        <div className="flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>
              <span className="text-2xl">
                {isConfirming ? 'Confirming...' : 'Clicking...'}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-8 h-8" />
              <span>Shmoo</span>
            </>
          )}
        </div>
        
        {/* Click counter badge */}
        {clickCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-accent text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center"
          >
            {clickCount}
          </motion.div>
        )}
      </motion.button>
      
      {/* Status messages */}
      <div className="mt-4 space-y-2">
        {!address && (
          <div className="flex items-center justify-center gap-2 text-caption">
            <AlertCircle className="w-4 h-4" />
            <span>Connect your wallet to start clicking</span>
          </div>
        )}
        
        {address && !isContractAvailable && (
          <div className="alert-info text-sm">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Demo mode - Points are not recorded on-chain</span>
            </div>
          </div>
        )}
        
        {address && isContractAvailable && (
          <div className="text-caption">
            <span>Fee: 0.001 ETH per click • Points recorded on Base</span>
          </div>
        )}
        
        {hash && (
          <div className="text-caption">
            <span>Transaction: </span>
            <a 
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
