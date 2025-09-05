import { createWalletClient, http, WalletClient, createPublicClient, publicActions, walletActions } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { withPaymentInterceptor } from 'x402-axios';
import axios, { AxiosInstance } from 'axios';
import { PaymentConfig, PaymentResult } from './types';

export class PaymentService {
  private axiosInstance: AxiosInstance | null = null;
  private walletClient: WalletClient | null = null;

  /**
   * Initialize the payment service with a wallet client
   */
  async initialize(walletClient: WalletClient, network: 'base' | 'base-sepolia' = 'base-sepolia'): Promise<void> {
    try {
      // Store the provided wallet client
      this.walletClient = walletClient;

      // Create axios instance with x402 payment interceptor
      const baseAxios = axios.create({
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // x402-axios expects a LocalAccount or SignerWallet
      // We'll pass the account directly since it should be compatible
      if (!walletClient.account) {
        throw new Error('Wallet client must have an account');
      }

      // Cast the account to any to bypass TypeScript strict checking
      // The x402 library should be able to work with the wagmi account
      this.axiosInstance = withPaymentInterceptor(baseAxios, walletClient.account as any);
      
      console.log('Payment service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize payment service:', error);
      throw error;
    }
  }

  /**
   * Make a payment-enabled request to an x402 protected endpoint
   */
  async makePaymentRequest(
    url: string, 
    config: PaymentConfig,
    requestOptions: any = {}
  ): Promise<PaymentResult> {
    if (!this.axiosInstance) {
      throw new Error('Payment service not initialized. Call initialize() first.');
    }

    try {
      console.log(`Making payment request to ${url} with config:`, config);
      
      const response = await this.axiosInstance.get(url, {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          'Accept': 'application/json',
        },
      });

      // Check for payment response header
      const paymentResponse = response.headers['x-payment-response'];
      
      return {
        success: true,
        transactionHash: paymentResponse?.transactionHash,
        paymentResponse: paymentResponse,
      };
    } catch (error: any) {
      console.error('Payment request failed:', error);
      
      return {
        success: false,
        error: error.message || 'Payment request failed',
      };
    }
  }

  /**
   * Test the payment flow with a demo endpoint
   */
  async testPaymentFlow(): Promise<PaymentResult> {
    const testConfig: PaymentConfig = {
      amount: '0.01',
      currency: 'USDC',
      network: 'base-sepolia',
      description: 'Test payment for Shmoo Clicker',
    };

    // Use a test x402 endpoint (you can replace this with an actual test endpoint)
    const testUrl = 'https://x402.org/protected';
    
    return this.makePaymentRequest(testUrl, testConfig);
  }

  /**
   * Verify USDC balance on Base network
   */
  async verifyUSDCBalance(address: string): Promise<{ balance: string; hasBalance: boolean }> {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet client not initialized');
      }

      // USDC contract address on Base Sepolia
      const USDC_CONTRACT_BASE_SEPOLIA = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
      
      // This is a simplified balance check - in a real implementation,
      // you would use the contract's balanceOf method
      console.log(`Checking USDC balance for address: ${address}`);
      
      // For demo purposes, we'll simulate a balance check
      // In a real implementation, you would call the USDC contract
      const mockBalance = '10.00'; // Mock balance for testing
      
      return {
        balance: mockBalance,
        hasBalance: parseFloat(mockBalance) > 0,
      };
    } catch (error) {
      console.error('Failed to verify USDC balance:', error);
      return {
        balance: '0.00',
        hasBalance: false,
      };
    }
  }

  /**
   * Get payment service status
   */
  getStatus(): { initialized: boolean; hasWallet: boolean; hasAxios: boolean } {
    return {
      initialized: this.walletClient !== null && this.axiosInstance !== null,
      hasWallet: this.walletClient !== null,
      hasAxios: this.axiosInstance !== null,
    };
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.walletClient = null;
    this.axiosInstance = null;
  }
}

// Export a singleton instance
export const paymentService = new PaymentService();
