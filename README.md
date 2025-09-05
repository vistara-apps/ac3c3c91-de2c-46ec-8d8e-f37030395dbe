# Shmoo Clicker

A Base Mini App that allows users to generate non-transferable Shmoo points by clicking a button, with verifiable on-chain actions.

## Features

- 🔗 **Wallet Connection**: Connect your Ethereum wallet via OnchainKit
- 🎯 **Click to Earn**: Generate Shmoo points with each click
- 📊 **Stats Tracking**: View your total clicks, streak count, and activity status
- 💳 **x402 Payment Flow**: Integrated payment protocol for USDC transactions
- 🔄 **Payment Verification**: Real-time USDC balance checking on Base network
- 🧾 **Transaction History**: Track payment confirmations and error handling
- ⚠️ **Clear Disclaimer**: Prominent warning about point value
- 📱 **Mobile-First**: Optimized for mobile devices and Base Mini App environment

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet Integration**: OnchainKit + MiniKit + Wagmi
- **Payment Protocol**: x402 with x402-axios integration
- **HTTP Client**: Axios with payment interceptors
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.local` and add your OnchainKit API key
   - Get your API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/onchainkit)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:3000`
   - Or test in Base Mini App environment

## How It Works

1. **Connect Wallet**: Users connect their Ethereum wallet
2. **Click Button**: Each click generates a Shmoo point
3. **Track Progress**: View stats including total clicks and streak count
4. **On-Chain Recording**: Points are recorded on Base network
5. **Streak System**: Maintain daily clicking to build streaks
6. **x402 Payments**: Test payment flow with USDC on Base network
7. **Payment Verification**: Automatic transaction confirmation and error handling

## Important Notes

⚠️ **Shmoo points are non-transferable and have no monetary value**

This is an experimental application designed for engagement and demonstration purposes only.

## x402 Payment Integration

This app implements the x402 payment protocol for seamless USDC transactions:

### Implementation Tasks Completed ✅

- [x] **Use wagmi useWalletClient + x402-axios**: Integrated wagmi wallet client with x402-axios interceptor
- [x] **Test payment flow end-to-end**: Implemented PaymentButton component with full flow testing
- [x] **Verify USDC on Base integration**: Added USDC balance verification on Base Sepolia network
- [x] **Check transaction confirmations**: Payment status tracking with transaction hash display
- [x] **Test error handling**: Comprehensive error handling with user-friendly status messages

### Key Components

- **PaymentService**: Core service handling x402 integration with wagmi wallet client
- **PaymentButton**: UI component for initiating x402 payments
- **PaymentStatus**: Real-time display of USDC balance and service status
- **Payment History**: Transaction tracking and confirmation display

### Usage

1. Connect your wallet using the wallet connection button
2. Ensure you have USDC on Base Sepolia network
3. Click the "Pay 0.01 USDC" button to test the x402 payment flow
4. Monitor payment status and transaction confirmations in real-time

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - see LICENSE file for details
