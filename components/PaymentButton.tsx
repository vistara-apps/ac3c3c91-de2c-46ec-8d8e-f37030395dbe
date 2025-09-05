'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { paymentService } from '@/lib/paymentService';
import { PaymentResult } from '@/lib/types';

interface PaymentButtonProps {
  onPaymentSuccess?: (result: PaymentResult) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
  amount?: string;
  description?: string;
}

export function PaymentButton({ 
  onPaymentSuccess, 
  onPaymentError, 
  disabled = false,
  amount = '0.01',
  description = 'Shmoo Clicker Payment'
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handlePayment = async () => {
    if (!address || !walletClient || !isConnected) {
      const error = 'Wallet not connected';
      setPaymentStatus(error);
      onPaymentError?.(error);
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('Initializing payment service...');

    try {
      // Initialize payment service with wallet client
      await paymentService.initialize(walletClient, 'base-sepolia');
      
      setPaymentStatus('Testing payment flow...');
      
      // Test the payment flow
      const result = await paymentService.testPaymentFlow();
      
      if (result.success) {
        setPaymentStatus('Payment successful!');
        onPaymentSuccess?.(result);
      } else {
        const error = result.error || 'Payment failed';
        setPaymentStatus(`Payment failed: ${error}`);
        onPaymentError?.(error);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Payment processing failed';
      setPaymentStatus(`Error: ${errorMessage}`);
      onPaymentError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="text-center mb-6">
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing || !isConnected || !address}
        className={`btn-primary w-64 h-20 text-lg font-bold rounded-2xl ${
          disabled || !address || !isConnected
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:shadow-xl'
        } ${isProcessing ? 'animate-pulse' : ''}`}
      >
        {isProcessing ? 'Processing...' : `Pay ${amount} USDC`}
      </button>
      
      {paymentStatus && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          paymentStatus.includes('successful') 
            ? 'bg-green-100 text-green-700' 
            : paymentStatus.includes('failed') || paymentStatus.includes('Error')
            ? 'bg-red-100 text-red-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {paymentStatus}
        </div>
      )}
      
      {!address && (
        <div className="mt-4 text-caption">
          Connect your wallet to make payments
        </div>
      )}
    </div>
  );
}
