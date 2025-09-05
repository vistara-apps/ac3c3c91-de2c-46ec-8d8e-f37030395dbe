'use client';

import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { type ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Determine which chain to use based on environment
const getChain = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const forceMainnet = process.env.NEXT_PUBLIC_FORCE_MAINNET === 'true';
  
  if (forceMainnet || !isDevelopment) {
    return base; // Base Mainnet
  }
  
  return baseSepolia; // Base Sepolia for development
};

export function Providers({ children }: { children: ReactNode }) {
  // Create a stable QueryClient instance
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          retry: 3,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: 1,
        },
      },
    })
  );

  const chain = getChain();
  const apiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key';

  return (
    <QueryClientProvider client={queryClient}>
      <MiniKitProvider
        chain={chain}
        apiKey={apiKey}
        config={{
          appearance: {
            name: 'Shmoo Clicker',
            logo: '/favicon.ico',
            mode: 'auto',
            theme: 'default',
          },
          wallet: {
            termsUrl: 'https://example.com/terms',
            privacyUrl: 'https://example.com/privacy',
          },
        }}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: '12px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#fff',
                secondary: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
          }}
        />
      </MiniKitProvider>
    </QueryClientProvider>
  );
}
