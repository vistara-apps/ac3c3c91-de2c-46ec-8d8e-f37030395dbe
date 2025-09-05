# Shmoo Clicker

A Base Mini App that allows users to generate non-transferable Shmoo points by clicking a button, with verifiable on-chain actions.

## Features

- 🔗 **Wallet Connection**: Connect your Ethereum wallet via OnchainKit
- 🎯 **Click to Earn**: Generate Shmoo points with each click
- 📊 **Stats Tracking**: View your total clicks, streak count, and activity status
- ⚠️ **Clear Disclaimer**: Prominent warning about point value
- 📱 **Mobile-First**: Optimized for mobile devices and Base Mini App environment

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet Integration**: OnchainKit + MiniKit
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

## Important Notes

⚠️ **Shmoo points are non-transferable and have no monetary value**

This is an experimental application designed for engagement and demonstration purposes only.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - see LICENSE file for details
