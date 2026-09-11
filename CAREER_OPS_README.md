# 🚀 Career Ops AI — Febri Rizki's Personal Job Search System

> AI-powered job evaluation, cover letter generator, and interview prep — all in one web app
> Built with Next.js 16 + OpenRouter AI (free tier, 439 models available)

## ✅ System Status

| Component | Status |
|---|---|
| **Web App (Next.js)** | ✅ Running on `http://localhost:3000` |
| **API /api/evaluate** | ✅ Tested working (returns AI job match evaluation) |
| **API /api/cover-letter** | ✅ Tested working (generates tailored cover letter) |
| **API /api/interview** | ✅ Tested working (generates interview prep questions) |
| **API /api/models** | ✅ Returns 19 free OpenRouter models |
| **OpenRouter Integration** | ✅ API key configured in `.env.local` |
| **Vercel Deployment** | ⚠️ Token expired — needs new Vercel token to deploy |

## 📁 Project Structure

```
/home/z/my-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── evaluate/route.ts        ← Job evaluation endpoint
│   │   │   ├── cover-letter/route.ts    ← Cover letter generator
│   │   │   ├── interview/route.ts       ← Interview prep generator
│   │   │   └── models/route.ts          ← List available AI models
│   │   ├── page.tsx                     ← Main UI (tabs: Evaluate / Cover Letter / Interview)
│   │   └── layout.tsx                   ← App metadata
│   └── lib/
│       ├── profile.ts                   ← Febri's complete profile data (168 lines)
│       └── openrouter.ts                ← OpenRouter API client with model fallback
├── .env.local                           ← OPENROUTER_API_KEY (configured)
├── vercel.json                          ← Vercel deployment config
└── .vercelignore                        ← Exclude unused folders from deploy
```

## 🎯 Features Built

### 1. Job Match Evaluation (`/api/evaluate`)
Paste a job description → AI returns:
- 🎯 Role Match Assessment (score X/10 + level)
- 📋 Job Requirements Analysis
- ✅ Candidate Strengths (3-5 specific points from your profile)
- ⚠️ Gaps & Concerns
- 💡 Tailoring Recommendations
- 🎤 Interview Preparation
- 📝 Final Verdict (APPLY / APPLY WITH CAUTION / SKIP)

### 2. Cover Letter Generator (`/api/cover-letter`)
Paste a job description + company name → AI generates:
- Personalized cover letter (max 350 words)
- References your actual projects (TRADIX, LayerBoard, etc.)
- Highlights Biology→AI unique value proposition
- Professional but not stiff tone

### 3. Interview Prep Generator (`/api/interview`)
Paste a job description → AI generates:
- 5 Technical Interview Questions + how to answer using your experience
- 3 Behavioral Questions + answer guidance
- 3 Smart Questions to Ask the Interviewer

## 🤖 AI Models Used

System uses OpenRouter free tier with automatic fallback:
1. `google/gemma-4-31b-it:free` (primary)
2. `nvidia/nemotron-3-super-120b-a12b:free` (fallback)
3. `thinkingmachines/inkling:free`
4. `nex-agi/nex-n2.5-pro:free`
5. `inclusionai/ling-3.0-flash-vl:free`
6. ... 14 more fallback models

**Total cost: $0/month** (all free tier)

## 🚀 How to Deploy to Vercel (Production)

The token you provided in the screenshot has expired. To deploy this app to production:

### Step 1: Generate New Vercel Token

1. Visit https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `career-ops-deploy`
4. Scope: `Full Account`
5. Expiration: `No expiration` (or 1 year)
6. Copy the token (starts with `vcp_...`)

### Step 2: Set Environment Variable

```bash
# In your local terminal
export VERCEL_TOKEN="your_new_vcp_token_here"
```

### Step 3: Deploy

```bash
cd /home/z/my-project

# Production deploy
vercel --prod --yes --token "$VERCEL_TOKEN"

# Get your production URL (output: https://my-project-xxx.vercel.app)
```

### Step 4: Verify Env Vars

```bash
# Check env vars are set
vercel env ls --token "$VERCEL_TOKEN"

# Should see: OPENROUTER_API_KEY (Production, Secret)
```

