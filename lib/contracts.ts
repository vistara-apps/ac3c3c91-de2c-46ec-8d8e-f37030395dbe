import { Address, parseEther } from 'viem';

// Shmoo Point Contract ABI - Simplified for demo purposes
export const SHMOO_CONTRACT_ABI = [
  {
    inputs: [],
    name: 'generateShmooPoint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'pointId',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserPoints',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'points',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserPointCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'pointId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'ShmooPointGenerated',
    type: 'event',
  },
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Base Mainnet - Replace with actual deployed contract address
  8453: '0x0000000000000000000000000000000000000000' as Address,
  // Base Sepolia Testnet - Replace with actual deployed contract address  
  84532: '0x0000000000000000000000000000000000000000' as Address,
} as const;

// Get contract address for current chain
export function getContractAddress(chainId: number): Address | null {
  return CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES] || null;
}

// Contract interaction parameters
export const CONTRACT_CONFIG = {
  // Small fee to prevent spam (0.001 ETH)
  generatePointFee: parseEther('0.001'),
  // Gas limit for generateShmooPoint function
  gasLimit: 100000n,
} as const;

// Validate if contract is deployed on current chain
export function isContractDeployed(chainId: number): boolean {
  const address = getContractAddress(chainId);
  return address !== null && address !== '0x0000000000000000000000000000000000000000';
}

// Generate mock transaction hash for demo purposes
export function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate mock point ID
export function generateMockPointId(): string {
  return `point_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
