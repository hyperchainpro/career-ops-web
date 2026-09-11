---
Task ID: resume-update
Agent: general-purpose
Task: Update resume & portfolio to add Job4You project

Work Log:
- Read 4 target files: scripts/resume_id.py, scripts/resume_en.py, scripts/portfolio_id.html, scripts/portfolio_en.html (each 931 lines for HTML).
- resume_id.py: inserted new tuple `('Job4You - AI-Powered Remote Job Search Platform + ATS Resume Checker', 'https://github.com/hyperchainpro/career-ops-web', 'https://job4you.vercel.app')` as the FIRST entry of `projects_id` (before TRADIX).
- resume_en.py: inserted the same tuple as the FIRST entry of `projects_en` (before TRADIX).
- portfolio_id.html: added a new Featured project card (gold/yellow border `#d29922` + `★ Featured · Public` badge) for Job4You BEFORE the TRADIX card. Card includes:
    * repo-name: career-ops-web (link: github.com/hyperchainpro/career-ops-web)
    * tagline: Job4You · AI-Powered Remote Job Search Platform + ATS Resume Checker
    * tech badges: Next.js 16, TypeScript, Tailwind CSS 4, Prisma ORM, Neon PostgreSQL, OpenRouter AI (19 models), NextAuth.js, Vercel Cron, Greenhouse + Lever APIs, shadcn/ui
    * 8 features (Multi-source Job Scanner, ATS Resume Checker AI, Application Tracker CRUD, Cover Letter Generator, Interview Prep, Dashboard & Stats, Auto-cleanup Vercel Cron, Multi-user Authentication)
    * code-block snippet (job4you.scan demo)
    * stats grid (80+ companies, 19 AI models, $0 cost, Multi user, 100% remote, 30d auto-cleanup)
    * repo-url bar with live link (job4you.vercel.app)
- Demoted the TRADIX card in portfolio_id.html: removed gold border, gold gradient header, gold SVG fill, gold repo-name color, gold visibility-badge styling (reverted to plain `Private`), and gold repo-url bar styling.
- portfolio_en.html: applied the identical changes as portfolio_id.html but with English descriptions/features text.
- Updated body-text counts in both HTMLs: "10 proyek unggulan" → "11 proyek unggulan" (ID), "10 featured projects" → "11 featured projects" (EN).
- Renumbered project comment markers sequentially PROJECT 1..12 across both HTML files (also fixed pre-existing duplicate `<!-- PROJECT 2 -->` bug for LayerBoard/PathMentor).
- Ran `python3 resume_id.py` and `python3 resume_en.py` (both OK, ~79.4 KB each).
- Rendered both portfolio HTMLs to PDF using `node skills/pdf/scripts/html2pdf-next.js <html> --output <pdf> --width 720px --height 1020px --nopaged`. Output: Portfolio_Febri_Rizki_ID.pdf (14 pages, 739.7 KB), Portfolio_Febri_Rizki_EN.pdf (13 pages, 763.7 KB).
- Set PDF metadata via `python3 skills/pdf/scripts/pdf.py meta.set ... -d '{"Title":"...","Author":"Febri Rizki","Creator":"Febri Rizki"}'`. For the 2 resume PDFs (whose input path == output path), used a temp file in scripts/ then `mv` into download/ as a workaround for pikepdf's overwrite restriction.
- Copied updated portfolio HTMLs to download/ alongside their PDFs.
- Verified all 4 PDFs in /home/z/my-project/download/ via `meta.get` (Title/Author/Creator all correct) and `extract.text` (Job4You appears as project #1 in resumes and as Featured card #1 in portfolios; TRADIX now reads as plain `Private` in portfolios — demotion confirmed).

Stage Summary:
- 4 source files updated: scripts/resume_id.py, scripts/resume_en.py, scripts/portfolio_id.html, scripts/portfolio_en.html.
- 4 final PDFs in /home/z/my-project/download/ with correct metadata:
    * Resume_Febri_Rizki_ID.pdf  — 3 pages, 80.4 KB, Title "Resume - Febri Rizki (ID)"
    * Resume_Febri_Rizki_EN.pdf  — 3 pages, 80.4 KB, Title "Resume - Febri Rizki (EN)"
    * Portfolio_Febri_Rizki_ID.pdf — 14 pages, 754.5 KB, Title "Portfolio - Febri Rizki (ID)"
    * Portfolio_Febri_Rizki_EN.pdf — 13 pages, 779.1 KB, Title "Portfolio - Febri Rizki (EN)"
- Job4You is now project #1 in both resumes and the Featured Project #1 (gold highlight) in both portfolios; TRADIX has been demoted to a regular card in portfolios.
- Job4You card surfaces all key metrics requested: 80+ companies scanned, 19 free AI models, multi-user platform, $0/month cost, 30-day auto-cleanup, 100% remote focus.
- No regressions: all other 10 original projects retained and renumbered 2–12.
