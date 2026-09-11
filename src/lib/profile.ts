// Febri Rizki - Profile Data
// Sumber: Resume & Portfolio yang sudah dibuat

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  phoneAlt: string;
  location: string;
  linkedin: string;
  github: string;
  githubAlt: string;
  portfolioUrl: string;
  headline: string;
  summary: string;
  targetRoles: string[];
  skills: {
    uiux: string[];
    ai: string[];
    frontend: string[];
    backend: string[];
    cloud: string[];
    languages: string[];
  };
  workExperience: Array<{
    company: string;
    role: string;
    period: string;
    location: string;
    duration: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    repo: string;
    live?: string;
    tech: string[];
    achievement?: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    location: string;
    note: string;
  }>;
  certifications: {
    dicoding: { total: number; categories: Array<{ name: string; count: number }> };
    bdt: { name: string; count: number };
    verificationLink: string;
  };
  awards: Array<{
    title: string;
    organization: string;
    year: string;
    scope: string;
    description: string;
  }>;
  languages: Array<{ name: string; level: string }>;
}

export const profileData: ProfileData = {
  fullName: "Febri Rizki",
  email: "febririzki95@gmail.com",
  phone: "+62 852-6543-6395",
  phoneAlt: "+62 896-5473-8245",
  location: "Medan, North Sumatra, Indonesia",
  linkedin: "linkedin.com/in/febririzki95",
  github: "github.com/febririzki95",
  githubAlt: "github.com/hyperchainpro",
  portfolioUrl: "https://layerboard.vercel.app",
  headline:
    "UI/UX Designer & AI Engineer with Biology M.Sc. background — 11+ shipped projects, hackathon semifinalist, blending design intuition with production-grade AI systems",
  summary:
    "UI/UX Designer and AI Engineer with a unique blend of user interface design expertise and artificial intelligence engineering capabilities. Holds a Master of Science in Biology from Universitas Sumatera Utara (2024) with hands-on experience building 11+ end-to-end digital products. Biology background provides strategic advantage for AI in life sciences, bioinformatics, and computational biology domains. Semifinalist at the PIDI Digdaya Bank Indonesia Hackathon 2026.",
  targetRoles: [
    "UI/UX Designer",
    "AI Engineer",
    "Full-Stack AI Engineer",
    "Product Designer (AI products)",
    "Frontend Engineer (AI apps)",
  ],
  skills: {
    uiux: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Design System & Tokens",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "User Research",
      "Journey Mapping",
      "Persona Development",
      "Information Architecture",
      "A/B Testing",
      "Neumorphic Design",
      "Material Design",
      "Mobile-First & Responsive Design",
      "Accessibility (WCAG 2.1)",
      "Figma Auto Layout",
      "Figma Variants",
      "Micro-interactions",
    ],
    ai: [
      "Google Gemini API (gemini-2.0-flash)",
      "OpenAI API",
      "Prompt Engineering",
      "RAG (Retrieval-Augmented Generation)",
      "LangChain",
      "TensorFlow",
      "TensorFlow Lite",
      "PyTorch",
      "scikit-learn",
      "MLflow",
      "Model Deployment & Retraining",
      "MLOps",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "EDA",
      "Feature Engineering",
      "Computer Vision",
      "Image Classification",
      "Isolate Inference",
      "Hugging Face",
    ],
    frontend: [
      "React",
      "Next.js 16",
      "React Native (Expo)",
      "TypeScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "Radix UI",
      "Framer Motion",
      "Zustand",
      "Three.js",
      "GSAP",
      "MDX Editor",
    ],
    backend: [
      "Prisma ORM",
      "PostgreSQL",
      "Neon",
      "Convex",
      "Supabase",
      "Node.js",
      "REST API",
      "Bcrypt Authentication",
      "SQLite",
      "Caddy Server",
    ],
    cloud: [
      "Vercel",
      "Cloudflare Pages",
      "GitHub Actions",
      "Docker",
      "CI/CD Pipeline",
      "OpenNext",
      "Wrangler",
      "EAS Build",
      "Vercel Postgres",
    ],
    languages: ["TypeScript", "JavaScript", "Python", "Dart", "PHP", "SQL"],
  },
  workExperience: [
    {
      company: "Laboratorium Terpadu, Universitas Sumatera Utara",
      role: "Laboran & UI/UX Web Designer + AI Stack Web Engineer",
      period: "2020 - Present",
      location: "Medan, North Sumatra, Indonesia",
      duration: "5+ years",
      bullets: [
        "Manage daily laboratory operations: sample testing, instrument calibration, and test result documentation according to SOP & ISO standards.",
        "Design and develop a web-based Laboratory Information Management System (LIMS) to digitize testing workflows, reporting, and sample management.",
        "Design LIMS dashboard UI/UX with Figma, then implement using Next.js, React, TypeScript, and Tailwind CSS for the frontend.",
        "Integrate AI stack for test result prediction and automated sample classification using Google Gemini API & TensorFlow.",
        "Build REST API with Node.js, Express, and Prisma ORM to handle communication between frontend, PostgreSQL database, and AI modules.",
        "Implement authentication system (JWT + bcrypt) and role-based access control for admin, laboratory technicians, and researchers.",
        "Deploy applications to Vercel & Cloudflare Pages with CI/CD pipeline via GitHub Actions.",
        "Train 5+ new laboratory staff on the information system and digital procedures.",
      ],
    },
    {
      company: "SMPN 3 Langsa",
      role: "School Website Administrator (Internship)",
      period: "2019 - 2020",
      location: "Langsa, Aceh, Indonesia",
      duration: "1 year",
      bullets: [
        "Manage and develop the official school website using WordPress CMS & HTML/CSS/JavaScript.",
        "Update website content on a regular basis: school announcements, event schedules, teacher profiles, and event documentation.",
        "Redesign website layout to improve user experience & mobile responsiveness (mobile-first design).",
        "Create and manage school social media accounts (Instagram, YouTube) integrated with the website.",
        "Perform routine maintenance: database backups, plugin updates, and website security monitoring.",
        "Train 2 senior teachers to independently manage website content through documentation & training sessions.",
      ],
    },
  ],
  projects: [
    {
      name: "TRADIX",
      description:
        "AI-Powered Stock Trading Platform — flagship project for PIDI Digdaya Bank Indonesia Hackathon 2026. Combines 10 AI providers (Gemini, GPT-4, Claude, DeepSeek, Llama) for stock analysis, trading signals, and smart money detection. $0/month operational cost using free tiers.",
      repo: "https://github.com/hyperchainpro/TRADIX",
      live: "https://tradix-app.pages.dev",
      tech: [
        "Expo",
        "React Native 0.81",
        "TypeScript",
        "Google Gemini API",
        "Supabase",
        "DeepSeek API",
        "Puter.js (7 AI models)",
        "Yahoo Finance API",
        "Cloudflare Pages",
      ],
      achievement: "Hackathon PIDI Digdaya BI 2026 semifinalist",
    },
    {
      name: "LayerBoard",
      description:
        "AI-Powered Design Generation Platform. A collaborative design platform that integrates generative AI into the UI/UX workflow. LayerBoard allows designers to create parallel design variations with AI-assisted creative exploration — similar to Git branching, but for visual assets.",
      repo: "https://github.com/hyperchainpro/layerboard",
      live: "https://layerboard.vercel.app",
      tech: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "Tailwind CSS 4",
        "Prisma",
        "Neon Postgres",
        "Gemini API",
        "dnd-kit",
        "MDX Editor",
      ],
    },
    {
      name: "PathMentor AI",
      description:
        "Adaptive AI Tutor for High-School Students. A personalized adaptive AI tutor using a Socratic approach with auto-generated quizzes, smart flashcards (SM-2 spaced repetition), essay review, and step-by-step math solver. Powered by Gemini 2.0 Flash.",
      repo: "https://github.com/febririzki95/pathmentor-ai",
      live: "https://pathmentor-ai-one.vercel.app",
      tech: [
        "Next.js 16",
        "Prisma",
        "PostgreSQL",
        "Gemini 2.0 Flash",
        "shadcn/ui",
        "Framer Motion",
        "Zustand",
      ],
    },
    {
      name: "DapurMind AI",
      description:
        "AI-Powered Cooking Assistant. Generates recipes based on available ingredients, real-time nutrition analysis via Gemini AI, edge deployment via Cloudflare Pages.",
      repo: "https://github.com/hyperchainpro/dapurmindai",
      live: "https://dapurmindai.vercel.app",
      tech: ["Next.js 16", "Convex", "Prisma", "Gemini AI", "Cloudflare Pages"],
    },
    {
      name: "CR AutoPilot",
      description:
        "Automated ContentRewards Pipeline. End-to-end automation: scraper, video editor, and social poster to 34 platforms simultaneously via Playwright MCP.",
      repo: "https://github.com/hyperchainpro/cr-autopilot",
      live: "https://cr-autopilot.vercel.app",
      tech: [
        "Next.js 16",
        "Prisma",
        "Playwright MCP",
        "MDX Editor",
        "dnd-kit",
      ],
    },
    {
      name: "Food Recognizer",
      description:
        "Flutter ML App that recognizes 2,023 food categories from photos using TensorFlow Lite. Inference runs on a background Isolate for optimal UI responsiveness. Integrated with MealDB API & Gemini AI for nutrition info.",
      repo: "https://github.com/febririzki95/food_recognizer_ci_check",
      tech: ["Flutter", "Dart", "TensorFlow Lite", "Gemini AI", "MealDB API"],
    },
    {
      name: "Workflow-CI",
      description:
        "Automated ML Model Retraining (MLOps). An MLOps pipeline that automates ML model retraining using MLflow Project + GitHub Actions CI. Uses Breast Cancer Wisconsin dataset as POC, with Docker Hub deployment for environment reproducibility.",
      repo: "https://github.com/febririzki95/Workflow-CI",
      tech: ["Python", "MLflow", "GitHub Actions", "Docker", "Conda", "scikit-learn"],
    },
    {
      name: "NeuroPilot",
      description:
        "AI Platform with Caddy Server & Neon DB. Production-grade AI platform using Caddy Server as reverse proxy, Neon DB serverless PostgreSQL, and Prisma ORM. Supports dual database (PostgreSQL + SQLite) for deployment flexibility.",
      repo: "https://github.com/febririzki95/NeuroPilot",
      live: "https://neuro-pilot-psi.vercel.app",
      tech: [
        "Next.js",
        "TypeScript",
        "Prisma ORM",
        "Neon DB",
        "Caddy Server",
        "dnd-kit",
        "MDX Editor",
        "SQLite",
      ],
    },
    {
      name: "Eksperimen SML",
      description:
        "ML Preprocessing Automation. Supervised Machine Learning experiment repository focused on preprocessing the Breast Cancer Wisconsin dataset. Covers EDA, data cleaning, feature engineering, and reproducible automation scripts.",
      repo: "https://github.com/febririzki95/Eksperimen_SML_Febri",
      tech: ["Python", "Jupyter Notebook", "scikit-learn", "Pandas", "GitHub Actions", "NumPy"],
    },
    {
      name: "Hyperchain Landing",
      description:
        "Integrated Digital Ecosystem Landing Page. Landing page for the LayerBoard digital ecosystem featuring 3D animations with Three.js, motion design via GSAP & Framer Motion, and edge deployment through Cloudflare Pages.",
      repo: "https://github.com/hyperchainpro/hyperchain-landing",
      live: "https://hyperchain-landing.pages.dev",
      tech: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "Tailwind 4",
        "Three.js",
        "GSAP",
        "Framer Motion",
        "Neon DB",
        "Prisma 7",
      ],
    },
    {
      name: "HYP Convert",
      description:
        "Multi-platform Document Converter. A multi-platform document converter app built with Expo (React Native) supporting conversion of PDF, DOCX, XLSX, and images to various formats. Uses Supabase for backend, biometric auth, document scanner.",
      repo: "https://github.com/hyperchainpro/hyp-convert",
      live: "https://hyp-convert.vercel.app",
      tech: [
        "Expo",
        "React Native",
        "TypeScript",
        "Supabase",
        "jsPDF",
        "docx",
        "exceljs",
        "mammoth",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Science (M.Si.) - Biology",
      school: "Universitas Sumatera Utara (USU)",
      period: "2022 - 2024",
      location: "Medan, Indonesia",
      note: "Academic background in biology provides strategic advantage for AI Engineering: deep understanding of complex systems, scientific data analysis, and analytical thinking patterns directly relevant for computational biology, bioinformatics, and AI model development in life sciences & healthcare domains.",
    },
    {
      degree: "Bachelor of Science (S.Si.) - Biology",
      school: "Universitas Syiah Kuala (Unsyiah)",
      period: "2014 - 2018",
      location: "Banda Aceh, Indonesia",
      note: "Strong foundation in scientific method, statistics, and data processing that underpins the career transition to data science and AI engineering.",
    },
  ],
  certifications: {
    dicoding: {
      total: 18,
      categories: [
        { name: "Machine Learning & AI", count: 4 },
        { name: "Frontend & UI/UX", count: 5 },
        { name: "Backend & Cloud", count: 5 },
        { name: "Mobile Development", count: 4 },
      ],
    },
    bdt: {
      name: "Big Data & Data Analytics Training (BDT)",
      count: 1,
    },
    verificationLink:
      "https://drive.google.com/drive/folders/1dFr8J11MOiOYUozlHDO4PvPmmeavzIfX",
  },
  awards: [
    {
      title: "Semifinalist — PIDI Digdaya Bank Indonesia Hackathon 2026",
      organization: "Bank Indonesia",
      year: "2026",
      scope: "National",
      description:
        "Collaborated with a team to develop TRADIX, an innovative data- and AI-driven digital solution supporting Bank Indonesia's digital transformation agenda. Passed the preliminary selection round and ranked among the top 20 teams nationally out of thousands of participating teams.",
    },
  ],
  languages: [
    { name: "Indonesian", level: "Native" },
    { name: "English", level: "Professional" },
  ],
};

