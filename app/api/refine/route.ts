// app/api/refine/route.ts

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import KIDZSMART_VOICE_SYSTEM from "@/lib/prompts/kidzsmart-voice";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { originalPost, additionalNotes, platform, brand, tone } =
      await request.json();

    if (!originalPost || !additionalNotes || !platform) {
      return NextResponse.json(
        {
          error: "Original post, additional notes, and platform required",
        },
        { status: 400 }
      );
    }

    const refinementPrompt = `You are refining a social media post for Kidzsmart Communications.

ORIGINAL POST:
${originalPost}

USER FEEDBACK/NOTES:
${additionalNotes}

PLATFORM: ${platform}
BRAND: ${brand}
TONE: ${tone || "Authentic"}

Based on the user's notes, refine the post while maintaining the Kidzsmart voice (simple, conversational, peer-to-peer, authentic).

Return your response as JSON:
{
  "refined_copy": "The refined post copy",
  "changes_made": "Brief explanation of what changed and why"
}

The refined post should:
- Address the user's feedback
- Stay true to Kidzsmart voice
- Be appropriate for ${platform}
- Feel natural and conversational`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      system: KIDZSMART_VOICE_SYSTEM,
      messages: [
        {
          role: "user",
          content: refinementPrompt,
        },
      ],
    });

    // Extract and parse the response
    let refinedData = {
      refined_copy: originalPost,
      changes_made: "No changes",
    };
    let textContent = "";

    for (const block of response.content) {
      if (block.type === "text") {
        textContent = block.text;
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          refinedData = JSON.parse(jsonMatch[0]);
        }
      }
    }

    return NextResponse.json(refinedData);
  } catch (error) {
    console.error("Refinement error:", error);
    return NextResponse.json(
      {
        error: "Failed to refine post",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
