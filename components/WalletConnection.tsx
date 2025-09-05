'use client';

import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { Name, Avatar, Address } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

export function WalletConnection() {
  const { address, isConnected } = useAccount();

  return (
    <div className="mb-6">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-8 w-8" />
              <div>
                <Name className="font-semibold" />
                <Address className="text-sm text-gray-600" />
              </div>
            </div>
          </div>
        </WalletDropdown>
      </Wallet>
      
      {isConnected && address && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center text-sm">
          ✅ Wallet connected successfully
        </div>
      )}
    </div>
  );
}
