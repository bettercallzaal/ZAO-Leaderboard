# Deployment Guide

## Quick Start

1. **Set up environment variables** (see below)
2. **Install dependencies**: `npm install`
3. **Test locally**: `npm run dev`
4. **Deploy to Vercel**: `vercel --prod`

## Environment Variables Checklist

Before deploying, ensure you have all these values:

- [ ] `AIRTABLE_API_TOKEN` - Personal Access Token from Airtable
- [ ] `AIRTABLE_BASE_ID` - Your Airtable base ID (starts with `app`)
- [ ] `AIRTABLE_TABLE_NAME` - Name of your table in Airtable
- [ ] `ALCHEMY_OPTIMISM_RPC` - Alchemy RPC URL for Optimism
- [ ] `ERC20_ZAO_CONTRACT` - OG ZAO ERC-20 contract address
- [ ] `ERC1155_ZOR_CONTRACT` - ZOR ERC-1155 contract address
- [ ] `NEXT_PUBLIC_BASE_URL` - Your production URL (e.g., `https://leaderboard.thezao.com`)

## Vercel Deployment Steps

### Via Vercel Dashboard (Recommended)

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables (all 7 listed above)
6. Click **Deploy**

### Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Add environment variables (do this once)
vercel env add AIRTABLE_API_TOKEN production
vercel env add AIRTABLE_BASE_ID production
vercel env add AIRTABLE_TABLE_NAME production
vercel env add ALCHEMY_OPTIMISM_RPC production
vercel env add ERC20_ZAO_CONTRACT production
vercel env add ERC1155_ZOR_CONTRACT production
vercel env add NEXT_PUBLIC_BASE_URL production

# Deploy to production
vercel --prod
```

## Custom Domain Setup

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `leaderboard.thezao.com`)
4. Update DNS records as instructed by Vercel
5. Update `NEXT_PUBLIC_BASE_URL` environment variable to match your domain

## Post-Deployment Verification

After deployment, verify:

1. **Main page loads**: Visit `https://your-domain.com`
2. **API works**: Visit `https://your-domain.com/api/leaderboard`
3. **Embed works**: Visit `https://your-domain.com/embed`
4. **Data is correct**: Check that names and balances match expectations

## Troubleshooting

### Build fails with "Cannot find module"

- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check Vercel build logs for specific errors

### API returns 500 error

- Verify all environment variables are set in Vercel
- Check Vercel function logs for detailed error messages
- Ensure Airtable token has correct permissions
- Verify contract addresses are correct for Optimism

### Embed not working in iframe

- Check that `next.config.js` has correct headers
- Verify the embed URL is accessible
- Test in different browsers (some block iframes)

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Function Logs**: View in Vercel dashboard under "Functions"
- **Error Tracking**: Consider adding Sentry or similar

## Updating the Deployment

```bash
# Make changes to code
git add .
git commit -m "Update leaderboard"
git push

# Vercel will automatically deploy
# Or manually trigger:
vercel --prod
```

## Environment Variable Management

To update an environment variable:

```bash
# Via CLI
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production

# Or via Dashboard
# Settings → Environment Variables → Edit
```

## Performance Optimization

The app is configured for optimal performance:

- **ISR (Incremental Static Regeneration)**: 5-minute revalidation
- **Edge Caching**: Configured via headers
- **Parallel Queries**: Blockchain calls run in parallel
- **Minimal Bundle**: Tree-shaking and code splitting enabled

## Security Checklist

- [x] API keys stored server-side only
- [x] No secrets in client-side code
- [x] Read-only access to data sources
- [x] CORS configured for embed route
- [x] No authentication required (public leaderboard)

## Cost Estimation

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited API requests
- Should be sufficient for most use cases

**Alchemy Free Tier:**
- 300M compute units/month
- ~3M requests/month
- Should handle moderate traffic

Monitor usage and upgrade if needed.
