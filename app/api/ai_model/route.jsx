import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Fallback questions in case AI response is invalid
const FALLBACK_QUESTIONS = [
  "Tell us about your experience for this role.",
  "What are your key strengths?",
  "Describe a challenge you overcame in your last job."
];

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    // Validate required fields
    if (!jobPosition || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields", questions: FALLBACK_QUESTIONS },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace('{{jobTitle}}', jobPosition)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{duration}}', duration)
      .replace('{{type}}', type);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXTAUTH_URL,
        "X-Title": "Your App Name"
      }
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-prover-v2:free",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      response_format: { type: "json_object" }
    });

    let content = completion.choices?.[0]?.message?.content || "";
    let questions = [];

    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else if (parsed && Array.isArray(parsed.questions)) {
        questions = parsed.questions;
      } else if (typeof parsed === "string") {
        questions = [parsed];
      } else {
        questions = [JSON.stringify(parsed)];
      }
    } catch {
      // Fallback: extract bullet/numbered lines from Markdown or plain text
      const lines = content.split('\n');
      const extracted = lines
        .map(line => line.trim())
        .filter(line => /^(\d+\.|-|\*)\s+/.test(line))
        .map(line => line.replace(/^(\d+\.|-|\*)\s+/, ''));
      if (extracted.length > 0) {
        questions = extracted;
      } else if (content) {
        questions = [content];
      } else {
        questions = FALLBACK_QUESTIONS;
      }
    }

    return NextResponse.json({ questions }, { status: 200 });

  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: e.message || "Internal Server Error", questions: FALLBACK_QUESTIONS },
      { status: e.status || 500 }
    );
  }
}
