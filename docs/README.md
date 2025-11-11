# TerraLinke

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/lhcee3/AI-G-DAO)
[![Tests](https://img.shields.io/badge/tests-25%2F25%20passed-brightgreen)](https://github.com/lhcee3/AI-G-DAO/blob/main/test/test-results/TEST_RESULTS_LOG.md)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/lhcee3/AI-G-DAO/blob/main/test/test-results/TEST_RESULTS_LOG.md)
[![Platform](https://img.shields.io/badge/platform-TerraLinke%20DAO-blue)](https://terralinke.vercel.app)

An AI-Governed Decentralized Autonomous Organization (DAO) for climate action, combining artificial intelligence with community governance to fund and manage environmental impact projects on Algorand's carbon-negative blockchain.

## Overview

TerraLinke is a hybrid governance platform that leverages AI-powered analysis and blockchain technology to evaluate, fund, and track climate impact projects. Built on Algorand's sustainable infrastructure, the platform provides transparent, efficient, and scalable solutions for environmental project management.

**Live Application**: [terralinke.vercel.app](https://terralinke.vercel.app)

**Smart Contract (Algorand TestNet)**: [Application ID 744174033](https://lora.algokit.io/testnet/application/744174033)

**Test Results**: [View comprehensive test documentation](https://github.com/lhcee3/AI-G-DAO/blob/main/test/test-results/TEST_RESULTS_LOG.md)

## Key Features

### Hybrid Governance System
- AI-powered proposal analysis using Google Gemini API for comprehensive environmental impact scoring
- Community-driven voting with real-time transaction confirmation
- Blockchain-verified vote tracking and validation
- Transparent decision-making process combining artificial intelligence with human oversight

### Advanced Project Management
- Intelligent proposal submission and evaluation system
- Real-time vote tracking with blockchain verification
- Automated impact assessment and monitoring
- Smart contract-based funding distribution

### Performance-Optimized Architecture
- Dynamic imports and lazy loading for optimized page loads
- Aggressive 200KB localStorage management with automatic cleanup
- Sub-15KB homepage bundle size for lightning-fast initial load
- Mobile-first responsive design across all devices

### Enterprise-Grade Infrastructure
- Algorand blockchain integration for carbon-negative operations
- Multi-wallet support with secure Web3 connectivity
- Smart contract automation for transparent governance
- Immutable record-keeping and data integrity

## Technology Stack

### Frontend
- **Next.js 15.2.4** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Lucide React** - Icon system

### Blockchain & Web3
- **Algorand** - Carbon-negative blockchain infrastructure
- **AlgoKit** - Algorand development framework
- **Pera Wallet** - Wallet integration
- **Smart Contracts** - Automated governance and funding

### AI & Analytics
- **Google Gemini API** - AI-powered proposal analysis
- **Custom Impact Scoring** - Environmental assessment algorithms
- **Real-time Analytics** - Live metrics and tracking

## Documentation

Comprehensive documentation is available in the `docs` directory:

| Document | Description |
|----------|-------------|
| [Introduction](./docs/1.Introduction.md) | Project overview, mission, and vision |
| [System Overview](./docs/2.System%20Overview.md) | High-level architecture and components |
| [Architecture](./docs/3.Architecture.md) | Technical architecture and design patterns |
| [Core Components](./docs/4.Core%20Components.md) | Detailed component specifications |
| [Smart Contracts](./docs/5.%20Smart%20Contracts.md) | Algorand smart contract implementation |
| [AI Governance System](./docs/6.%20AI%20Governance%20System.md) | AI analysis and decision-making system |
| [Climate Impact Credits](./docs/7.%20Climate%20Impact%20Credits.md) | Carbon credit tokenization and management |
| [Token Economics](./docs/8.%20Token%20Economics.md) | Economic model and tokenomics |
| [Governance Framework](./docs/9.Governance%20Framework.md) | DAO governance structure and processes |
| [Problem Statement](./docs/10.Problem%20Statement.md) | Climate funding crisis and solution approach |
| [Multi-Industry Adaptation](./docs/11.Multi-Industry%20Adaptation%20Guide.md) | Scalability across industries |
| [ARC Standards Compliance](./docs/12.ARC%20Standards%20Compliance%20Report.md) | Algorand standards compliance and security |

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.8+ (for AlgoKit)
- Algorand wallet (Pera Wallet recommended)
- Google Gemini API key (for AI analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lhcee3/AI-G-DAO.git
   cd AI-G-DAO
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure environment variables (see below)
   npm run dev   # Development server
   npm run build # Production build
   ```

3. **Smart Contract Setup**
   ```bash
   cd contracts/climate-dao
   algokit project bootstrap all
   algokit project run build
   ```

### Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
# Application Configuration
NEXT_PUBLIC_BASE_URL=https://terralinke.vercel.app

# AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Algorand Configuration
NEXT_PUBLIC_ALGORAND_NETWORK=testnet
NEXT_PUBLIC_ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
NEXT_PUBLIC_INDEXER_URL=https://testnet-idx.algonode.cloud

# Smart Contract IDs
NEXT_PUBLIC_CLIMATE_DAO_CONTRACT_ID=744174033
NEXT_PUBLIC_GOVERNANCE_TOKEN_CONTRACT_ID=
```

## Project Structure

```
AI-G-DAO/
├── contracts/              
│   └── climate-dao/           # Algorand smart contracts
│       ├── smart_contracts/   # Contract source code
│       └── projects/          # AlgoKit project configuration
├── docs/                      # Comprehensive documentation
├── frontend/                  # Next.js React application
│   ├── app/                   # Next.js app router
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utility libraries
├── test/                      # Test suite and results
│   └── test-results/          # Test documentation
└── .github/                   # GitHub workflows and templates
```

## Core Capabilities

### 1. AI-Enhanced Governance
- Automated proposal evaluation using advanced language models
- Environmental impact scoring with scientific precision
- Data-driven decision support for community voting
- Continuous learning and model improvement

### 2. Blockchain Integration
- Transparent, immutable voting records on Algorand
- Smart contract automation for trustless operations
- Carbon-negative infrastructure (99% energy reduction vs. Bitcoin)
- Multi-wallet support for seamless user experience

### 3. Climate Project Lifecycle
- Proposal submission with AI-powered preliminary assessment
- Community voting with real-time blockchain confirmation
- Automated fund distribution based on governance outcomes
- Ongoing impact monitoring and reporting

### 4. Storage and Performance
- Intelligent localStorage management (200KB optimization)
- Automatic cleanup of expired proposals every 30 minutes
- Real-time storage monitoring and alerts
- Optimized data structures for mobile compatibility

## Testing

TerraLinke maintains comprehensive test coverage across all critical systems:

- **Build Status**: Passing
- **Test Suite**: 25/25 tests passing
- **Code Coverage**: 100%
- **Platform**: Fully operational

View detailed test results and methodology in the [Test Results Documentation](https://github.com/lhcee3/AI-G-DAO/blob/main/test/test-results/TEST_RESULTS_LOG.md).

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please ensure all tests pass and maintain code coverage standards. See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Security

TerraLinke implements multiple security layers:

- Smart contract auditing and ARC standards compliance
- Secure wallet integration with industry-standard protocols
- Encrypted data transmission and storage
- Regular security assessments and updates

For security concerns, please review our security policy or contact the development team.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](./LICENSE) file for complete details.

## Links and Resources

- **Live Application**: [terralinke.vercel.app](https://terralinke.vercel.app)
- **GitHub Repository**: [AI-G-DAO](https://github.com/lhcee3/AI-G-DAO)
- **Smart Contract**: [Algorand TestNet Application](https://lora.algokit.io/testnet/application/744174033)
- **Test Documentation**: [Test Results](https://github.com/lhcee3/AI-G-DAO/blob/main/test/test-results/TEST_RESULTS_LOG.md)
- **Developer**: [Aneesh](https://github.com/lhcee3)
- **Algorand**: [Official Website](https://algorand.com)

## Support

For questions, issues, or feature requests:

1. Review the [documentation](./docs/README.md)
2. Search [existing issues](https://github.com/lhcee3/AI-G-DAO/issues)
3. Create a [new issue](https://github.com/lhcee3/AI-G-DAO/issues/new)
4. Join community discussions

---

**TerraLinke** - AI-Governed DAO for Climate Action  
Built on Algorand's carbon-negative blockchain for sustainable environmental impact.