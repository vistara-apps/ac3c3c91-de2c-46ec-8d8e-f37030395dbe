'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { paymentService } from '@/lib/paymentService';

interface PaymentStatusProps {
  className?: string;
}

export function PaymentStatus({ className = '' }: PaymentStatusProps) {
  const [usdcBalance, setUsdcBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<{
    initialized: boolean;
    hasWallet: boolean;
    hasAxios: boolean;
  }>({ initialized: false, hasWallet: false, hasAxios: false });
  
  const { address, isConnected } = useAccount();

  const checkBalance = async () => {
    if (!address || !isConnected) return;
    
    setIsLoading(true);
    try {
      const balanceResult = await paymentService.verifyUSDCBalance(address);
      setUsdcBalance(balanceResult.balance);
    } catch (error) {
      console.error('Failed to check USDC balance:', error);
      setUsdcBalance('Error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceStatus = () => {
    const status = paymentService.getStatus();
    setServiceStatus(status);
  };

  useEffect(() => {
    if (address && isConnected) {
      checkBalance();
    } else {
      setUsdcBalance('0.00');
    }
    updateServiceStatus();
  }, [address, isConnected]);

  // Update service status periodically
  useEffect(() => {
    const interval = setInterval(updateServiceStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isConnected || !address) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Payment Status</h3>
        <p className="text-sm text-gray-500">Connect wallet to view payment status</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">💳 Payment Status</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">USDC Balance:</span>
          <span className={`text-sm font-medium ${
            isLoading ? 'text-gray-400' : 
            parseFloat(usdcBalance) > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {isLoading ? 'Loading...' : `${usdcBalance} USDC`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Network:</span>
          <span className="text-sm font-medium text-blue-600">Base Sepolia</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">x402 Service:</span>
          <span className={`text-sm font-medium ${
            serviceStatus.initialized ? 'text-green-600' : 'text-gray-400'
          }`}>
            {serviceStatus.initialized ? '✅ Ready' : '⏳ Not initialized'}
          </span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Wallet Client:</span>
            <span className={serviceStatus.hasWallet ? 'text-green-500' : 'text-gray-400'}>
              {serviceStatus.hasWallet ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Payment Handler:</span>
            <span className={serviceStatus.hasAxios ? 'text-green-500' : 'text-gray-400'}>
              {serviceStatus.hasAxios ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
      
      <button
        onClick={checkBalance}
        disabled={isLoading}
        className="mt-3 w-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded-md transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Checking...' : 'Refresh Balance'}
      </button>
    </div>
  );
}
