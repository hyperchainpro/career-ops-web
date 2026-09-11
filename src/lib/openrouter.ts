// OpenRouter API integration for AI-powered job evaluation
// Uses free models with automatic fallback

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

// Free models priority - OpenRouter free tier models (updated 2026)
const FREE_MODELS_PRIORITY = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "thinkingmachines/inkling:free",
  "nex-agi/nex-n2.5-pro:free",
  "inclusionai/ling-3.0-flash-vl:free",
  "nvidia/nemotron-3.5-lightning:free",
  "poolside/laguna-s-2.1:free",
  "cohere/north-mini-code:free",
];

export interface OpenRouterModel {
  id: string;
  name: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

export interface EvaluationResult {
  success: boolean;
  model?: string;
  evaluation?: string;
  error?: string;
  tokensUsed?: number;
}

/**
 * Get available free models from OpenRouter
 */
export async function getAvailableFreeModels(): Promise<OpenRouterModel[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(OPENROUTER_MODELS_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://febri-career-ops.vercel.app",
        "X-Title": "Febri Career Ops",
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.data || [])
      .filter((m: any) => m.id.endsWith(":free"))
      .map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        context_length: m.context_length,
        pricing: m.pricing,
      }));
  } catch {
    return [];
  }
}

/**
 * Call OpenRouter API with automatic model fallback
 */
async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  modelId?: string
): Promise<EvaluationResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "OPENROUTER_API_KEY environment variable is not set",
    };
  }

  const modelsToTry = modelId
    ? [modelId]
    : [...FREE_MODELS_PRIORITY];

  for (const model of modelsToTry) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://febri-career-ops.vercel.app",
          "X-Title": "Febri Career Ops",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 8192,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Model ${model} failed:`, response.status, errorText);
        continue;
      }

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        console.error(`Model ${model}: no choices returned`);
        continue;
      }

      const content = data.choices[0]?.message?.content;
      if (!content) {
        console.error(`Model ${model}: empty content`);
        continue;
      }

      return {
        success: true,
        model: model,
        evaluation: content,
        tokensUsed: data.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error(`Model ${model} error:`, error);
      continue;
    }
  }

  return {
    success: false,
    error: "All models failed. Try again later or specify a different model.",
  };
}

/**
 * Build system prompt for job evaluation
 */
function buildEvaluationSystemPrompt(): string {
  return `You are an expert career advisor and senior technical recruiter with 15+ years of experience evaluating job applications for UI/UX Designer and AI Engineer roles.

Your task is to evaluate how well a candidate's profile matches a specific job description, providing actionable insights.

You MUST respond in clear markdown format with the following structure:

## 🎯 Role Match Assessment

**Overall Match Score:** X/10 (where 10 is perfect fit)

**Match Level:** [EXCELLENT / GOOD / FAIR / POOR]

## 📋 Job Requirements Analysis

Summarize the key requirements of the job:
- Required skills (must-have)
- Preferred skills (nice-to-have)
- Experience level
- Key responsibilities

## ✅ Candidate Strengths

List 3-5 specific strengths from the candidate's profile that align with the job requirements. Be specific — reference actual projects, achievements, or experience.

## ⚠️ Gaps & Concerns

List 2-4 areas where the candidate may fall short or could be questioned in interviews. Be honest but constructive.

## 💡 Tailoring Recommendations

Provide 3-5 specific recommendations for tailoring the CV/application for this job:
- Which projects to highlight
- Which skills to emphasize
- How to frame the Biology background
- What to add/remove from the CV

## 🎤 Interview Preparation

Suggest 3-5 likely interview questions based on the job requirements, and brief tips on how to answer them using the candidate's actual experience.

## 📝 Final Verdict

**Recommendation:** [APPLY / APPLY WITH CAUTION / SKIP]

One-paragraph summary explaining why the candidate should or should not apply, what their chances are, and what they should focus on if they apply.

---

Be specific, evidence-based, and actionable. Reference the candidate's actual projects and experience. Avoid generic advice.`;
}

/**
 * Build user prompt with candidate CV + job description
 */
function buildEvaluationUserPrompt(
  cvText: string,
  jobDescription: string,
  jobUrl?: string
): string {
  return `# Candidate Profile

${cvText}

---

# Job Description to Evaluate

${jobUrl ? `**Job URL:** ${jobUrl}\n\n` : ""}

${jobDescription}

---

Please evaluate this candidate's fit for the above job. Be thorough, specific, and actionable.`;
}

/**
 * Evaluate a job description against the candidate's profile
 */
export async function evaluateJob(
  cvText: string,
  jobDescription: string,
  jobUrl?: string,
  modelId?: string
): Promise<EvaluationResult> {
  const systemPrompt = buildEvaluationSystemPrompt();
  const userPrompt = buildEvaluationUserPrompt(cvText, jobDescription, jobUrl);

  return await callOpenRouter(systemPrompt, userPrompt, modelId);
}

/**
 * Generate a tailored cover letter for a specific job
 */
export async function generateCoverLetter(
  cvText: string,
  jobDescription: string,
  companyName?: string,
  modelId?: string
): Promise<EvaluationResult> {
  const systemPrompt = `You are an expert cover letter writer with 10+ years of experience helping candidates land jobs at top tech companies. You write compelling, specific, evidence-based cover letters that highlight the candidate's unique strengths for the role.

Write a professional cover letter in markdown format that:
1. Opens with a strong hook referencing the specific role and company
2. Highlights 2-3 most relevant achievements from the candidate's profile that match the job
3. Explains the candidate's unique value proposition (Biology→AI journey is a differentiator)
4. Shows enthusiasm for the specific company/role
5. Closes with a clear call to action
6. Maximum 350 words, professional but not stiff
7. Uses specific numbers, project names, and tech stack from the CV
8. Avoid generic phrases like "I am writing to apply for..."`;

  const userPrompt = `# Candidate Profile

${cvText}

---

# Job Description

${jobDescription}

${companyName ? `**Company:** ${companyName}\n` : ""}

---

Write a tailored cover letter for this job application. Reference specific projects, achievements, and skills from the candidate's profile that match the job requirements.`;

  return await callOpenRouter(systemPrompt, userPrompt, modelId);
}

/**
 * Generate interview preparation questions
 */
export async function generateInterviewQuestions(
  cvText: string,
  jobDescription: string,
  modelId?: string
): Promise<EvaluationResult> {
  const systemPrompt = `You are a senior technical interviewer with experience at FAANG companies and startups. Your task is to generate realistic interview questions based on the job description, then provide brief guidance on how the candidate should answer using their actual experience.

Respond in markdown format with:

## 🎤 Technical Questions (5)

For each question:
**Q1:** [Question]
**Why they ask:** [Brief explanation]
**How to answer (using your experience):** [Specific guidance referencing candidate's projects]

## 🧠 Behavioral Questions (3)

Same format as above.

## 🎯 Questions to Ask the Interviewer (3)

Suggest 3 smart questions the candidate should ask the interviewer at the end.`;

  const userPrompt = `# Candidate Profile

${cvText}

---

# Job Description

${jobDescription}

---

Generate interview preparation questions tailored to this role and the candidate's background.`;

  return await callOpenRouter(systemPrompt, userPrompt, modelId);
}
