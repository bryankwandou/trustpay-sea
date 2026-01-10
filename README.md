# TrustPay SEA 🛡️

> AI-Assisted Milestone Escrow for Freelancers & SMEs in Southeast Asia

TrustPay SEA adalah platform escrow berbasis milestone yang memungkinkan freelancer dan klien untuk bertransaksi dengan aman. AI memberikan **advisory** untuk membantu keputusan, namun **final decision selalu di tangan manusia**.

## ✨ Features

### For Freelancers
- 💰 **Guaranteed Payment** - Dana terkunci di escrow sebelum mulai kerja
- 📊 **Milestone-based** - Dibayar bertahap sesuai progress
- 🤖 **AI Advisory** - Saran untuk pricing, timeline, dan dispute
- ⚡ **Low Fees** - Hanya 2% platform fee, transaksi di jaringan low-cost

### For Clients
- 🔒 **Secure Escrow** - Dana aman sampai deliverable selesai
- ✅ **Quality Control** - Review setiap milestone sebelum release dana
- 👁️ **Transparency** - Track progress real-time di blockchain
- 🤝 **Fair Dispute** - Mediator netral untuk penyelesaian masalah

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Wallet (MetaMask, Coinbase Wallet, dll)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/trustpay-sea.git
cd trustpay-sea

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local dengan WalletConnect Project ID Anda
# Dapatkan gratis di https://cloud.walletconnect.com/

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to local network
npm run deploy:local

# Deploy to testnet (Polygon Mumbai)
npm run deploy:testnet

# Deploy to mainnet (Polygon)
npm run deploy:mainnet
```

## 🏗️ Project Structure

```
trustpay-sea/
├── contracts/              # Solidity smart contracts
│   ├── TrustPayEscrow.sol  # Main escrow contract
│   └── mocks/              # Mock contracts for testing
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Landing page
│   │   ├── create/         # Create deal flow
│   │   ├── dashboard/      # Deal listing
│   │   └── deal/[id]/      # Deal detail & dispute
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   ├── ai/             # AI advisory components
│   │   ├── wallet/         # Wallet connection
│   │   └── layout/         # Layout components
│   ├── lib/
│   │   ├── contracts/      # Contract hooks & config
│   │   ├── store.ts        # Zustand state management
│   │   ├── types.ts        # TypeScript types
│   │   └── utils.ts        # Utility functions
│   └── providers/          # React providers
├── test/                   # Contract tests
└── scripts/                # Deployment scripts
```

## 🔐 Security Principles

### Human-in-the-Loop
- **AI hanya ADVISORY** - tidak pernah mengontrol dana
- **Client approval required** - hanya klien yang bisa release dana
- **Mediator for disputes** - keputusan final oleh manusia

### Smart Contract Security
- OpenZeppelin contracts (battle-tested)
- ReentrancyGuard protection
- Pausable for emergencies
- Comprehensive test coverage

## 💡 UX Design Principles

1. **Tidak terasa crypto** - UX seperti invoice/marketplace biasa
2. **1 layar = 1 tujuan** - Fokus pada satu task per halaman
3. **Progressive disclosure** - Informasi muncul saat dibutuhkan
4. **Friendly terminology** - "Account" bukan "wallet address"

## 🌏 Supported Networks

| Network | Status | Type | Fees | Recommended |
|---------|--------|------|------|-------------|
| Lisk Sepolia | ✅ | Testnet | Free | 🎯 Hackathon |
| Lisk | ✅ | Mainnet | Low | Production |
| Polygon | ✅ | Mainnet | < $0.01 | ⭐ Best |
| Base | ✅ | Mainnet | < $0.05 | Good |
| Arbitrum | ✅ | Mainnet | < $0.10 | Good |

## 🚀 Deploy to Lisk Sepolia

### 1. Get Test ETH
- Visit [Lisk Sepolia Faucet](https://sepolia-faucet.lisk.com/)
- Enter your wallet address
- Get free test ETH

### 2. Configure Environment
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local:
PRIVATE_KEY=your_wallet_private_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. Deploy Smart Contract
```bash
# Compile contracts
npm run compile

# Deploy to Lisk Sepolia
npm run deploy:lisk
```

### 4. Update Config
After deployment, update contract address in:
- `.env.local` - Add `NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS`
- `src/lib/contracts/config.ts` - Update `CONTRACT_ADDRESSES.liskSepolia`

### 5. Build & Run
```bash
npm run build
npm run start
```

## 📜 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run linter

# Smart Contracts
npm run compile      # Compile contracts
npm run test         # Run contract tests
npm run deploy:local # Deploy to Hardhat
npm run deploy:testnet # Deploy to Mumbai
npm run deploy:mainnet # Deploy to Polygon
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Smart contract security
- [RainbowKit](https://rainbowkit.com/) - Wallet connection
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Next.js](https://nextjs.org/) - React framework

---

Built with 💙 for Southeast Asian freelancers and SMEs
