"use client";

import { useState, useCallback, useEffect } from "react";
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
  Linkedin,
  Mail,
  MapPin,
  Phone,
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
  Eye,
  Plus,
} from "lucide-react";

type EvalResult = {
  success: boolean;
  model?: string;
  evaluation?: string;
  error?: string;
  tokensUsed?: number;
};

type JobApplication = {
  id: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  jobLocation: string | null;
  jobLevel: string | null;
  jobType: string | null;
  jobSource: string | null;
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
  bySource: Record<string, number>;
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
  jobLevel: string | null;
  jobType: string | null;
  jobSource: string;
  matchScore: number;
  postedAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  to_apply: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  interview: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  offer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("evaluate");

  // AI tools state
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [scannedJobs, setScannedJobs] = useState<ScannedJob[]>([]);
  const [scanResult, setScanResult] = useState<{
    totalFound: number;
    saved: number;
    scannedBoards: number;
  } | null>(null);

  // Tracker state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats state
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Load applications on mount
  const loadApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (searchQuery) params.set("search", searchQuery);

      const response = await fetch(`/api/applications?${params}`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoadingApps(false);
    }
  }, [filterStatus, searchQuery]);

  // Load stats
  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "tracker") {
      loadApplications();
    } else if (activeTab === "dashboard") {
      loadStats();
    }
  }, [activeTab, loadApplications, loadStats]);

  // AI: Evaluate job
  const handleEvaluate = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, jobUrl }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }, [jobDescription, jobUrl]);

  // AI: Generate cover letter
  const handleCoverLetter = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, companyName }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }, [jobDescription, companyName]);

  // AI: Generate interview prep
  const handleInterview = useCallback(async () => {
    if (jobDescription.length < 100) {
      setResult({
        success: false,
        error: "Job description is too short. Please provide at least 100 characters.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }, [jobDescription]);

  // Scanner: Scan jobs
  const handleScan = useCallback(async () => {
    setScanning(true);
    setScannedJobs([]);
    setScanResult(null);

    try {
      const response = await fetch("/api/scan?limit=50");
      const data = await response.json();
      if (data.success) {
        setScannedJobs(data.jobs);
        setScanResult({
          totalFound: data.totalFound,
          saved: data.saved,
          scannedBoards: data.scannedBoards,
        });
      } else {
        setScanResult({ totalFound: 0, saved: 0, scannedBoards: 0 });
      }
    } catch (error) {
      console.error("Scan failed:", error);
      setScanResult({ totalFound: 0, saved: 0, scannedBoards: 0 });
    } finally {
      setScanning(false);
    }
  }, []);

  // Save application to tracker
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
            jobLevel: job.jobLevel,
            jobType: job.jobType,
            jobSource: job.jobSource,
            matchScore: job.matchScore,
            status: "to_apply",
          }),
        });
        // Reload stats and applications
        loadStats();
        loadApplications();
      } catch (error) {
        console.error("Failed to save:", error);
      }
    },
    [loadApplications, loadStats]
  );

  // Update application status
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
      } catch (error) {
        console.error("Failed to update:", error);
      }
    },
    [loadApplications, loadStats]
  );

  // Delete application
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this application?")) return;
      try {
        await fetch(`/api/applications/${id}`, {
          method: "DELETE",
        });
        loadApplications();
        loadStats();
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    },
    [loadApplications, loadStats]
  );

  // Manual cleanup
  const handleCleanup = useCallback(async () => {
    if (!confirm("Delete all records older than 30 days? (interview/offer protected)")) return;
    try {
      const response = await fetch("/api/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysOld: 30 }),
      });
      const data = await response.json();
      if (data.success) {
        alert(
          `Cleanup done! Deleted ${data.deleted.deletedApplications} applications and ${data.deleted.deletedLogs} logs.`
        );
        loadApplications();
        loadStats();
      }
    } catch (error) {
      console.error("Cleanup failed:", error);
    }
  }, [loadApplications, loadStats]);

  // Download result as markdown
  const handleDownloadResult = useCallback(() => {
    if (!result?.evaluation) return;
    const blob = new Blob([result.evaluation], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ext =
      activeTab === "evaluate"
        ? "evaluation"
        : activeTab === "cover-letter"
        ? "cover-letter"
        : "interview-prep";
    a.download = `febri-${ext}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, activeTab]);

  // Copy to clipboard
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur dark:bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Career Ops AI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Powered by OpenRouter + Neon DB · For Febri Rizki
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <a
                href="https://github.com/hyperchainpro/career-ops-web"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/febririzki95"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Card */}
        <Card className="mb-8 border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-slate-900 dark:text-white">
                  Febri Rizki
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  UI/UX Designer &amp; AI Engineer · Biology M.Sc. background
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  11+ Projects Shipped
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  Hackathon Semifinalist
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  18 Certificates
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-emerald-600" />
                <span>febririzki95@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>+62 852-6543-6395</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Medan, North Sumatra, Indonesia</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                <span>5+ years experience</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="evaluate" className="flex items-center gap-1 text-xs md:text-sm">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Evaluate</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center gap-1 text-xs md:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Letter</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-1 text-xs md:text-sm">
              <Mic className="h-4 w-4" />
              <span className="hidden md:inline">Interview</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-1 text-xs md:text-sm">
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Scanner</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-1 text-xs md:text-sm">
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs md:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== EVALUATE TAB ===== */}
          <TabsContent value="evaluate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Job Match Evaluation
                </CardTitle>
                <CardDescription>
                  Paste a job description. AI evaluates how well your profile matches
                  the role and provides tailored recommendations.
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
                    placeholder="Paste the full job description here..."
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
                  onClick={handleEvaluate}
                  disabled={loading || jobDescription.length < 100}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating with AI...
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
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <Button
                  onClick={handleCoverLetter}
                  disabled={loading || jobDescription.length < 100}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Cover Letter...
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
                  Generate likely interview questions (technical + behavioral) with
                  guidance on how to answer using your actual experience.
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
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>
                <Button
                  onClick={handleInterview}
                  disabled={loading || jobDescription.length < 100}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Interview Questions...
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

          {/* ===== SCANNER TAB ===== */}
          <TabsContent value="scanner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-emerald-600" />
                  Job Scanner
                </CardTitle>
                <CardDescription>
                  Scan Greenhouse public job boards for UI/UX Designer &amp; AI Engineer roles
                  (internship, junior, intermediate) at remote &amp; Indonesia-friendly companies.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                >
                  {scanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning 25+ company job boards...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Scan Jobs Now
                    </>
                  )}
                </Button>

                {scanResult && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Scan Complete</AlertTitle>
                    <AlertDescription>
                      Found <strong>{scanResult.totalFound}</strong> matching jobs across{" "}
                      <strong>{scanResult.scannedBoards}</strong> company boards.
                      Saved <strong>{scanResult.saved}</strong> new jobs to tracker.
                    </AlertDescription>
                  </Alert>
                )}

                {scannedJobs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">
                      Top Matches ({scannedJobs.length})
                    </h3>
                    <div className="grid gap-3 max-h-[600px] overflow-y-auto">
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
                              {job.jobLevel && job.jobLevel !== "unknown" && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${LEVEL_COLORS[job.jobLevel] || LEVEL_COLORS.unknown}`}
                                >
                                  {job.jobLevel}
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
                                variant="default"
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

          {/* ===== TRACKER TAB ===== */}
          <TabsContent value="tracker" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-emerald-600" />
                      Application Tracker
                    </CardTitle>
                    <CardDescription>
                      Track job applications. Auto-delete records older than 30 days
                      (except interview/offer stage).
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCleanup}
                    title="Delete records older than 30 days"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Cleanup Old
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by title, company, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
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

                {/* Applications List */}
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
                  <div className="grid gap-3 max-h-[600px] overflow-y-auto">
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
                                {app.appliedAt && ` · Applied: ${new Date(app.appliedAt).toLocaleDateString()}`}
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
                            <Badge className={`text-xs ${STATUS_COLORS[app.status] || STATUS_COLORS.to_apply}`}>
                              {STATUS_LABELS[app.status] || app.status}
                            </Badge>
                            {app.jobLevel && app.jobLevel !== "unknown" && (
                              <Badge variant="outline" className={`text-xs ${LEVEL_COLORS[app.jobLevel] || LEVEL_COLORS.unknown}`}>
                                {app.jobLevel}
                              </Badge>
                            )}
                            {app.jobSource && (
                              <Badge variant="outline" className="text-xs">
                                {app.jobSource}
                              </Badge>
                            )}
                          </div>

                          {/* Status change buttons */}
                          <div className="flex flex-wrap gap-1">
                            {["to_apply", "applied", "interview", "offer", "rejected"].map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={app.status === status ? "default" : "outline"}
                                className="text-xs h-7"
                                onClick={() => handleUpdateStatus(app.id, status)}
                              >
                                {STATUS_LABELS[status]}
                              </Button>
                            ))}
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
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== DASHBOARD TAB ===== */}
          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Job Search Dashboard
                </CardTitle>
                <CardDescription>
                  Your job search progress at a glance. Auto-updates when you scan or
                  track applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : stats ? (
                  <div className="space-y-6">
                    {/* Top Stats Cards */}
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
                        <div className="text-3xl font-bold text-blue-600">
                          {stats.appliedCount}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Applied
                        </div>
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

                    {/* Status Breakdown */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">By Status</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(stats.byStatus).map(([status, count]) => (
                          <div key={status} className="text-center">
                            <div className="text-2xl font-bold">{count}</div>
                            <Badge className={`text-xs ${STATUS_COLORS[status] || STATUS_COLORS.to_apply}`}>
                              {STATUS_LABELS[status] || status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Level Breakdown */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">By Job Level</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(stats.byLevel).map(([level, count]) => (
                          <div key={level} className="text-center">
                            <div className="text-2xl font-bold">{count}</div>
                            <Badge variant="outline" className={`text-xs ${LEVEL_COLORS[level] || LEVEL_COLORS.unknown}`}>
                              {level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Matches */}
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
                                <div className="font-medium truncate">
                                  {job.jobTitle}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {job.companyName}
                                </div>
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

                    {/* Recent Activity */}
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
                              <Badge className={`text-xs ${STATUS_COLORS[app.status] || STATUS_COLORS.to_apply}`}>
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
                          Go to the Scanner tab to find jobs, or manually add applications
                          via the API. Stats will appear here automatically.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Failed to load stats
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Result Display (for evaluate/cover-letter/interview tabs) */}
        {result && (activeTab === "evaluate" || activeTab === "cover-letter" || activeTab === "interview") && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Result
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Error
                    </>
                  )}
                </CardTitle>
                {result.success && result.model && (
                  <div className="flex items-center gap-2">
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
                      onClick={() => handleCopy(result.evaluation || "")}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadResult}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      .md
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {result.success && result.evaluation ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <MarkdownRenderer content={result.evaluation} />
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

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            Built with Next.js 16 + OpenRouter AI + Neon PostgreSQL · Deployed on Vercel
          </p>
          <p className="mt-1">
            © 2026 Febri Rizki · UI/UX Designer &amp; AI Engineer ·{" "}
            <a
              href="https://github.com/hyperchainpro/career-ops-web"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

// Simple markdown renderer
function MarkdownRenderer({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto my-4"
            >
              <code className="text-sm">{codeContent.join("\n")}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={idx}
            className="text-lg font-bold mt-6 mb-2 text-slate-900 dark:text-white"
          >
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={idx}
            className="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-white border-b pb-1"
          >
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={idx}
            className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white"
          >
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={idx} className="ml-6 list-disc text-slate-700 dark:text-slate-300">
            {renderInlineFormat(line.slice(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={idx} className="ml-6 list-decimal text-slate-700 dark:text-slate-300">
            {renderInlineFormat(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      } else if (line.startsWith("---")) {
        elements.push(
          <hr key={idx} className="my-4 border-slate-200 dark:border-slate-700" />
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

    return elements;
  };

  const renderInlineFormat = (text: string): React.ReactNode => {
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
  };

  return <div className="space-y-1">{renderMarkdown(content)}</div>;
}
