"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Briefcase,
  FileText,
  Mic,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Github,
  Sparkles,
  Download,
  Search,
  Database,
  Trash2,
  RefreshCw,
  TrendingUp,
  Target,
  Calendar,
  Copy,
  Plus,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Sun,
  Moon,
  Globe,
  Shield,
  Zap,
  Brain,
  ClipboardCheck,
  LayoutDashboard,
  MapPin,
  Mail,
  Lock,
  UserCircle,
  ChevronRight,
  Rocket,
  Users,
} from "lucide-react";

// ───────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────

type EvalResult = {
  success: boolean;
  model?: string;
  evaluation?: string;
  analysis?: string;
  error?: string;
  tokensUsed?: number;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  headline: string | null;
  location: string | null;
  bio: string | null;
  cvText: string | null;
  createdAt?: string;
};

type JobApplication = {
  id: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  jobLocation: string | null;
  jobCountry: string | null;
  jobLevel: string | null;
  jobType: string | null;
  jobSource: string | null;
  jobCategory: string | null;
  matchScore: number | null;
  status: string;
  appliedAt: string | null;
  createdAt: string;
  notes: string | null;
};

type Stats = {
  totalApplications: number;
  byStatus: Record<string, number>;
  byLevel: Record<string, number>;
  bySource?: Record<string, number>;
  responseRate: number;
  interviewRate: number;
  appliedCount: number;
  recentApplications: JobApplication[];
  topMatches: JobApplication[];
};

type ScannedJob = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  jobLocation: string;
  jobCountry: string | null;
  jobLevel: string | null;
  jobType: string | null;
  jobSource: string;
  jobCategory: string | null;
  matchScore: number;
  postedAt: string;
  description?: string;
};

// ───────────────────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────────────────

const REPO_URL = "https://github.com/hyperchainpro/career-ops-web";

