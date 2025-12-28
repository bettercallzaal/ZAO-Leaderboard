# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Browser → Next.js Pages (SSR)                               │
│  • / (Main Leaderboard)                                      │
│  • /embed (Embeddable Version)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  React Components                                            │
│  • LeaderboardTable.tsx (Reusable table component)           │
│  • Tailwind CSS styling                                      │
│  • Responsive design                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Server-Side)                            │
│  • GET /api/leaderboard                                      │
│    - Fetches Airtable data                                   │
│    - Queries blockchain balances                             │
│    - Combines & ranks data                                   │
│    - Returns JSON                                            │
│  • Cache: 5 min revalidation                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌──────────────────────┐                 ┌──────────────────────┐
│   DATA SOURCE 1      │                 │   DATA SOURCE 2      │
│   AIRTABLE           │                 │   OPTIMISM           │
├──────────────────────┤                 ├──────────────────────┤
│ Identity Layer       │                 │ Truth Layer          │
│ • Member names       │                 │ • ERC-20 balances    │
│ • Wallet addresses   │                 │ • ERC-1155 balances  │
│ • Admin interface    │                 │ • Via Alchemy RPC    │
└──────────────────────┘                 └──────────────────────┘
```

## Data Flow Sequence

```
1. User visits / or /embed
   ↓
2. Next.js SSR renders page
   ↓
3. Page fetches /api/leaderboard
   ↓
4. API Route executes (server-side):
   ├─→ lib/airtable.ts → Fetch all records
   │   └─→ Returns: [{name, address}, ...]
   │
   ├─→ lib/blockchain.ts → For each address:
   │   ├─→ Query ERC-20 contract (OG ZAO)
   │   └─→ Query ERC-1155 contract (ZOR, tokenId=0)
   │
   ├─→ Combine data:
   │   └─→ {name, address, ogRespect, zorRespect, totalRespect}
   │
   ├─→ Sort by totalRespect (descending)
   │
   └─→ Assign ranks (1, 2, 3, ...)
   ↓
5. Return JSON to client
   ↓
6. LeaderboardTable component renders
   ↓
7. User sees formatted table
```

## Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   └── page.tsx (Main Page)
│       └── LeaderboardTable (Component)
│
└── embed/
    └── layout.tsx (Embed Layout)
        └── page.tsx (Embed Page)
            └── LeaderboardTable (Component)
```

## Module Dependencies

```
API Route (route.ts)
├── lib/airtable.ts
│   └── airtable (npm package)
│       └── AIRTABLE_API_TOKEN (env)
│       └── AIRTABLE_BASE_ID (env)
│       └── AIRTABLE_TABLE_NAME (env)
│
├── lib/blockchain.ts
│   └── ethers (npm package)
│       └── ALCHEMY_OPTIMISM_RPC (env)
│       └── ERC20_ZAO_CONTRACT (env)
│       └── ERC1155_ZOR_CONTRACT (env)
│
└── types/leaderboard.ts
    └── TypeScript interfaces
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                     (Public, No Secrets)                     │
├─────────────────────────────────────────────────────────────┤
│  • React components                                          │
│  • Tailwind CSS                                              │
│  • Public data only                                          │
│  • No API keys                                               │
│  • No wallet connections                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
│                  (Private, All Secrets)                      │
├─────────────────────────────────────────────────────────────┤
│  • Environment variables                                     │
│  • API keys (Airtable, Alchemy)                              │
│  • Contract addresses                                        │
│  • Blockchain queries                                        │
│  • Data aggregation                                          │
└─────────────────────────────────────────────────────────────┘
```

## Caching Strategy

```
Request Flow:

User Request
    ↓
CDN Cache (Vercel Edge)
    ↓ (if miss)
Next.js Cache (ISR)
    ↓ (if stale)
API Route Execution
    ↓
Fresh Data
    ↓
Cache for 5 minutes
    ↓
Return to User

Cache Headers:
• s-maxage=300 (5 minutes)
• stale-while-revalidate=600 (10 minutes)
```

## Deployment Architecture (Vercel)

