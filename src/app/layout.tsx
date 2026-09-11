import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Ops AI · Febri Rizki — Job Evaluation System",
  description:
    "AI-powered job evaluation system for Febri Rizki (UI/UX Designer & AI Engineer). Evaluate job matches, generate cover letters, and prepare for interviews using OpenRouter AI.",
  keywords: [
    "Febri Rizki",
    "UI/UX Designer",
    "AI Engineer",
    "Job Evaluation",
    "Career Ops",
    "OpenRouter",
    "AI Job Search",
  ],
  authors: [{ name: "Febri Rizki" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Career Ops AI · Febri Rizki",
    description:
      "AI-powered job evaluation system using OpenRouter",
    url: "https://febri-career-ops.vercel.app",
    siteName: "Career Ops AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Ops AI · Febri Rizki",
    description: "AI-powered job evaluation system using OpenRouter",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
