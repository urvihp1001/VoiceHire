import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const FALLBACK_FEEDBACK = "Thank you for your responses. We'll get back to you soon.";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!conversation || typeof conversation !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid conversation", feedback: FALLBACK_FEEDBACK },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", conversation);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXTAUTH_URL,
        "X-Title": "Your App Name"
      }
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [{ role: "user", content: FINAL_PROMPT }]
    });

    let content = completion.choices?.[0]?.message?.content?.trim() || "";
    let feedback = "";

    try {
      // Try parsing as JSON
      const parsed = JSON.parse(content);
      if (typeof parsed === "string") {
        feedback = parsed;
      } else if (parsed?.feedback) {
        feedback = parsed.feedback;
      } else {
        feedback = JSON.stringify(parsed);
      }
    } catch {
      // Fallback to raw content
      feedback = content || FALLBACK_FEEDBACK;
    }

    return NextResponse.json({ feedback }, { status: 200 });

  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: e.message || "Internal Server Error", feedback: FALLBACK_FEEDBACK },
      { status: e.status || 500 }
    );
  }
}