### Step 5: Test Live URL

```bash
# Test the deployed URL
curl https://your-app.vercel.app/api/models

# Should return: {"success":true,"count":19,"models":[...]}
```

## 📋 How to Use (Once Deployed)

### Web UI

1. Visit `https://your-app.vercel.app`
2. Choose tab: **Evaluate Job**, **Cover Letter**, or **Interview Prep**
3. Paste full job description (min 100 chars)
4. Click button → AI processes (~10-30 seconds)
5. View result + download as Markdown

### API Endpoints (for automation)

```bash
# Evaluate a job
curl -X POST https://your-app.vercel.app/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Paste JD here...",
    "jobUrl": "https://optional-url.com"
  }'

# Generate cover letter
curl -X POST https://your-app.vercel.app/api/cover-letter \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Paste JD here...",
    "companyName": "Company Name"
  }'

# Generate interview prep
curl -X POST https://your-app.vercel.app/api/interview \
  -H "Content-Type: application/json" \
  -d '{"jobDescription": "Paste JD here..."}'
```

## 🛡️ Security Notes

1. **API Keys**: OpenRouter API key stored as Vercel env var (Secret type) — never exposed to client
2. **No Database**: No user data stored — each request is stateless
3. **Profile Data**: Hardcoded in `src/lib/profile.ts` — edit this file to update your CV
4. **Rate Limits**: OpenRouter free tier has limits (~20 requests/min) — system auto-fallbacks to other models

## 💡 Tips for Maximum Impact

1. **Paste Full JD**: The more detail in the job description, the better the AI evaluation
2. **Try Different Models**: Use `/api/models` to see all available models, then pass `modelId` in request body
3. **Combine Outputs**: Use all 3 tools (evaluate + cover letter + interview prep) for each job application
4. **Iterate**: Run evaluation first → identify gaps → adjust cover letter accordingly
5. **Save Outputs**: Each result can be downloaded as `.md` file for future reference

## 📊 Tested Working Examples

### Evaluation Output (sample)
```
## 🎯 Role Match Assessment
Overall Match Score: 8/10
Match Level: GOOD

## ✅ Candidate Strengths
1. 5+ years of professional UI/UX work at USU
2. Strong Figma & prototyping skills (LIMS dashboard)
3. Unique Biology M.Sc. background (computational biology edge)
4. 11+ shipped projects with live URLs (verifiable)
5. Hackathon semifinalist (proven under pressure)

## 📝 Final Verdict
Recommendation: APPLY
```

### Cover Letter Output (sample)
```
**Senior UI/UX Designer – TechStartup Inc.**

When I saw TechStartup's focus on marrying elegant interfaces with 
intelligent experiences, I was reminded of the Laboratory Information 
Management System I built for Universitas Sumatera Utara—where I turned 
a paper-heavy workflow into a Figma-designed, React + TypeScript dashboard 
that cut sample-tracking time by 40%...
```

### Interview Prep Output (sample)
```
## 🎤 Technical Questions (5)

**Q1:** Can you walk us through how you built the design system for your 
Laboratory Information Management System (LIMS)?

**Why they ask:** They want to see concrete experience creating design systems

**How to answer (using your experience):**
- Mention that you started in Figma by defining a design token library...
```

## 🆘 Troubleshooting

### Issue: "All models failed"
- **Cause**: Rate limit hit or models temporarily unavailable
- **Solution**: Wait 30 seconds, try again. System auto-retries 10+ models

### Issue: "OPENROUTER_API_KEY is not set"
- **Cause**: Environment variable not configured in Vercel
- **Solution**: Run `vercel env add OPENROUTER_API_KEY production` with the API key

### Issue: App not responding
- **Cause**: OpenRouter API down or network issue
- **Solution**: Check https://openrouter.ai/status — wait 5 minutes

## 📞 Need Help?

- **Source code**: `/home/z/my-project/`
- **Profile data**: `/home/z/my-project/src/lib/profile.ts`
- **OpenRouter API**: https://openrouter.ai
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Built with ❤️ for Febri Rizki** · UI/UX Designer & AI Engineer · 2026
