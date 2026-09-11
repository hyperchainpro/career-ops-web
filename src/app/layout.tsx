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
  title: "Job4You — AI-Powered Remote Job Search Platform + ATS Resume Checker",
  description:
    "Find remote jobs worldwide. AI-powered job scanner (80+ companies), ATS resume checker, cover letter generator, interview prep, and application tracker. Free for all job seekers.",
  keywords: [
    "Job4You",
    "remote jobs",
    "ATS resume checker",
    "AI job search",
    "job scanner",
    "cover letter generator",
    "interview prep",
    "application tracker",
    "remote work",
    "job board",
  ],
  authors: [{ name: "Febri Rizki" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Job4You — AI-Powered Remote Job Search Platform",
    description:
      "Find remote jobs worldwide with AI. ATS resume checker, cover letter generator, interview prep, and application tracker.",
    url: "https://job4you.vercel.app",
    siteName: "Job4You",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job4You — AI-Powered Remote Job Search",
    description: "Find remote jobs worldwide with AI. ATS checker + cover letter + interview prep.",
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
