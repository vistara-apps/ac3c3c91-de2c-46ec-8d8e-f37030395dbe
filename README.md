# Shmoo Clicker - Base Mini App

A fully functional and production-ready Next.js Base Mini App that allows users to generate non-transferrable Shmoo points by clicking a button. Built with OnchainKit and deployed on Base network.

## 🎯 Features

### Core Functionality
- **Shmoo Point Generation**: Click to generate unique, on-chain, non-transferrable points
- **Engagement Tracking**: Visual streak tracking and click history
- **On-Chain Verifiability**: Points recorded on Ethereum Base network
- **Clear Value Disclaimer**: Transparent messaging about point value

### Technical Features
- **Wallet Integration**: Seamless wallet connection via OnchainKit
- **Network Support**: Base Mainnet and Sepolia testnet
- **Demo Mode**: Local tracking when contract unavailable
- **Responsive Design**: Mobile-first Base Mini App interface
- **Real-time Feedback**: Animations, sounds, and haptic feedback
- **Progress Tracking**: Streak visualization and statistics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Base-compatible wallet (Coinbase Wallet, MetaMask, etc.)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shmoo-clicker
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_FORCE_MAINNET=false  # Set to true for mainnet
```

4. **Run Development Server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Blockchain**: Base (Ethereum L2)
- **Wallet**: OnchainKit + Wagmi
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **TypeScript**: Full type safety
- **State Management**: React hooks + localStorage

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   └── providers.tsx      # Wallet and query providers
├── components/            # React components
│   ├── ShmooButton.tsx    # Main click button with animations
│   ├── StatsCard.tsx      # User statistics display
│   ├── WalletConnection.tsx # Wallet connection UI
│   └── WarningBanner.tsx  # Disclaimer banner
├── lib/                   # Utility libraries
│   ├── contracts.ts       # Smart contract interfaces
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Helper functions
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: `hsl(240 100% 50%)` - Shmoo Green
- **Accent**: `hsl(180 70% 50%)` - Cyan accent
- **Background**: `hsl(220 20% 98%)` - Light background
- **Surface**: `hsl(255 100% 100%)` - White cards

### Typography
- **Display**: `text-3xl font-bold` - Headings
- **Body**: `text-base font-normal leading-6` - Body text
- **Caption**: `text-sm text-muted-foreground` - Small text

### Components
- **Buttons**: Primary, outline, and secondary variants
- **Cards**: Default and compact layouts
- **Alerts**: Warning, info, and success states
- **Progress**: Animated progress bars and indicators

## 🔧 Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

# Optional
NEXT_PUBLIC_FORCE_MAINNET=false
NEXT_PUBLIC_ENABLE_SOUND_EFFECTS=true
NEXT_PUBLIC_ENABLE_HAPTIC_FEEDBACK=true
```

### Network Configuration
- **Development**: Base Sepolia (testnet)
- **Production**: Base Mainnet
- **Fallback**: Demo mode with local storage

### Smart Contract
The app expects a deployed contract with the following interface:
```solidity
function generateShmooPoint() external payable returns (uint256);
function getUserPoints(address user) external view returns (uint256[] memory);
function getUserPointCount(address user) external view returns (uint256);
```

## 📱 Base Mini App Integration

### MiniKit Setup
The app is configured as a Base Mini App using OnchainKit's MiniKit:

```typescript
// Automatic frame initialization
const { setFrameReady } = useMiniKit();
useEffect(() => {
  setFrameReady();
}, [setFrameReady]);
```

### Wallet Integration
- Seamless wallet connection via OnchainKit
- Network switching support
- Transaction status tracking
- Error handling and user feedback

## 🎮 User Experience

### Click Flow
1. **Connect Wallet**: Users connect Base-compatible wallet
2. **Network Check**: Automatic network validation and switching
3. **Click Button**: Generate Shmoo points with visual feedback
4. **Track Progress**: View stats, streaks, and recent points
5. **On-chain Verification**: Points recorded on Base network

### Feedback Systems
- **Visual**: Sparkle animations and progress indicators
- **Audio**: Click sounds via Web Audio API
- **Haptic**: Vibration feedback on mobile devices
- **Toast**: Success/error notifications

## 🔒 Security & Disclaimers

### Point Value
- **Non-transferrable**: Points cannot be moved between wallets
- **No monetary value**: Points have no inherent financial worth
- **Experimental**: This is a demonstration application

### Smart Contract Security
- Small fee (0.001 ETH) prevents spam
- Gas limits prevent excessive consumption
- TruffleHog scanning prevents secret commits

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm run start
```

### Environment Setup
- Set `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- Configure contract addresses
- Enable production features

## 🧪 Development

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Testing
- Manual testing with Base Sepolia testnet
- Wallet connection testing
- Transaction flow validation
- Mobile responsiveness testing

## 📊 Analytics & Monitoring

### Built-in Tracking
- Click statistics and streaks
- User engagement metrics
- Transaction success rates
- Error logging and reporting

### Optional Integrations
- Google Analytics
- Sentry error tracking
- Custom analytics endpoints

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Base Network**: [https://base.org](https://base.org)
- **OnchainKit**: [https://onchainkit.xyz](https://onchainkit.xyz)
- **Base Mini Apps**: [https://docs.base.org/mini-apps](https://docs.base.org/mini-apps)
- **Wagmi**: [https://wagmi.sh](https://wagmi.sh)

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check Base documentation
- Join Base Discord community

---

**⚠️ Disclaimer**: Shmoo points are non-transferrable and have no intrinsic value. This is an experimental application for demonstration purposes only.
