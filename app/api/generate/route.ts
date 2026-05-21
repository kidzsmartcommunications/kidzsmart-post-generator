import { Anthropic } from "@anthropic-ai/sdk";
import { getGenerationPrompt } from "@/lib/prompts/generation-prompt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      brandName,
      eventSubject,
      sampleCopy,
      primaryChannel,
      contentType = "Social Post",
      tone,
      hashtags,
      additionalNotes,
      researchSummary,
    } = body;

    if (!brandName || !eventSubject || !researchSummary) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const client = new Anthropic();
    const userPrompt = getGenerationPrompt(
      brandName,
      contentType,
      primaryChannel,
      tone,
      researchSummary,
      sampleCopy,
      hashtags,
      additionalNotes
    );

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2000,
      system: "You are Kidzsmart Communications, a premium kids & family marketing agency. You are strategic, expert, peer-to-peer, emotionally intelligent, and human. Never corporate jargon. Generate authentic content.",
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const generatedPosts = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(generatedPosts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}
