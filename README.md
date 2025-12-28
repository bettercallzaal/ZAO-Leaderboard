# ZAO Respect Leaderboard

A production-ready leaderboard that ranks ZAO community members by their total Respect holdings on Optimism. The application combines offchain identity data from Airtable (name + address registry) with onchain token balances from Optimism blockchain (source of truth for OG ZAO and ZOR Respect), creating a real-time, embeddable leaderboard.

## Data Sources

- **Airtable**: Identity registry containing member names and wallet addresses
- **Optimism Blockchain**: Source of truth for Respect balances
  - OG ZAO Respect (ERC-20 token)
  - ZOR Respect (ERC-1155 token, tokenId = 0)

## Tech Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- ethers.js v6 for blockchain queries
- Airtable API for identity data
- Alchemy RPC for Optimism access
- Vercel for deployment

## Environment Variables

Required environment variables (see `.env.example` for template):

```bash
AIRTABLE_API_TOKEN          # Personal Access Token from airtable.com/create/tokens
AIRTABLE_BASE_ID            # Your Airtable base ID (starts with 'app')
AIRTABLE_TABLE_NAME         # Table name containing 'name' and 'address' columns
ALCHEMY_OPTIMISM_RPC        # Alchemy RPC URL for Optimism Mainnet
ERC20_ZAO_CONTRACT          # OG ZAO Respect ERC-20 contract address
ERC1155_ZOR_CONTRACT        # ZOR Respect ERC-1155 contract address
NEXT_PUBLIC_BASE_URL        # Your production URL (for deployment)
```

**⚠️ Never commit secrets to the repository. Use `.env.local` for local development.**

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template and add your values
cp .env.local.template .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the leaderboard.

## Routes

- **`/`** - Main leaderboard page
- **`/embed`** - Embeddable version (supports `?limit=N` parameter)
- **`/api/leaderboard`** - JSON API endpoint (5-minute cache)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

## Embedding

Use the `/embed` route for iframe integration:

```html
<iframe
  src="https://your-domain.vercel.app/embed"
  width="100%"
  height="900"
  style="border:none;border-radius:12px;"
></iframe>
```

Add `?limit=10` to show only top 10 entries.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details on data flow, security, and performance.

---

Built for the ZAO community
