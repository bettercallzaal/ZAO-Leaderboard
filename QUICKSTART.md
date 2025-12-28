# Quick Start Guide

Get your ZAO Respect Leaderboard running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```bash
# Airtable Configuration
AIRTABLE_API_TOKEN=patXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Members

# Alchemy RPC
ALCHEMY_OPTIMISM_RPC=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY

# Smart Contract Addresses (Optimism)
ERC20_ZAO_CONTRACT=0x1234567890123456789012345678901234567890
ERC1155_ZOR_CONTRACT=0x1234567890123456789012345678901234567890
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test the API

Visit [http://localhost:3000/api/leaderboard](http://localhost:3000/api/leaderboard) to see the raw JSON data.

## Step 5: Test the Embed

Visit [http://localhost:3000/embed](http://localhost:3000/embed) to see the embeddable version.

## Next Steps

- **Deploy to Vercel**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Customize Design**: Edit `app/globals.css` and `components/LeaderboardTable.tsx`
- **Add Features**: See "Future Enhancements" in [README.md](./README.md)

## Troubleshooting

### "Failed to fetch leaderboard data"

1. Check your `.env.local` file exists and has all variables
2. Verify your Airtable token has read permissions
3. Ensure your Airtable table has `name` and `address` columns
4. Confirm contract addresses are on Optimism (not Ethereum mainnet)

### TypeScript Errors

Run `npm install` to ensure all dependencies are installed.

### Port Already in Use

If port 3000 is busy, run:
```bash
npm run dev -- -p 3001
```

## Need Help?

- Check [README.md](./README.md) for full documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Open an issue on GitHub