```
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │            Edge Network (CDN)                      │     │
│  │  • Global distribution                             │     │
│  │  • Static asset caching                            │     │
│  │  • HTTPS termination                               │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Next.js Application (SSR)                  │     │
│  │  • Server-side rendering                           │     │
│  │  • API routes                                      │     │
│  │  • ISR caching                                     │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Serverless Functions                       │     │
│  │  • /api/leaderboard                                │     │
│  │  • Auto-scaling                                    │     │
│  │  • Environment variables                           │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────┴────────────────┐
        ↓                                 ↓
┌──────────────┐                  ┌──────────────┐
│  Airtable    │                  │  Alchemy     │
│  API         │                  │  RPC         │
└──────────────┘                  └──────────────┘
```

## Error Handling Flow

```
API Route Error Handling:

try {
    Fetch Airtable
    ↓
    For each record:
        try {
            Query blockchain
        } catch {
            Log error
            Return 0 for balances
        }
    ↓
    Sort & rank
    ↓
    Return 200 + JSON
} catch {
    Log error
    Return 500 + error message
}

Frontend Error Handling:

try {
    Fetch /api/leaderboard
    ↓
    Display table
} catch {
    Display "Loading..." message
}
```

## Performance Optimizations

1. **Parallel Blockchain Queries**
   ```typescript
   const [ogRespect, zorRespect] = await Promise.all([
       getOGRespect(address),
       getZORRespect(address)
   ]);
   ```

2. **ISR Caching**
   ```typescript
   export const revalidate = 300; // 5 minutes
   ```

3. **Minimal Client Bundle**
   - No blockchain libraries on client
   - Tree-shaking enabled
   - Code splitting by route

4. **Edge Caching**
   ```typescript
   headers: {
       'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
   }
   ```

## Scalability Considerations

| Aspect | Current | Scalable To | Notes |
|--------|---------|-------------|-------|
| Members | 50-100 | 1,000+ | Parallel queries handle well |
| Requests | 10K/day | 1M/day | ISR caching reduces load |
| Data Size | ~50KB | ~5MB | JSON compression available |
| Response Time | <2s | <5s | Depends on blockchain RPC |

## Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND STACK                          │
├─────────────────────────────────────────────────────────────┤
│  React 18 → Next.js 14 → TypeScript 5 → Tailwind CSS 3      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BACKEND STACK                           │
├─────────────────────────────────────────────────────────────┤
│  Node.js → Next.js API Routes → ethers.js 6 → Airtable SDK  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE STACK                      │
├─────────────────────────────────────────────────────────────┤
│  Vercel → Edge Network → Serverless Functions → GitHub      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                        │
├─────────────────────────────────────────────────────────────┤
│  Airtable API → Alchemy RPC → Optimism Blockchain           │
└─────────────────────────────────────────────────────────────┘
```

## File Size Estimates

```
Production Build:
├── Client Bundle: ~150KB (gzipped)
├── Server Bundle: ~500KB
├── Static Assets: ~50KB
└── Total: ~700KB

API Response:
├── 10 members: ~2KB
├── 50 members: ~10KB
├── 100 members: ~20KB
└── Compressed: ~30% smaller
```

## Request/Response Cycle

```
1. User → https://leaderboard.thezao.com/
   Time: 0ms

2. Vercel Edge → Check CDN cache
   Time: 10-50ms (global)

3. Next.js → SSR page with data
   Time: 100-500ms (if cache miss)

4. API Route → Fetch & process data
   Time: 1000-2000ms (if cache miss)
   ├── Airtable: 200-500ms
   └── Blockchain: 500-1500ms (parallel)

5. Response → User sees page
   Total Time: 100-2000ms (depending on cache)
```

## Future Architecture Enhancements

1. **Database Layer**: Add PostgreSQL for historical data
2. **Background Jobs**: Cron jobs for pre-fetching
3. **WebSocket**: Real-time updates
4. **GraphQL**: More flexible queries
5. **Redis**: Additional caching layer
6. **Monitoring**: Sentry, LogRocket
7. **Analytics**: Plausible, PostHog

---

This architecture is designed for:
- **Simplicity**: Easy to understand and maintain
- **Security**: All secrets server-side
- **Performance**: Aggressive caching
- **Scalability**: Can handle growth
- **Reliability**: Graceful error handling
