# 🚀 Career Ops AI — Deployment Status

> AI-powered job evaluation system for Febri Rizki

## 📊 Status

| Service | Status | URL |
|---|---|---|
| **GitHub Repo** | ✅ Live | https://github.com/hyperchainpro/career-ops-web |
| **Local Dev** | ✅ Running | http://localhost:3000 |
| **OpenRouter AI** | ✅ 19 free models | https://openrouter.ai |
| **Neon Store** | ✅ Exists in Vercel | `neon-amethyst-jacket` |
| **Vercel Prod** | ⚠️ Needs new token | Generate at https://vercel.com/account/tokens |

## 🚀 Quick Deploy Steps

### Step 1: Generate new Vercel token
- Visit https://vercel.com/account/tokens
- Create token with **Full Account** scope
- Copy token (starts with `vcp_...`)

### Step 2: Import repo to Vercel
- Visit https://vercel.com/new
- Import: `hyperchainpro/career-ops-web`
- Framework: Next.js (auto-detected)

### Step 3: Add Environment Variable
- Key: `OPENROUTER_API_KEY`
- Value: `[Your OpenRouter API key from your .env.local file]`
- Environments: Production, Preview, Development

### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get live URL like `https://career-ops-web-xxx.vercel.app`

## 🗄️ Neon Database (Already Exists)

The store `neon-amethyst-jacket` already exists in your Vercel account:
- **Store ID**: `store_dhKvJzE55oT34f9s`
- **Region**: `iad1`
- **Status**: Available

To connect:
1. Visit https://vercel.com/hyperchainproject-2935s-projects/my-project/stores
2. Click "Connect Store"
3. Select: `neon-amethyst-jacket`
4. Vercel auto-injects: `DATABASE_URL`, `POSTGRES_PRISMA_URL`, etc.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── evaluate/route.ts        ← Job evaluation endpoint
│   │   ├── cover-letter/route.ts    ← Cover letter generator
│   │   ├── interview/route.ts       ← Interview prep generator
│   │   └── models/route.ts          ← List available AI models
│   ├── page.tsx                     ← Main UI (3 tabs)
│   ├── layout.tsx
│   └── globals.css
└── lib/
    ├── profile.ts                   ← Febri's profile data
    └── openrouter.ts                ← OpenRouter API client
```

## 🤖 AI Models (OpenRouter Free Tier)

System uses auto-fallback across 19+ free models:
- `google/gemma-4-31b-it:free` (primary)
- `nvidia/nemotron-3-super-120b-a12b:free` (tested working)
- `thinkingmachines/inkling:free`
- `nex-agi/nex-n2.5-pro:free`
- ... 15+ more fallback models

**Total cost: $0/month**

## ✅ Tested Working Features

1. **Job Evaluation** - Returns match score (e.g., 8/10), strengths, gaps, recommendations
2. **Cover Letter** - Generates 350-word personalized cover letter referencing actual projects
3. **Interview Prep** - 5 technical + 3 behavioral questions with answer guidance

## 📞 Resources

- GitHub: https://github.com/hyperchainpro/career-ops-web
- Vercel Dashboard: https://vercel.com/dashboard
- Neon Console: https://console.neon.tech
- OpenRouter: https://openrouter.ai

---

**Built for Febri Rizki · UI/UX Designer & AI Engineer · 2026**