// Build comprehensive CV text for OpenRouter evaluation
export function buildCvTextForAI(): string {
  const p = profileData;
  let cv = `# CV — ${p.fullName}\n\n`;
  cv += `**Location:** ${p.location}\n`;
  cv += `**Email:** ${p.email}\n`;
  cv += `**Phone:** ${p.phone} / ${p.phoneAlt}\n`;
  cv += `**LinkedIn:** ${p.linkedin}\n`;
  cv += `**GitHub:** ${p.github} · ${p.githubAlt}\n\n`;

  cv += `## Professional Summary\n\n${p.summary}\n\n`;
  cv += `## Headline\n\n${p.headline}\n\n`;

  cv += `## Target Roles\n\n`;
  p.targetRoles.forEach((r) => (cv += `- ${r}\n`));
  cv += `\n`;

  cv += `## Work Experience\n\n`;
  p.workExperience.forEach((exp) => {
    cv += `### ${exp.company} — ${exp.location}\n`;
    cv += `**${exp.role}**\n`;
    cv += `${exp.period} (${exp.duration})\n\n`;
    exp.bullets.forEach((b) => (cv += `- ${b}\n`));
    cv += `\n`;
  });

  cv += `## Key Projects (with live URLs for verification)\n\n`;
  p.projects.forEach((proj) => {
    cv += `### ${proj.name}\n`;
    if (proj.achievement) cv += `**Achievement:** ${proj.achievement}\n`;
    cv += `- Repo: ${proj.repo}\n`;
    if (proj.live) cv += `- Live: ${proj.live}\n`;
    cv += `- Description: ${proj.description}\n`;
    cv += `- Tech: ${proj.tech.join(", ")}\n\n`;
  });

  cv += `## Education\n\n`;
  p.education.forEach((edu) => {
    cv += `### ${edu.degree}\n`;
    cv += `${edu.school}, ${edu.location} | ${edu.period}\n`;
    cv += `${edu.note}\n\n`;
  });

  cv += `## Skills\n\n`;
  cv += `**UI/UX Designer Tech Stack:** ${p.skills.uiux.join(", ")}\n\n`;
  cv += `**AI Engineer Tech Stack:** ${p.skills.ai.join(", ")}\n\n`;
  cv += `**Frontend Development:** ${p.skills.frontend.join(", ")}\n\n`;
  cv += `**Backend & Database:** ${p.skills.backend.join(", ")}\n\n`;
  cv += `**Cloud & DevOps:** ${p.skills.cloud.join(", ")}\n\n`;
  cv += `**Programming Languages:** ${p.skills.languages.join(", ")}\n\n`;

  cv += `## Certifications\n\n`;
  cv += `**Dicoding Academy** (${p.certifications.dicoding.total} course certificates)\n`;
  p.certifications.dicoding.categories.forEach(
    (c) => (cv += `- ${c.name} — ${c.count} certificates\n`)
  );
  cv += `\n**${p.certifications.bdt.name}** — ${p.certifications.bdt.count} professional certificate\n`;
  cv += `Verification: ${p.certifications.verificationLink}\n\n`;

  cv += `## Awards\n\n`;
  p.awards.forEach((a) => {
    cv += `### ${a.title}\n`;
    cv += `${a.organization} | ${a.year} | ${a.scope}\n`;
    cv += `${a.description}\n\n`;
  });

  cv += `## Languages\n\n`;
  p.languages.forEach((l) => (cv += `- **${l.name}** — ${l.level}\n`));

  return cv;
}
