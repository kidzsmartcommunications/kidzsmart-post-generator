import { Anthropic } from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandName, eventSubject, sampleCopy, additionalNotes } = body;

    if (!brandName || !eventSubject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const client = new Anthropic();

    const userPrompt = `You are a strategic research analyst for kids & family marketing.

Research ${brandName} for this event: ${eventSubject}
${sampleCopy ? `Reference: ${sampleCopy}` : ""}
${additionalNotes ? `Notes: ${additionalNotes}` : ""}

Generate JSON response with:
1. research_summary (200 words about the brand/event context)
2. potential_hooks (array of 3-4 hooks with: hook_type, hook_name, description, example_angle)
3. context_for_posts (150 words on why this matters for kids/families)

Format: { "brand_name": "${brandName}", "research_summary": "...", "potential_hooks": [...], "context_for_posts": "..." }`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      system: "You are a strategic kids & family marketing expert. Provide research insights in valid JSON format only.",
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const researchData = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(researchData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Research error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500 }
    );
  }
}
