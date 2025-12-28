# Vercel Deployment Guide

## Prerequisites

Before deploying, gather these values:

- `AIRTABLE_API_TOKEN` - Get from [airtable.com/create/tokens](https://airtable.com/create/tokens)
- `AIRTABLE_BASE_ID` - Your base ID (starts with `app`)
- `AIRTABLE_TABLE_NAME` - Table name with `name` and `address` columns
- `ALCHEMY_OPTIMISM_RPC` - Get from [dashboard.alchemy.com](https://dashboard.alchemy.com/)
- `ERC20_ZAO_CONTRACT` - OG ZAO Respect contract address on Optimism
- `ERC1155_ZOR_CONTRACT` - ZOR Respect contract address on Optimism
- `NEXT_PUBLIC_BASE_URL` - Your production URL (set after first deploy)

**⚠️ IMPORTANT: Never commit these values to the repository.**

## Deployment Steps

### 1. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Click **Import**

### 2. Configure Project

Vercel will auto-detect Next.js. Verify these settings:
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. Add Environment Variables

In the Vercel dashboard, go to **Environment Variables** and add all 7 variables listed above.

**For the first deployment**, use a placeholder for `NEXT_PUBLIC_BASE_URL`:
```
NEXT_PUBLIC_BASE_URL=https://placeholder.vercel.app
```

### 4. Deploy

Click **Deploy** and wait for the build to complete (~2-3 minutes).

### 5. Update Base URL

After deployment:
1. Copy your Vercel URL (e.g., `https://zao-leaderboard.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_BASE_URL` with your actual URL
4. Go to **Deployments** → **...** → **Redeploy**

## Custom Domain (Optional)

1. **Settings** → **Domains** → Add your domain
2. Follow Vercel's DNS instructions
3. Update `NEXT_PUBLIC_BASE_URL` to your custom domain
4. Redeploy

## Post-Deployment Checklist

Test these URLs (replace with your actual domain):

- [ ] **Main page**: `https://your-domain.vercel.app/`
- [ ] **API endpoint**: `https://your-domain.vercel.app/api/leaderboard`
- [ ] **Embed page**: `https://your-domain.vercel.app/embed`
- [ ] **Data accuracy**: Verify names and balances are correct

## Troubleshooting

### Build Fails
- Check Vercel build logs for specific errors
- Verify all dependencies are in `package.json`
- Ensure no syntax errors in code

### API Returns 500 Error
- Verify all 7 environment variables are set in Vercel
- Check Vercel function logs under **Functions** tab
- Confirm Airtable token has `data.records:read` permission
- Verify contract addresses are on Optimism (not Ethereum mainnet)

### Data Not Loading
- Test API directly: `/api/leaderboard`
- Verify Airtable table has `name` and `address` columns
- Check Alchemy RPC URL is correct for Optimism

### Embed Not Working
- Verify CORS headers in `next.config.js`
- Test embed URL directly in browser first
- Check browser console for errors

## Updating Your Site

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

## Monitoring

- **Deployments**: View all deployments in Vercel dashboard
- **Function Logs**: Check API route logs under **Functions**
- **Analytics**: Enable in project settings for traffic insights
