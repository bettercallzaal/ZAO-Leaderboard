# Project File Structure

```
zao-leaderboard/
│
├── 📱 APPLICATION CODE
│   ├── app/                                    # Next.js App Router
│   │   ├── api/
│   │   │   └── leaderboard/
│   │   │       └── route.ts                    # API endpoint (server-side)
│   │   ├── embed/
│   │   │   ├── layout.tsx                      # Minimal layout for embeds
│   │   │   └── page.tsx                        # Embed page
│   │   ├── globals.css                         # Global styles + Tailwind
│   │   ├── layout.tsx                          # Root layout
│   │   └── page.tsx                            # Main leaderboard page
│   │
│   ├── components/
│   │   └── LeaderboardTable.tsx                # Reusable table component
│   │
│   ├── lib/
│   │   ├── airtable.ts                         # Airtable data fetching
│   │   ├── blockchain.ts                       # Blockchain balance queries
│   │   └── contracts.ts                        # Smart contract ABIs
│   │
│   └── types/
│       └── leaderboard.ts                      # TypeScript interfaces
│
├── ⚙️ CONFIGURATION
│   ├── .env.example                            # Environment template (basic)
│   ├── .env.local.template                     # Environment template (detailed)
│   ├── .eslintrc.json                          # ESLint configuration
│   ├── .gitignore                              # Git ignore rules
│   ├── next.config.js                          # Next.js configuration
│   ├── package.json                            # Dependencies & scripts
│   ├── postcss.config.mjs                      # PostCSS configuration
│   ├── tailwind.config.ts                      # Tailwind CSS configuration
│   ├── tsconfig.json                           # TypeScript configuration
│   └── vercel.json                             # Vercel deployment config
│
├── 📚 DOCUMENTATION
│   ├── GET_STARTED.md                          # ⭐ START HERE
│   ├── QUICKSTART.md                           # 5-minute setup guide
│   ├── README.md                               # Complete documentation
│   ├── DEPLOYMENT.md                           # Vercel deployment guide
│   ├── ARCHITECTURE.md                         # Technical architecture
│   ├── PROJECT_SUMMARY.md                      # Project overview
│   └── FILE_STRUCTURE.md                       # This file
│
└── 📦 DEPENDENCIES
    ├── node_modules/                           # Installed packages (402)
    └── package-lock.json                       # Dependency lock file
```

## Key Files Explained

### Application Code

| File | Purpose | Edit When |
|------|---------|-----------|
| `app/api/leaderboard/route.ts` | Server-side API logic | Changing data fetching logic |
| `app/page.tsx` | Main leaderboard page | Updating main page UI |
| `app/embed/page.tsx` | Embeddable version | Updating embed UI |
| `components/LeaderboardTable.tsx` | Table component | Changing table design |
| `lib/airtable.ts` | Airtable integration | Modifying Airtable queries |
| `lib/blockchain.ts` | Blockchain queries | Changing blockchain logic |
| `types/leaderboard.ts` | TypeScript types | Adding/removing data fields |

### Configuration Files

| File | Purpose | Edit When |
|------|---------|-----------|
| `.env.local` | Environment variables | Setting up locally (create this) |
| `next.config.js` | Next.js settings | Changing build/runtime config |
| `tailwind.config.ts` | Tailwind settings | Customizing design system |
| `package.json` | Dependencies | Adding/removing packages |
| `vercel.json` | Deployment config | Changing deployment settings |

### Documentation Files

| File | Purpose | Read When |
|------|---------|-----------|
| `GET_STARTED.md` | Quick start | First time setup |
| `QUICKSTART.md` | 5-min guide | Want to run locally fast |
| `README.md` | Full docs | Need complete information |
| `DEPLOYMENT.md` | Deploy guide | Ready to go live |
| `ARCHITECTURE.md` | Tech details | Understanding how it works |
| `PROJECT_SUMMARY.md` | Overview | Want big picture |

## File Sizes

```
Source Code:
├── TypeScript/TSX: ~1,000 lines
├── CSS: ~50 lines
├── Config: ~200 lines
└── Documentation: ~2,000 lines

Build Output:
├── Client Bundle: ~150KB (gzipped)
├── Server Bundle: ~500KB
└── Static Assets: ~50KB

Dependencies:
└── node_modules: ~200MB (402 packages)
```

## Important Directories

### `/app`
Next.js App Router directory. All pages and API routes live here.

### `/components`
Reusable React components. Currently just the table, but add more as needed.

### `/lib`
Business logic and integrations. Keep API calls and data processing here.

### `/types`
TypeScript type definitions. Shared interfaces and types.

### `/node_modules`
Installed dependencies. Don't edit directly. Managed by npm.

## Files You'll Edit Most

1. **`.env.local`** - Your environment variables (create this first!)
2. **`components/LeaderboardTable.tsx`** - Table styling and layout
3. **`app/globals.css`** - Global styles and colors
4. **`app/page.tsx`** - Main page content and layout

## Files You Probably Won't Touch

- `package-lock.json` - Auto-generated by npm
- `tsconfig.json` - TypeScript config (works out of the box)
- `postcss.config.mjs` - PostCSS config (needed for Tailwind)
- `.eslintrc.json` - ESLint config (basic setup)

## Adding New Features

### Add a new page
1. Create `app/your-page/page.tsx`
2. Next.js automatically creates route at `/your-page`

### Add a new API endpoint
1. Create `app/api/your-endpoint/route.ts`
2. Export `GET`, `POST`, etc. functions
3. Access at `/api/your-endpoint`

### Add a new component
1. Create `components/YourComponent.tsx`
2. Import and use in pages

### Add a new utility function
1. Create `lib/your-utility.ts`
2. Export functions
3. Import where needed

## Environment Files

```
.env.example              # Template (committed to git)
.env.local.template       # Detailed template (committed to git)
.env.local                # Your actual values (NOT committed)
```

**Never commit `.env.local`** - it's in `.gitignore` for security.

## Build Artifacts (Generated)

```
.next/                    # Next.js build output
out/                      # Static export (if used)
node_modules/             # Installed dependencies
```

These are auto-generated and should not be committed to git.

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/zao-leaderboard.git
git push -u origin main

# Make changes
git add .
git commit -m "Update leaderboard styling"
git push
```

## NPM Scripts

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## Deployment Files

When deploying to Vercel, these files are used:
- `package.json` - Dependencies to install
- `next.config.js` - Build configuration
- `vercel.json` - Deployment settings
- Environment variables from Vercel dashboard

---

**Quick Navigation:**
- 🚀 Getting started? → Read `GET_STARTED.md`
- 🔧 Setting up locally? → Read `QUICKSTART.md`
- 📖 Need full docs? → Read `README.md`
- 🚢 Ready to deploy? → Read `DEPLOYMENT.md`
- 🏗️ Understanding architecture? → Read `ARCHITECTURE.md`