const STATUS_COLORS: Record<string, string> = {
  to_apply: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  applied: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  interview: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  offer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const STATUS_LABELS: Record<string, string> = {
  to_apply: "To Apply",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const LEVEL_COLORS: Record<string, string> = {
  internship: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  junior: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  intermediate: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  senior: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  unknown: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const FEATURES = [
  {
    icon: Search,
    title: "Multi-Source Job Scanner",
    desc: "Scan 80+ company boards (Greenhouse + Lever) for remote-friendly roles worldwide. Filter by country, category, and seniority level.",
  },
  {
    icon: Brain,
    title: "AI Job Match Evaluation",
    desc: "Paste any job description and get an AI evaluation of how well your CV matches — with strengths, gaps, and tailored recommendations.",
  },
  {
    icon: FileText,
    title: "Cover Letter Generator",
    desc: "Generate a personalized, role-specific cover letter in seconds using your CV and the target company name.",
  },
  {
    icon: Mic,
    title: "Interview Prep Assistant",
    desc: "Get likely interview questions (technical + behavioral) with concise guidance on how to answer using your real experience.",
  },
  {
    icon: ClipboardCheck,
    title: "ATS Resume Checker",
    desc: "Score your resume against ATS filters. Get a keyword match table, formatting flags, and concrete improvement steps.",
  },
  {
    icon: Database,
    title: "Application Tracker & Dashboard",
    desc: "Track every application from 'to apply' to 'offer'. Auto-cleanup after 30 days. Visualize response rate and funnel at a glance.",
  },
];

const COUNTRY_OPTIONS = [
  { value: "all", label: "All Countries" },
  { value: "remote", label: "Remote / Worldwide" },
  { value: "indonesia", label: "Indonesia" },
  { value: "singapore", label: "Singapore" },
  { value: "united states", label: "United States" },
  { value: "united kingdom", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "canada", label: "Canada" },
  { value: "australia", label: "Australia" },
  { value: "india", label: "India" },
  { value: "japan", label: "Japan" },
  { value: "netherlands", label: "Netherlands" },
  { value: "philippines", label: "Philippines" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "design", label: "Design" },
  { value: "ai", label: "AI / ML" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "data", label: "Data" },
  { value: "devops", label: "DevOps" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
];

const LEVEL_OPTIONS = [
  { value: "all", label: "All Levels" },
  { value: "internship", label: "Internship" },
  { value: "junior", label: "Junior" },
  { value: "intermediate", label: "Intermediate" },
  { value: "senior", label: "Senior" },
];

// ───────────────────────────────────────────────────────────
// Page entry — wraps everything with SessionProvider + ThemeProvider
// ───────────────────────────────────────────────────────────

export default function Page() {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Home />
      </ThemeProvider>
    </SessionProvider>
  );
}

// ───────────────────────────────────────────────────────────
// Home — switches between Landing (guest) and Dashboard (authed)
// ───────────────────────────────────────────────────────────

function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading Job4You…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Landing />;
  }

  return <Dashboard session={session} />;
}

// ───────────────────────────────────────────────────────────
// Theme toggle button
// ───────────────────────────────────────────────────────────

function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // next-themes recommended pattern to avoid hydration mismatch — setState
  // in effect is intentional here (reading DOM/class state on mount).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const current = theme === "system" ? resolvedTheme : theme;
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Toggle theme"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
    >
      {current === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}

// ───────────────────────────────────────────────────────────
// Brand logo
// ───────────────────────────────────────────────────────────

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20">
        <Sparkles className="h-5 w-5" />
      </div>
      {!compact && (
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job4You
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
            AI-Powered Remote Job Search
          </p>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Landing page — hero + features + auth forms + footer
// ───────────────────────────────────────────────────────────

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-md dark:bg-slate-950/70 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge
              variant="outline"
              className="mb-5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
            >
              <Zap className="h-3 w-3 mr-1" />
              Free & Open Source · 80+ Companies · 19 AI Models
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Find your next{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                remote job
              </span>{" "}
              with AI.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Job4You is an AI-powered remote job search platform for{" "}
              <strong className="text-slate-900 dark:text-white">everyone</strong>. Scan 80+ company
              boards, evaluate job matches, generate cover letters, prep for interviews, check your
              ATS score, and track every application — all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#auth"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium px-6 py-3 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Rocket className="h-5 w-5" />
                Get Started Free
              </a>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium px-6 py-3 transition-all"
              >
                <Github className="h-5 w-5" />
                Star on GitHub
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Built for jobseekers worldwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-emerald-600" />
                <span>100% remote-first roles</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Your CV stays private to you</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Everything you need to land the job
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Six powerful tools, one focused platform. No fluff, no paywalls.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                className="hover:shadow-lg hover:-translate-y-0.5 transition-all border-slate-200 dark:border-slate-800"
              >
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-2">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Auth Forms */}
        <section id="auth" className="container mx-auto px-4 py-12 max-w-md scroll-mt-20">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign in or create an account</CardTitle>
              <CardDescription>
                All tools work for guests (demo CV). Sign in to save your CV, scan jobs, and track
                applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForms />
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// AuthForms — login + signup toggle, inline
// ───────────────────────────────────────────────────────────

function AuthForms() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email || !password) {
        setError("Email and password are required.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setSubmitting(true);

      try {
        if (mode === "signup") {
          if (!name) {
            setError("Name is required for signup.");
            setSubmitting(false);
            return;
          }
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            setError(data.error || "Signup failed.");
            setSubmitting(false);
            return;
          }
        }

        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError(
            mode === "signup"
              ? "Account created but auto sign-in failed. Please log in manually."
              : "Invalid email or password."
          );
          setSubmitting(false);
        }
        // On success, useSession() in <Home /> will re-render and switch to Dashboard.
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error. Please try again.");
        setSubmitting(false);
      }
    },
    [mode, name, email, password]
  );

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
            mode === "login"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <LogIn className="h-4 w-4" />
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-md transition-all ${
            mode === "signup"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="auth-name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Name
            </Label>
            <Input
              id="auth-name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="auth-email" className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </Label>
          <Input
            id="auth-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="auth-password" className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Password
          </Label>
          <Input
            id="auth-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          size="lg"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "login" ? "Signing in…" : "Creating account…"}
            </>
          ) : mode === "login" ? (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed">
        By continuing you agree that your CV and application data will be stored securely to power
        the AI tools. Delete your data anytime via the Profile tab.
      </p>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Dashboard — for logged-in users
// ───────────────────────────────────────────────────────────

type DashboardProps = {
  session: any;
};

function Dashboard({ session }: DashboardProps) {
  const user = session?.user;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("scanner");

  // Load profile on mount
  const loadProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.success) setProfile(data.user);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // AI tools state (shared)
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [resultKind, setResultKind] = useState<
    "evaluate" | "cover-letter" | "interview" | "ats-check" | null
  >(null);

  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [scannedJobs, setScannedJobs] = useState<ScannedJob[]>([]);
  const [scanResult, setScanResult] = useState<{
    totalFound: number;
    saved: number;
    scannedBoards: number;
  } | null>(null);
  const [scanAuthError, setScanAuthError] = useState<string | null>(null);
  const [scanFilters, setScanFilters] = useState({
    country: "all",
    category: "all",
    level: "all",
  });

  // Tracker state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [trackerAuthError, setTrackerAuthError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats state
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const hasCV = !!profile?.cvText && profile.cvText.length > 50;

  // ── Handlers ──────────────────────────────────────────

  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    setTrackerAuthError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/applications?${params}`);
      if (res.status === 401) {
        setTrackerAuthError("Please sign in to view your applications.");
        return;
      }
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoadingApps(false);
    }
  }, [filterStatus, searchQuery]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "tracker") loadApplications();
    else if (activeTab === "dashboard") loadStats();
  }, [activeTab, loadApplications, loadStats]);

  const handleEvaluate = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      setResultKind("evaluate");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, jobUrl }),
      });
      const data = await res.json();
      setResult(data);
      setResultKind("evaluate");
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Network error",
      });
      setResultKind("evaluate");
    } finally {
      setLoading(false);
    }
  }, [jobDescription, jobUrl]);

  const handleCoverLetter = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      setResultKind("cover-letter");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, companyName }),
      });
      const data = await res.json();
      setResult(data);
      setResultKind("cover-letter");
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Network error",
      });
      setResultKind("cover-letter");
    } finally {
      setLoading(false);
    }
  }, [jobDescription, companyName]);

  const handleInterview = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      setResultKind("interview");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();
      setResult(data);
      setResultKind("interview");
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Network error",
      });
      setResultKind("interview");
    } finally {
      setLoading(false);
    }
  }, [jobDescription]);

  const handleAtsCheck = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      setResultKind("ats-check");
      return;
    }
    if (!hasCV) {
      setResult({
        success: false,
        error:
          "No CV found. Go to the Profile tab and paste your CV/resume text first — ATS check uses your CV.",
      });
      setResultKind("ats-check");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await res.json();
      setResult(data);
      setResultKind("ats-check");
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Network error",
      });
      setResultKind("ats-check");
    } finally {
      setLoading(false);
    }
  }, [jobDescription, hasCV]);

  const handleScan = useCallback(async () => {
    setScanning(true);
    setScanAuthError(null);
    setScannedJobs([]);
    setScanResult(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (scanFilters.country !== "all") params.set("country", scanFilters.country);
      if (scanFilters.category !== "all") params.set("category", scanFilters.category);
      if (scanFilters.level !== "all") params.set("level", scanFilters.level);
      const res = await fetch(`/api/scan?${params}`);
      if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        setScanAuthError(data.error || "Please sign in to scan jobs.");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setScannedJobs(data.jobs || []);
        setScanResult({
          totalFound: data.totalFound,
          saved: data.saved,
          scannedBoards: data.scannedBoards,
        });
      } else {
        setScanAuthError(data.error || "Scan failed.");
      }
    } catch (err) {
      console.error("Scan failed:", err);
      setScanAuthError(err instanceof Error ? err.message : "Scan failed.");
    } finally {
      setScanning(false);
    }
  }, [scanFilters]);

  const handleSaveToTracker = useCallback(
    async (job: ScannedJob) => {
      try {
        await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: job.jobTitle,
            companyName: job.companyName,
            jobUrl: job.jobUrl,
            jobLocation: job.jobLocation,
            jobCountry: job.jobCountry,
            jobLevel: job.jobLevel,
            jobType: job.jobType,
            jobSource: job.jobSource,
            jobCategory: job.jobCategory,
            matchScore: job.matchScore,
            status: "to_apply",
          }),
        });
        loadStats();
        loadApplications();
      } catch (err) {
        console.error("Failed to save:", err);
      }
    },
    [loadApplications, loadStats]
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await fetch(`/api/applications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        loadApplications();
        loadStats();
      } catch (err) {
        console.error("Failed to update:", err);
      }
    },
    [loadApplications, loadStats]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this application?")) return;
      try {
        await fetch(`/api/applications/${id}`, { method: "DELETE" });
        loadApplications();
        loadStats();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    },
    [loadApplications, loadStats]
  );

  const handleCleanup = useCallback(async () => {
    if (!confirm("Delete all records older than 30 days? (interview/offer protected)")) return;
    try {
      const res = await fetch("/api/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysOld: 30 }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          `Cleanup done! Deleted ${data.deleted.deletedApplications} applications and ${data.deleted.deletedLogs} logs.`
        );
        loadApplications();
        loadStats();
      }
    } catch (err) {
      console.error("Cleanup failed:", err);
    }
  }, [loadApplications, loadStats]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleDownloadResult = useCallback(() => {
    const text = result?.evaluation || result?.analysis || "";
    if (!text) return;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job4you-${resultKind}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, resultKind]);

  const handleSignOut = useCallback(() => {
    signOut({ redirect: false });
  }, []);

  const showResult = result && resultKind === activeTab &&
    ["evaluate", "cover-letter", "interview", "ats-check"].includes(activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm">
              <UserCircle className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
                {user?.name || user?.email}
              </span>
              {hasCV ? (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] px-1.5 py-0">
                  CV
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-1.5 py-0">
                  No CV
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-6xl w-full">
        {!hasCV && activeTab !== "profile" && (
          <Alert className="mb-5 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">
              CV not set up yet
            </AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-200">
              All AI tools use your saved CV.{" "}
              <button
                onClick={() => setActiveTab("profile")}
                className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100"
              >
                Add your CV now →
              </button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full overflow-x-auto h-auto p-1 gap-1 justify-start sm:justify-center">
            <TabsTrigger value="profile" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Scanner</span>
            </TabsTrigger>
            <TabsTrigger value="evaluate" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Evaluate</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Letter</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <Mic className="h-4 w-4" />
              <span className="hidden md:inline">Interview</span>
            </TabsTrigger>
            <TabsTrigger value="ats-check" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden md:inline">ATS</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-xs md:text-sm shrink-0">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== PROFILE TAB ===== */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileSection profile={profile} loading={profileLoading} onSaved={loadProfile} />
          </TabsContent>

          {/* ===== SCANNER TAB ===== */}
          <TabsContent value="scanner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-emerald-600" />
                  Remote Job Scanner
                </CardTitle>
                <CardDescription>
                  Scan 80+ Greenhouse &amp; Lever job boards for remote-friendly roles worldwide.
                  Filter by country, category, and seniority level.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Country</Label>
                    <select
                      value={scanFilters.country}
                      onChange={(e) =>
                        setScanFilters((s) => ({ ...s, country: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    >
                      {COUNTRY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <select
                      value={scanFilters.category}
                      onChange={(e) =>
                        setScanFilters((s) => ({ ...s, category: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    >
                      {CATEGORY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Level</Label>
                    <select
                      value={scanFilters.level}
                      onChange={(e) =>
                        setScanFilters((s) => ({ ...s, level: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                    >
                      {LEVEL_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning 80+ company boards…
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Scan Jobs Now
                    </>
                  )}
                </Button>

                {scanAuthError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication required</AlertTitle>
                    <AlertDescription>{scanAuthError}</AlertDescription>
                  </Alert>
                )}

                {scanResult && !scanAuthError && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Scan Complete</AlertTitle>
                    <AlertDescription>
                      Found <strong>{scanResult.totalFound}</strong> matching jobs across{" "}
                      <strong>{scanResult.scannedBoards}</strong> company boards. Saved{" "}
                      <strong>{scanResult.saved}</strong> new jobs to your tracker.
                    </AlertDescription>
                  </Alert>
                )}

                {scannedJobs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                      Top Matches ({scannedJobs.length})
                    </h3>
                    <div className="grid gap-3 max-h-[700px] overflow-y-auto pr-1 custom-scroll">
                      {scannedJobs.map((job) => (
                        <Card key={job.jobId} className="p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                  {job.jobTitle}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {job.companyName} · {job.jobLocation}
                                </p>
                              </div>
                              <Badge
                                className={`shrink-0 ${
                                  job.matchScore >= 50
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : job.matchScore >= 30
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                <Target className="h-3 w-3 mr-1" />
                                {job.matchScore}%
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {job.jobCountry && (
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {job.jobCountry}
                                </Badge>
                              )}
                              {job.jobLevel && job.jobLevel !== "unknown" && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${LEVEL_COLORS[job.jobLevel] || LEVEL_COLORS.unknown}`}
                                >
                                  {job.jobLevel}
                                </Badge>
                              )}
                              {job.jobCategory && (
                                <Badge variant="outline" className="text-xs">
                                  {job.jobCategory}
                                </Badge>
                              )}
                              {job.jobType && (
                                <Badge variant="outline" className="text-xs">
                                  {job.jobType}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {job.jobSource}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => window.open(job.jobUrl, "_blank")}
                                className="flex-1"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View &amp; Apply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSaveToTracker(job)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== EVALUATE TAB ===== */}
          <TabsContent value="evaluate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Job Match Evaluation
                </CardTitle>
                <CardDescription>
                  Paste a job description. AI evaluates how well your profile matches the role and
                  provides tailored recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job URL (optional)</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://example.com/job/123"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDesc">
                    Job Description{" "}
                    <span className="text-xs text-slate-500">
                      ({jobDescription.length} characters)
                    </span>
                  </Label>
                  <Textarea
                    id="jobDesc"
                    placeholder="Paste the full job description here…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {jobDescription.length > 0 && jobDescription.length < 100 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Need at least {100 - jobDescription.length} more characters
                    </p>
                  )}
                </div>
                {!hasCV && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No CV saved — AI will use a demo profile. Sign in &amp; save your CV in the
                    Profile tab for personalized results.
                  </p>
                )}
                <Button
                  onClick={handleEvaluate}
                  disabled={loading || jobDescription.length < 100}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating with AI…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Evaluate Job Match
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== COVER LETTER TAB ===== */}
          <TabsContent value="cover-letter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Generate Tailored Cover Letter
                </CardTitle>
                <CardDescription>
                  Generate a personalized cover letter for this specific job application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (optional)</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="e.g., Gojek, Tokopedia, Anthropic"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescCL">
                    Job Description{" "}
                    <span className="text-xs text-slate-500">
                      ({jobDescription.length} characters)
                    </span>
                  </Label>
                  <Textarea
                    id="jobDescCL"
                    placeholder="Paste the full job description here…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                {!hasCV && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No CV saved — AI will use a demo profile. Save your CV for a personalized letter.
                  </p>
                )}
                <Button
                  onClick={handleCoverLetter}
                  disabled={loading || jobDescription.length < 100}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Cover Letter…
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== INTERVIEW TAB ===== */}
          <TabsContent value="interview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-emerald-600" />
                  Interview Preparation
                </CardTitle>
                <CardDescription>
                  Generate likely interview questions (technical + behavioral) with guidance on how
                  to answer using your actual experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobDescI">
                    Job Description{" "}
                    <span className="text-xs text-slate-500">
                      ({jobDescription.length} characters)
                    </span>
                  </Label>
                  <Textarea
                    id="jobDescI"
                    placeholder="Paste the full job description here…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                {!hasCV && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No CV saved — AI will use a demo profile. Save your CV for tailored interview
                    prep.
                  </p>
                )}
                <Button
                  onClick={handleInterview}
                  disabled={loading || jobDescription.length < 100}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Interview Questions…
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Generate Interview Prep
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== ATS CHECK TAB ===== */}
          <TabsContent value="ats-check" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                  ATS Resume Checker
                </CardTitle>
                <CardDescription>
                  Analyze your CV against a job description for ATS compatibility. Returns a score,
                  keyword match table, formatting issues, and concrete improvement steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasCV ? (
                  <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">
                      CV required
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-200">
                      ATS check uses your saved CV. Go to the{" "}
                      <button
                        onClick={() => setActiveTab("profile")}
                        className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100"
                      >
                        Profile tab
                      </button>{" "}
                      and paste your resume/CV text first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertDescription>
                      Using your saved CV ({profile?.cvText?.length || 0} characters). Paste the
                      target job description below.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="jobDescATS">
                    Job Description{" "}
                    <span className="text-xs text-slate-500">
                      ({jobDescription.length} characters)
                    </span>
                  </Label>
                  <Textarea
                    id="jobDescATS"
                    placeholder="Paste the full job description here…"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {jobDescription.length > 0 && jobDescription.length < 100 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Need at least {100 - jobDescription.length} more characters
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleAtsCheck}
                  disabled={loading || jobDescription.length < 100 || !hasCV}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running ATS analysis…
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="mr-2 h-4 w-4" />
                      Check ATS Score
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TRACKER TAB ===== */}
          <TabsContent value="tracker" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-emerald-600" />
                      Application Tracker
                    </CardTitle>
                    <CardDescription>
                      Track job applications. Auto-delete records older than 30 days (except
                      interview/offer stage).
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCleanup}
                    title="Delete records older than 30 days"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Cleanup Old</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {trackerAuthError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication required</AlertTitle>
                    <AlertDescription>{trackerAuthError}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="Search by title, company, location…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="to_apply">To Apply</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Button variant="outline" size="sm" onClick={loadApplications}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>

                    {loadingApps ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                      </div>
                    ) : applications.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No applications yet. Use the Scanner to find jobs!</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 max-h-[700px] overflow-y-auto pr-1 custom-scroll">
                        {applications.map((app) => (
                          <Card key={app.id} className="p-4">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                    {app.jobTitle}
                                  </h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {app.companyName}
                                    {app.jobLocation && ` · ${app.jobLocation}`}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    Added: {new Date(app.createdAt).toLocaleDateString()}
                                    {app.appliedAt &&
                                      ` · Applied: ${new Date(app.appliedAt).toLocaleDateString()}`}
                                  </p>
                                </div>
                                {app.matchScore !== null && (
                                  <Badge
                                    className={`shrink-0 ${
                                      app.matchScore >= 50
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                        : app.matchScore >= 30
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                  >
                                    <Target className="h-3 w-3 mr-1" />
                                    {app.matchScore}%
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 items-center">
                                <Badge
                                  className={`text-xs ${STATUS_COLORS[app.status] || STATUS_COLORS.to_apply}`}
                                >
                                  {STATUS_LABELS[app.status] || app.status}
                                </Badge>
                                {app.jobLevel && app.jobLevel !== "unknown" && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${LEVEL_COLORS[app.jobLevel] || LEVEL_COLORS.unknown}`}
                                  >
                                    {app.jobLevel}
                                  </Badge>
                                )}
                                {app.jobSource && (
                                  <Badge variant="outline" className="text-xs">
                                    {app.jobSource}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {["to_apply", "applied", "interview", "offer", "rejected"].map(
                                  (status) => (
                                    <Button
                                      key={status}
                                      size="sm"
                                      variant={app.status === status ? "default" : "outline"}
                                      className="text-xs h-7"
                                      onClick={() => handleUpdateStatus(app.id, status)}
                                    >
                                      {STATUS_LABELS[status]}
                                    </Button>
                                  )
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(app.jobUrl, "_blank")}
                                  className="flex-1"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  View Job
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(app.id)}
                                  className="text-rose-600 hover:text-rose-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== DASHBOARD TAB ===== */}
          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-emerald-600" />
                  Job Search Dashboard
                </CardTitle>
                <CardDescription>
                  Your job search progress at a glance. Auto-updates when you scan or track
                  applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : stats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-600">
                          {stats.totalApplications}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Total Applications
                        </div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-sky-600">{stats.appliedCount}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applied</div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-amber-600">
                          {stats.responseRate}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Response Rate
                        </div>
                      </Card>
                      <Card className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {stats.interviewRate}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Interview Rate
                        </div>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">By Status</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {Object.entries(stats.byStatus).map(([status, count]) => (
                          <div key={status} className="text-center p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="text-2xl font-bold">{count}</div>
                            <Badge
                              className={`text-xs mt-1 ${STATUS_COLORS[status] || STATUS_COLORS.to_apply}`}
                            >
                              {STATUS_LABELS[status] || status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">By Job Level</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {Object.entries(stats.byLevel).map(([level, count]) => (
                          <div key={level} className="text-center p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="text-2xl font-bold">{count}</div>
                            <Badge
                              variant="outline"
                              className={`text-xs mt-1 ${LEVEL_COLORS[level] || LEVEL_COLORS.unknown}`}
                            >
                              {level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {stats.topMatches.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Top Matches to Apply
                        </h3>
                        <div className="grid gap-2">
                          {stats.topMatches.map((job) => (
                            <div
                              key={job.id}
                              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{job.jobTitle}</div>
                                <div className="text-xs text-slate-500">{job.companyName}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                  {job.matchScore}%
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(job.jobUrl, "_blank")}
                                >
                                  Apply
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stats.recentApplications.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Recent Activity
                        </h3>
                        <div className="grid gap-2">
                          {stats.recentApplications.map((app) => (
                            <div
                              key={app.id}
                              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="font-medium">{app.jobTitle}</span>
                                <span className="text-slate-500 ml-2">@ {app.companyName}</span>
                              </div>
                              <Badge
                                className={`text-xs ${STATUS_COLORS[app.status] || STATUS_COLORS.to_apply}`}
                              >
                                {STATUS_LABELS[app.status] || app.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stats.totalApplications === 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No data yet</AlertTitle>
                        <AlertDescription>
                          Go to the Scanner tab to find jobs, then save them to your tracker. Stats
                          will appear here automatically.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">Failed to load stats</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Result Display (for evaluate/cover-letter/interview/ats-check) */}
        {showResult && result && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Result
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                      Error
                    </>
                  )}
                </CardTitle>
                {result.success && result.model && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Model: {result.model.split("/").pop()}
                    </Badge>
                    {result.tokensUsed && (
                      <Badge variant="outline" className="text-xs">
                        {result.tokensUsed} tokens
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(result.evaluation || result.analysis || "")}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadResult}>
                      <Download className="mr-1 h-3 w-3" />
                      .md
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {result.success && (result.evaluation || result.analysis) ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <MarkdownRenderer content={result.evaluation || result.analysis || ""} />
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// ProfileSection — edit name, headline, location, bio, CV text
// ───────────────────────────────────────────────────────────

type ProfileSectionProps = {
  profile: UserProfile | null;
  loading: boolean;
  onSaved: () => void;
};

function ProfileSection({ profile, loading, onSaved }: ProfileSectionProps) {
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [cvText, setCvText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setHeadline(profile.headline || "");
      setLocation(profile.location || "");
      setBio(profile.bio || "");
      setCvText(profile.cvText || "");
    }
  }, [profile]);

  const hasCV = !!cvText && cvText.length > 50;

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSavedMsg(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, headline, location, bio, cvText }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to save profile.");
        return;
      }
      setSavedMsg("Profile saved successfully.");
      onSaved();
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setSaving(false);
    }
  }, [name, headline, location, bio, cvText, onSaved]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading your profile…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* CV Status Banner */}
      <Card
        className={
          hasCV
            ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900"
            : "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900"
        }
      >
        <CardContent className="py-4 flex items-center gap-3">
          {hasCV ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {hasCV ? "CV saved" : "CV not set up yet"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hasCV
                ? `${cvText.length.toLocaleString()} characters saved. All AI tools will use this CV.`
                : "Paste your CV/resume below — all AI tools (Evaluate, Cover Letter, Interview Prep, ATS Check) use this CV text."}
            </p>
          </div>
          {hasCV && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Active
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Profile &amp; CV
          </CardTitle>
          <CardDescription>
            Update your profile and paste your CV/resume in markdown. All AI tools will use the CV
            text below to generate personalized results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p-name">Name</Label>
              <Input
                id="p-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-headline">Headline</Label>
              <Input
                id="p-headline"
                type="text"
                placeholder="e.g., Frontend Engineer · React / Next.js specialist"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-location">Location</Label>
              <Input
                id="p-location"
                type="text"
                placeholder="e.g., Jakarta, Indonesia · Open to remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-bio">Bio (short)</Label>
              <Input
                id="p-bio"
                type="text"
                placeholder="One-line summary of who you are"
                value={bio || ""}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="p-cv" className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                CV / Resume Text (markdown supported)
              </span>
              <span className="text-xs text-slate-500">
                {cvText.length.toLocaleString()} / 50,000
              </span>
            </Label>
            <Textarea
              id="p-cv"
              placeholder={
                "Paste your full CV/resume here as plain text or markdown.\n\n" +
                "Example structure:\n" +
                "# Jane Doe\n" +
                "## Senior Frontend Engineer\n\n" +
                "## Experience\n" +
                "### Acme Corp — Frontend Engineer (2022-present)\n" +
                "- Led migration from CRA to Next.js 16, reducing build time by 60%.\n" +
                "- Built design system used by 30+ engineers.\n\n" +
                "## Skills\n" +
                "- TypeScript, React, Next.js, Tailwind CSS, Node.js, PostgreSQL\n\n" +
                "## Education\n" +
                "### B.Sc. Computer Science — University of XYZ (2018-2022)"
              }
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              maxLength={50000}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tip: paste your resume as plain text. Markdown headings (#, ##, ###) and bullet lists
              (-) are supported and used by AI for context.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {savedMsg && (
            <Alert className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                {savedMsg}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Save Profile &amp; CV
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (!confirm("Clear CV text? This cannot be undone.")) return;
                setCvText("");
              }}
              disabled={!cvText}
              className="text-rose-600 hover:text-rose-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear CV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Footer
// ───────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>
              Job4You · AI-Powered Remote Job Search Platform · Built with Next.js 16, OpenRouter
              AI, and Prisma.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-xs">© {new Date().getFullYear()} Job4You</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ───────────────────────────────────────────────────────────
// MarkdownRenderer — simple markdown renderer (reused)
// ───────────────────────────────────────────────────────────

function MarkdownRenderer({ content }: { content: string }) {
  const renderInlineFormat = useCallback((text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const matches = [
        boldMatch
          ? { type: "bold" as const, match: boldMatch, index: boldMatch.index! }
          : null,
        codeMatch
          ? { type: "code" as const, match: codeMatch, index: codeMatch.index! }
          : null,
        linkMatch
          ? { type: "link" as const, match: linkMatch, index: linkMatch.index! }
          : null,
      ].filter(Boolean) as Array<{
        type: "bold" | "code" | "link";
        match: RegExpMatchArray;
        index: number;
      }>;

      if (matches.length === 0) {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }

      matches.sort((a, b) => a.index - b.index);
      const first = matches[0];

      if (first.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, first.index)}</span>);
      }

      if (first.type === "bold") {
        parts.push(
          <strong key={key++} className="font-bold text-slate-900 dark:text-white">
            {first.match[1]}
          </strong>
        );
      } else if (first.type === "code") {
        parts.push(
          <code
            key={key++}
            className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm text-emerald-700 dark:text-emerald-400"
          >
            {first.match[1]}
          </code>
        );
      } else if (first.type === "link") {
        parts.push(
          <a
            key={key++}
            href={first.match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline inline-flex items-center gap-0.5"
          >
            {first.match[1]}
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      }

      remaining = remaining.slice(first.index + first.match[0].length);
    }

    return parts;
  }, []);

  // Render tables (basic GFM table support)
  const renderMarkdown = useMemo(() => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaderSepSeen = false;

    const flushTable = (idx: number) => {
      if (tableRows.length === 0) return;
      const hasHeader = tableHeaderSepSeen;
      const headerCells = hasHeader ? tableRows[0] : tableRows[0];
      const bodyRows = hasHeader ? tableRows.slice(1) : tableRows;
      elements.push(
        <div key={`tbl-${idx}`} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                {headerCells.map((c, i) => (
                  <th
                    key={i}
                    className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-semibold text-slate-900 dark:text-white"
                  >
                    {renderInlineFormat(c.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="even:bg-slate-50 dark:even:bg-slate-900/40">
                  {row.map((c, ci) => (
                    <td
                      key={ci}
                      className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300"
                    >
                      {renderInlineFormat(c.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      tableHeaderSepSeen = false;
      inTable = false;
    };

    lines.forEach((line, idx) => {
      // Code fence
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto my-4 border border-slate-200 dark:border-slate-800"
            >
              <code className="text-sm font-mono">{codeContent.join("\n")}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          if (inTable) flushTable(idx);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Table detection: line with | and at least 2 cells
      const isTableLine = line.trim().startsWith("|") && line.trim().endsWith("|") && line.includes("|");
      const isHeaderSep = /^\s*\|[\s:|-]+\|\s*$/.test(line) && line.includes("-");

      if (isTableLine) {
        if (isHeaderSep) {
          tableHeaderSepSeen = true;
          return;
        }
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={idx}
            className="text-lg font-bold mt-6 mb-2 text-slate-900 dark:text-white"
          >
            {renderInlineFormat(line.slice(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={idx}
            className="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-1"
          >
            {renderInlineFormat(line.slice(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={idx}
            className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white"
          >
            {renderInlineFormat(line.slice(2))}
          </h1>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <ul key={idx} className="my-1 ml-6 list-disc space-y-1">
            <li className="text-slate-700 dark:text-slate-300">
              {renderInlineFormat(line.slice(2))}
            </li>
          </ul>
        );
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <ol key={idx} className="my-1 ml-6 list-decimal space-y-1">
            <li className="text-slate-700 dark:text-slate-300">
              {renderInlineFormat(line.replace(/^\d+\.\s/, ""))}
            </li>
          </ol>
        );
      } else if (line.startsWith("---")) {
        elements.push(
          <hr key={idx} className="my-4 border-slate-200 dark:border-slate-700" />
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={idx}
            className="my-2 pl-4 border-l-4 border-emerald-400 dark:border-emerald-600 italic text-slate-600 dark:text-slate-400"
          >
            {renderInlineFormat(line.slice(2))}
          </blockquote>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p
            key={idx}
            className="text-slate-700 dark:text-slate-300 leading-relaxed my-1"
          >
            {renderInlineFormat(line)}
          </p>
        );
      }
    });

    if (inTable) flushTable(lines.length);
    if (inCodeBlock && codeContent.length > 0) {
      elements.push(
        <pre
          key="code-final"
          className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto my-4 border border-slate-200 dark:border-slate-800"
        >
          <code className="text-sm font-mono">{codeContent.join("\n")}</code>
        </pre>
      );
    }

    return elements;
  }, [content, renderInlineFormat]);

  return <div className="space-y-1">{renderMarkdown}</div>;
}
