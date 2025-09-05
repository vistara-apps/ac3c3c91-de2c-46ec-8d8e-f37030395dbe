'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface ShmooButtonProps {
  onSuccess: () => void;
  disabled?: boolean;
}

export function ShmooButton({ onSuccess, disabled = false }: ShmooButtonProps) {
  const [isClicking, setIsClicking] = useState(false);
  const { address } = useAccount();
  
  const { writeContract, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const handleClick = async () => {
    if (!address || disabled || isClicking) return;
    
    setIsClicking(true);
    
    try {
      // For demo purposes, we'll simulate a transaction
      // In a real implementation, this would interact with a smart contract
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful transaction
      onSuccess();
    } catch (err) {
      console.error('Click failed:', err);
    } finally {
      setIsClicking(false);
    }
  };

  const isLoading = isClicking || isConfirming;

  return (
    <div className="text-center mb-8">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading || !address}
        className={`btn-primary w-64 h-32 text-4xl font-bold rounded-3xl ${
          disabled || !address 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:shadow-2xl'
        } ${isLoading ? 'animate-pulse' : ''}`}
      >
        {isLoading ? 'Clicking...' : 'Shmoo'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          Error: {error.message}
        </div>
      )}
      
      {!address && (
        <div className="mt-4 text-caption">
          Connect your wallet to start clicking
        </div>
      )}
    </div>
  );
}
