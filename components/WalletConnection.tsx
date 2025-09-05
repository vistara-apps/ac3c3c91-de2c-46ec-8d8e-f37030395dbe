'use client';

import { useState, useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Address } from '@coinbase/onchainkit/identity';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ExternalLink, Copy, Check, Wallet as WalletIcon } from 'lucide-react';
import { base, baseSepolia } from 'wagmi/chains';
import toast from 'react-hot-toast';
import { formatAddress, cn, getErrorMessage } from '@/lib/utils';

export function WalletConnection() {
  const [copied, setCopied] = useState(false);
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const expectedChainId = process.env.NODE_ENV === 'development' ? baseSepolia.id : base.id;
  const isWrongNetwork = isConnected && chainId !== expectedChainId;
  const currentChain = chainId === base.id ? base : baseSepolia;

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: expectedChainId });
      toast.success('Network switched successfully!');
    } catch (error) {
      toast.error(`Failed to switch network: ${getErrorMessage(error)}`);
    }
  };

  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Wrong Network Warning */}
      <AnimatePresence>
        {isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="alert-warning mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Wrong Network - Switch to Base</span>
              </div>
              <button
                onClick={handleSwitchNetwork}
                disabled={isSwitching}
                className="btn-secondary text-sm py-1 px-3"
              >
                {isSwitching ? 'Switching...' : 'Switch Network'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OnchainKit Wallet Component */}
      <div className="card">
        <Wallet>
          <ConnectWallet className="w-full">
            <div className="flex items-center justify-center gap-3 py-3">
              <WalletIcon className="w-5 h-5" />
              <span className="font-medium">Connect Wallet</span>
            </div>
          </ConnectWallet>
          
          <WalletDropdown>
            <div className="p-4 min-w-[280px]">
              {/* Connected Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="relative">
                  <Avatar className="h-10 w-10" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <CheckCircle className="w-2 h-2 text-white" />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <Name className="font-semibold text-gray-900" />
                  <div className="flex items-center gap-2 mt-1">
                    <Address className="text-sm text-muted-foreground font-mono" />
                    <button
                      onClick={copyAddress}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Network Status */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Network</span>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isWrongNetwork ? "bg-red-500" : "bg-green-500"
                    )} />
                    <span className="text-muted-foreground">
                      {currentChain.name}
                    </span>
                  </div>
                </div>
                
                {address && (
                  <div className="mt-2">
                    <a
                      href={`${currentChain.blockExplorers?.default.url}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on {currentChain.blockExplorers?.default.name}
                    </a>
                  </div>
                )}
              </div>

              {/* Network Switch Button */}
              {isWrongNetwork && (
                <button
                  onClick={handleSwitchNetwork}
                  disabled={isSwitching}
                  className="btn-primary w-full text-sm"
                >
                  {isSwitching ? 'Switching...' : 'Switch to Base'}
                </button>
              )}
            </div>
          </WalletDropdown>
        </Wallet>
      </div>
      
      {/* Success Message */}
      <AnimatePresence>
        {isConnected && address && !isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 alert-success text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Wallet connected successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
