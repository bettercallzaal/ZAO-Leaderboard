# ZAO Respect Leaderboard

A production-ready, embeddable leaderboard for the ZAO community that tracks Respect balances on Optimism.

## Overview

This Next.js application combines offchain identity data from Airtable with onchain token balances from Optimism to create a real-time leaderboard. It displays OG ZAO (ERC-20) and ZOR (ERC-1155) Respect balances, ranking community members by total Respect.

## Features

- **Server-Side Data Fetching**: All API keys and secrets remain server-side
- **Real-Time Blockchain Data**: Fetches live balances from Optimism via Alchemy
- **Airtable Integration**: Uses Airtable as a CMS for identity management
- **Embeddable**: Dedicated `/embed` route for iframe integration
- **Responsive Design**: Modern, dark-mode UI optimized for all devices
- **Automatic Caching**: 5-minute revalidation with stale-while-revalidate
- **No Wallet Required**: Pure read-only, no MetaMask or wallet connections

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: ethers.js v6
- **Data Source**: Airtable API
- **RPC Provider**: Alchemy (Optimism)
- **Deployment**: Vercel

## Prerequisites

Before deploying, you need:

1. **Airtable Account**
   - Create a base with a table containing `name` and `address` fields
   - Generate a Personal Access Token with read permissions
   - Note your Base ID and Table Name

2. **Alchemy Account**
   - Sign up at [alchemy.com](https://www.alchemy.com/)
   - Create an Optimism Mainnet app
   - Copy your RPC URL

3. **Smart Contract Addresses**
   - ERC-20 contract address for OG ZAO Respect
   - ERC-1155 contract address for ZOR Respect

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Airtable Configuration
AIRTABLE_API_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name

# Alchemy RPC
ALCHEMY_OPTIMISM_RPC=https://opt-mainnet.g.alchemy.com/v2/your_api_key

# Smart Contract Addresses (Optimism)
ERC20_ZAO_CONTRACT=0x...
ERC1155_ZOR_CONTRACT=0x...

# Optional: For production deployment
NEXT_PUBLIC_BASE_URL=https://leaderboard.thezao.com
```

### Getting Your Airtable Credentials

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a new token with `data.records:read` scope
3. Add access to your specific base
4. Copy the token to `AIRTABLE_API_TOKEN`

To find your Base ID:
- Open your Airtable base
- Go to Help → API Documentation
- The Base ID is shown in the introduction (starts with `app...`)

### Getting Your Alchemy RPC URL

1. Sign up at [alchemy.com](https://www.alchemy.com/)
2. Create a new app on Optimism Mainnet
3. Click "View Key" and copy the HTTPS URL
4. Paste into `ALCHEMY_OPTIMISM_RPC`

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the leaderboard.

## Project Structure

```
zao-leaderboard/
├── app/
│   ├── api/
│   │   └── leaderboard/
│   │       └── route.ts          # API endpoint for leaderboard data
│   ├── embed/
│   │   ├── layout.tsx            # Minimal layout for embeds
│   │   └── page.tsx              # Embed page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main leaderboard page
├── components/
│   └── LeaderboardTable.tsx      # Reusable table component
├── lib/
│   ├── airtable.ts               # Airtable data fetching
│   ├── blockchain.ts             # Blockchain balance queries
│   └── contracts.ts              # Smart contract ABIs
├── types/
│   └── leaderboard.ts            # TypeScript interfaces
├── .env.example                  # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## API Routes

### GET `/api/leaderboard`

Returns the complete leaderboard sorted by total Respect.

**Response:**
```json
[
  {
    "rank": 1,
    "name": "Alice",
    "address": "0x1234...",
    "ogRespect": 1000.50,
    "zorRespect": 500.25,
    "totalRespect": 1500.75
  }
]
```

**Caching:**
- Revalidates every 5 minutes (300 seconds)
- Uses `stale-while-revalidate` for optimal performance

## Pages

### Main Leaderboard (`/`)

Full-featured leaderboard with:
- Header and branding
- Complete table with all columns
- Footer with attribution
- Responsive design

### Embed Page (`/embed`)

Minimal layout designed for iframe embedding:
- No header/footer
- Just the table
- Optional `?limit=N` query parameter to show top N entries

**Example:**
```html
<iframe
  src="https://leaderboard.thezao.com/embed?limit=10"
  width="100%"
  height="900"
  style="border:none;border-radius:12px;"
></iframe>
```

## Deployment on Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add AIRTABLE_API_TOKEN
vercel env add AIRTABLE_BASE_ID
vercel env add AIRTABLE_TABLE_NAME
vercel env add ALCHEMY_OPTIMISM_RPC
vercel env add ERC20_ZAO_CONTRACT
vercel env add ERC1155_ZOR_CONTRACT
vercel env add NEXT_PUBLIC_BASE_URL

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add all environment variables in the settings
6. Deploy

### Important: Set Production URL

After deployment, add your production URL:

```bash
vercel env add NEXT_PUBLIC_BASE_URL production
# Enter: https://your-domain.vercel.app
```

Or set it in the Vercel dashboard under Settings → Environment Variables.

## Embedding the Leaderboard

### Basic Embed

```html
<iframe
  src="https://leaderboard.thezao.com/embed"
  width="100%"
  height="900"
  style="border:none;border-radius:12px;"
></iframe>
```

### Top 10 Only

```html
<iframe
  src="https://leaderboard.thezao.com/embed?limit=10"
  width="100%"
  height="600"
  style="border:none;border-radius:12px;"
></iframe>
```

### Responsive Embed

```html
<div style="position:relative;padding-bottom:75%;height:0;overflow:hidden;">
  <iframe
    src="https://leaderboard.thezao.com/embed"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
  ></iframe>
</div>
```

## Architecture

### Data Flow

1. **Airtable** → Identity data (name, address)
2. **Optimism** → Token balances (OG ZAO, ZOR)
3. **API Route** → Combines data, calculates totals, ranks entries
4. **Frontend** → Displays table with formatting

### Security

- All API keys stored server-side only
- No client-side blockchain connections
- Read-only access to all data sources
- CORS headers configured for embed route

### Performance

- Server-side rendering (SSR)
- 5-minute cache with stale-while-revalidate
- Parallel blockchain queries
- Optimized bundle size

## Future Enhancements

The architecture supports:

- **Historical Snapshots**: Track Respect over time
- **Role Filtering**: Filter by Fractal Host, Festival, etc.
- **Pagination**: Handle large datasets
- **CSV Export**: Download leaderboard data
- **Token Gating**: Restrict access based on holdings
- **Search**: Find specific members
- **Charts**: Visualize Respect distribution

## Troubleshooting

### "Failed to fetch leaderboard data"

- Check all environment variables are set correctly
- Verify Airtable token has read permissions
- Ensure Alchemy RPC URL is valid
- Check contract addresses are correct

### Embed not loading

- Verify CORS headers in `next.config.js`
- Check iframe src URL is correct
- Ensure production URL is set in environment variables

### Balances showing as 0

- Verify contract addresses are on Optimism (not Ethereum mainnet)
- Check addresses in Airtable are valid Ethereum addresses
- Confirm Alchemy API key has Optimism access

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the ZAO community.

---

Built with ❤️ for the ZAO community
