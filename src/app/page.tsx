"use client";

import { useState, useCallback } from "react";
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
} from "lucide-react";

type EvalResult = {
  success: boolean;
  model?: string;
  evaluation?: string;
  error?: string;
  tokensUsed?: number;
};

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [activeTab, setActiveTab] = useState("evaluate");

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

  const handleDownloadResult = useCallback(() => {
    if (!result?.evaluation) return;
    const blob = new Blob([result.evaluation], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ext = activeTab === "evaluate" ? "evaluation" : activeTab === "cover-letter" ? "cover-letter" : "interview-prep";
    a.download = `febri-${ext}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, activeTab]);

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
                  Powered by OpenRouter · For Febri Rizki
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <a
                href="https://github.com/febririzki95"
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

        {/* Main Tool */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="evaluate" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Evaluate Job</span>
              <span className="sm:hidden">Evaluate</span>
            </TabsTrigger>
            <TabsTrigger value="cover-letter" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Cover Letter</span>
              <span className="sm:hidden">Letter</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Interview Prep</span>
              <span className="sm:hidden">Interview</span>
            </TabsTrigger>
          </TabsList>

          {/* Evaluate Tab */}
          <TabsContent value="evaluate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Job Match Evaluation
                </CardTitle>
                <CardDescription>
                  Paste a job description below. AI will evaluate how well your
                  profile matches the role and provide tailored recommendations.
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
                    placeholder="Paste the full job description here. Include responsibilities, requirements, qualifications, and any other details from the job posting..."
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

          {/* Cover Letter Tab */}
          <TabsContent value="cover-letter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Generate Tailored Cover Letter
                </CardTitle>
                <CardDescription>
                  Generate a personalized cover letter for this specific job
                  application, highlighting your most relevant projects and
                  achievements.
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

          {/* Interview Prep Tab */}
          <TabsContent value="interview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-emerald-600" />
                  Interview Preparation
                </CardTitle>
                <CardDescription>
                  Generate likely interview questions (technical + behavioral)
                  based on the job description, with guidance on how to answer
                  using your actual experience.
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
        </Tabs>

        {/* Result Display */}
        {result && (
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
                      onClick={handleDownloadResult}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download .md
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {result.success && result.evaluation ? (
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-slate-100 prose-pre:text-slate-800 dark:prose-pre:bg-slate-900 dark:prose-pre:text-slate-200 prose-code:before:content-none prose-code:after:content-none">
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
            Built with Next.js 16 + OpenRouter AI · Deployed on Vercel
          </p>
          <p className="mt-1">
            © 2026 Febri Rizki · UI/UX Designer &amp; AI Engineer
          </p>
        </footer>
      </main>
    </div>
  );
}

// Simple markdown renderer (basic support)
function MarkdownRenderer({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    // Split into lines and process
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];

    lines.forEach((line, idx) => {
      // Code block fence
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

      // Headers
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
      }
      // Bullet list
      else if (line.startsWith("- ")) {
        const content = line.slice(2);
        elements.push(
          <li key={idx} className="ml-6 list-disc text-slate-700 dark:text-slate-300">
            {renderInlineFormat(content)}
          </li>
        );
      }
      // Numbered list
      else if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, "");
        elements.push(
          <li key={idx} className="ml-6 list-decimal text-slate-700 dark:text-slate-300">
            {renderInlineFormat(content)}
          </li>
        );
      }
      // Horizontal rule
      else if (line.startsWith("---")) {
        elements.push(<hr key={idx} className="my-4 border-slate-200 dark:border-slate-700" />);
      }
      // Empty line
      else if (line.trim() === "") {
        elements.push(<div key={idx} className="h-2" />);
      }
      // Normal paragraph
      else {
        elements.push(
          <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed my-1">
            {renderInlineFormat(line)}
          </p>
        );
      }
    });

    return elements;
  };

  // Render inline formatting (bold, italic, code, links)
  const renderInlineFormat = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/);
      // Link
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const matches = [
        boldMatch ? { type: "bold" as const, match: boldMatch, index: boldMatch.index! } : null,
        codeMatch ? { type: "code" as const, match: codeMatch, index: codeMatch.index! } : null,
        linkMatch ? { type: "link" as const, match: linkMatch, index: linkMatch.index! } : null,
      ].filter(Boolean) as Array<{ type: "bold" | "code" | "link"; match: RegExpMatchArray; index: number }>;

      if (matches.length === 0) {
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }

      matches.sort((a, b) => a.index - b.index);
      const first = matches[0];

      // Push text before match
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
