# Climate DAO Documentation

Welcome to the Climate DAO documentation! This comprehensive guide covers all aspects of our AI-powered decentralized autonomous organization built on Algorand blockchain for climate action and carbon credit management.

## 🌍 Project Overview

Climate DAO is a revolutionary hybrid decision-making platform that combines artificial intelligence with human wisdom to fund and govern climate impact projects. Built on Algorand's carbon-negative blockchain, our platform enables transparent, efficient, and impactful climate action through intelligent governance.

### Key Features

- **AI-Powered Proposal Analysis**: Automated scoring and evaluation of climate proposals using Google Gemini API
- **Hybrid Governance**: Combining AI insights with community voting for optimal decision-making
- **Algorand Integration**: Leveraging carbon-negative blockchain infrastructure
- **Real-time Impact Tracking**: Comprehensive analytics and metrics for environmental impact
- **Tokenized Carbon Credits**: Transparent management and transfer of verified carbon credits

## 📚 Documentation Structure

| Document | Description |
|----------|-------------|
| [Introduction](./1.Introduction.md) | Project overview, mission, and vision |
| [System Overview](./2.System%20Overview.md) | High-level architecture and components |
| [Architecture](./3.Architecture.md) | Technical architecture and design patterns |
| [Core Components](./4.Core%20Components.md) | Detailed component specifications |
| [Smart Contracts](./5.%20Smart%20Contracts.md) | Algorand smart contract implementation |
| [AI Governance System](./6.%20AI%20Governance%20System.md) | AI analysis and decision-making system |
| [Climate Impact Credits](./7.%20Climate%20Impact%20Credits.md) | Carbon credit tokenization and management |
| [Token Economics](./8.%20Token%20Economics.md) | Economic model and tokenomics |
| [Governance Framework](./9.Governance%20Framework.md) | DAO governance structure and processes |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+ (for AlgoKit)
- Algorand wallet (Pera Wallet recommended)
- Google Gemini API key (for AI analysis)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lhcee3/AI-G-DAO.git
   cd AI-G-DAO
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure environment variables
   npm run dev
   ```

3. **Smart Contract Setup:**
   ```bash
   cd contracts/climate-dao
   algokit project bootstrap all
   algokit project run build
   ```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Algorand Configuration
NEXT_PUBLIC_ALGORAND_NETWORK=testnet
NEXT_PUBLIC_ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
NEXT_PUBLIC_INDEXER_URL=https://testnet-idx.algonode.cloud

# Smart Contract IDs (configure after deployment)
NEXT_PUBLIC_CLIMATE_DAO_CONTRACT_ID=
NEXT_PUBLIC_GOVERNANCE_TOKEN_CONTRACT_ID=
```

## 🏗️ Project Structure

```
AI-G-DAO/
├── backend/                 # Backend services (future implementation)
├── contracts/              
│   └── climate-dao/        # Algorand smart contracts
│       ├── smart_contracts/ # Contract source code
│       └── projects/       # AlgoKit project configuration
├── docs/                   # Project documentation
├── frontend/               # Next.js React application
│   ├── app/               # Next.js 13+ app router
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility libraries
└── .github/              # GitHub workflows and templates
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Blockchain
- **Algorand** - Carbon-negative blockchain platform
- **AlgoKit** - Algorand development framework
- **Algorand SDK** - JavaScript/TypeScript SDK

### AI & APIs
- **Google Gemini API** - AI-powered proposal analysis
- **Custom AI Scoring** - Environmental impact assessment

### Development Tools
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipelines

## 🌟 Key Features

### 1. Hybrid Decision-Making
- AI evaluates proposals for environmental impact
- Community votes on AI-analyzed proposals
- Transparent scoring and recommendation system

### 2. Comprehensive Proposal System
- Submit climate project proposals
- AI-powered analysis and scoring
- Community review and voting
- Automated funding distribution

### 3. Real-time Analytics
- Environmental impact metrics
- Project performance tracking
- Token economics monitoring
- DAO governance statistics

### 4. Wallet Integration
- Algorand wallet connectivity
- Multi-wallet support (Pera, MyAlgo)
- Secure transaction handling
- Balance and asset management

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code style and standards
- Development workflow
- Pull request process
- Issue reporting guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🔗 Links

- **Website**: [Climate DAO](https://climate-dao.vercel.app)
- **GitHub**: [AI-G-DAO Repository](https://github.com/lhcee3/AI-G-DAO)
- **Developer**: [Aneesh](https://github.com/lhcee3)
- **Algorand**: [Official Website](https://algorand.com)

## 📞 Support

For questions, issues, or contributions:

1. Check the [documentation](./README.md)
2. Search [existing issues](https://github.com/lhcee3/AI-G-DAO/issues)
3. Create a [new issue](https://github.com/lhcee3/AI-G-DAO/issues/new)
4. Join our community discussions

---

Built with ❤️ for climate action on Algorand blockchain.
