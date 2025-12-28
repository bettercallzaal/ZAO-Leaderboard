# ZAO Respect Leaderboard

> **Version 1.0.0** - Production-ready leaderboard tracking ZAO community Respect on Optimism

A real-time leaderboard that ranks ZAO community members by their total Respect holdings on Optimism. The application combines offchain identity data from Airtable with onchain token balances from the Optimism blockchain, creating an accurate, embeddable leaderboard.

## 🚀 Live Demo

- **Main Leaderboard**: [https://zao-leaderboard.vercel.app](https://zao-leaderboard.vercel.app)
- **Embed Version**: [https://zao-leaderboard.vercel.app/embed](https://zao-leaderboard.vercel.app/embed)
- **API Endpoint**: [https://zao-leaderboard.vercel.app/api/leaderboard](https://zao-leaderboard.vercel.app/api/leaderboard)

## ✨ Features

- ✅ Real-time blockchain data from Optimism mainnet
- ✅ Tracks both OG ZAO (ERC-20) and ZOR (ERC-1155) Respect tokens
- ✅ Member identity from Airtable (names + wallet addresses)
- ✅ Automatic ranking and sorting by total Respect
- ✅ Embeddable iframe version with customizable limits
- ✅ 5-minute API caching for optimal performance
- ✅ Responsive dark-mode UI with Tailwind CSS
- ✅ Client-side rendering for fast page loads

## 📊 Data Sources

### Airtable (Identity Registry)
- Member names
- Ethereum wallet addresses
- Provides the list of addresses to query

### Optimism Blockchain (Source of Truth)
- **OG ZAO Respect**: ERC-20 token balances
- **ZOR Respect**: ERC-1155 token balances (tokenId = 0)
- Real-time onchain data via Alchemy RPC

**Data Flow**: Airtable provides member identities → Blockchain provides token balances → Combined and ranked

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: ethers.js v6 for Optimism queries
- **Data**: Airtable API for identity registry
- **RPC**: Alchemy for Optimism mainnet access
- **Deployment**: Vercel with automatic deployments

## ⚙️ Environment Variables

Required environment variables (see `.env.local.template` for detailed template):

```bash
# Airtable Configuration
AIRTABLE_API_TOKEN=your_token_here          # From airtable.com/create/tokens
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX          # Your base ID (starts with 'app')
AIRTABLE_TABLE_NAME=Summary                  # Table with 'Name' and 'ETH WALLET' fields

# Blockchain Configuration
ALCHEMY_OPTIMISM_RPC=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
ERC20_ZAO_CONTRACT=0x34cE89baA7E4a4B00E17F7E4C0cb97105C216957
ERC1155_ZOR_CONTRACT=0x9885CCeEf7E8371Bf8d6f2413723D25917E7445c
```

**⚠️ Security**: Never commit `.env.local` to the repository. Add secrets via Vercel dashboard for production.

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/bettercallzaal/ZAO-Leaderboard.git
cd ZAO-Leaderboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.template .env.local
# Edit .env.local with your API keys

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the leaderboard.

### Production Deployment

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# - Connect your GitHub repository
# - Add environment variables in Vercel dashboard
# - Deploy automatically on every push
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel setup instructions.

## 📍 Routes & API

### Pages

- **`/`** - Main leaderboard with full rankings
- **`/embed`** - Minimal embeddable version
  - Supports `?limit=N` parameter (e.g., `/embed?limit=10`)

### API Endpoint

- **`/api/leaderboard`** - JSON API returning ranked member data
  - **Cache**: 5 minutes (300 seconds)
  - **Response**: Array of `LeaderboardEntry` objects

**Example API Response:**
```json
[
  {
    "name": "Member Name",
    "address": "0x1234...5678",
    "ogRespect": 3094,
    "zorRespect": 1250,
    "totalRespect": 4344,
    "rank": 1
  }
]
```

## 🎨 Embedding

### Basic Embed

```html
<iframe
  src="https://zao-leaderboard.vercel.app/embed"
  width="100%"
  height="900"
  style="border:none; border-radius:12px;"
></iframe>
```

### Top 10 Only

```html
<iframe
  src="https://zao-leaderboard.vercel.app/embed?limit=10"
  width="100%"
  height="600"
  style="border:none; border-radius:12px;"
></iframe>
```

### Responsive Embed

```html
<div style="position:relative; padding-bottom:75%; height:0; overflow:hidden;">
  <iframe
    src="https://zao-leaderboard.vercel.app/embed"
    style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"
  ></iframe>
</div>
```

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Vercel deployment guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and data flow
- **[.env.local.template](./.env.local.template)** - Environment variable template

## 🔧 Development

### Project Structure

```
├── app/
│   ├── api/leaderboard/     # API route for leaderboard data
│   ├── embed/               # Embeddable page
│   └── page.tsx             # Main leaderboard page
├── components/
│   └── LeaderboardTable.tsx # Reusable table component
├── lib/
│   ├── airtable.ts          # Airtable integration
│   ├── blockchain.ts        # Blockchain queries
│   └── contracts.ts         # Contract ABIs
└── types/
    └── leaderboard.ts       # TypeScript interfaces
```

### Key Technologies

- **Next.js 14 App Router**: Server and client components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **ethers.js v6**: Ethereum/Optimism interaction
- **Airtable SDK**: Database queries

## 📝 License

Built for the ZAO community

## 🔗 Links

- **Live App**: [zao-leaderboard.vercel.app](https://zao-leaderboard.vercel.app)
- **GitHub**: [github.com/bettercallzaal/ZAO-Leaderboard](https://github.com/bettercallzaal/ZAO-Leaderboard)
- **Optimism**: [optimism.io](https://www.optimism.io/)

---

**Version 1.0.0** | Built with ❤️ for the ZAO community
