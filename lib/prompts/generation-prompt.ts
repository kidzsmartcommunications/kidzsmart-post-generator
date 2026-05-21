export function getGenerationPrompt(
  brand: string,
  contentType: string = "Social Post",
  channel: string,
  tone: string,
  researchSummary: string,
  sampleCopy?: string,
  hashtags?: string,
  additionalNotes?: string
): string {
  const contentTypeInstructions = getContentTypeInstructions(contentType, channel);

  return `You are generating ${contentType}s for ${brand} in the Kidzsmart voice.

CONTEXT:
- Brand: ${brand}
- Content Type: ${contentType}
- Channel: ${channel}
- Tone: ${tone}
${sampleCopy ? `- Sample: ${sampleCopy}` : ""}
${additionalNotes ? `- Notes: ${additionalNotes}` : ""}

RESEARCH:
${researchSummary}

CONTENT TYPE REQUIREMENTS:
${contentTypeInstructions}

HASHTAGS:
${hashtags || "3-5 relevant hashtags if appropriate for platform"}

TASK: Generate 2-3 variations that feel authentic to Kidzsmart (strategic, expert, peer-to-peer, emotionally intelligent).

RESPONSE FORMAT (JSON ONLY):
{
  "variations": [
    {
      "position": 1,
      "post_copy": "Full content here",
      "hook_used": "Hook name",
      "why_it_works": "Why this works",
      "platform_notes": "Platform tips",
      "kidzsmart_angle": "This reinforces our positioning as..."
    }
  ]
}`;
}

function getContentTypeInstructions(contentType: string, channel: string): string {
  switch (contentType) {
    case "Social Post":
      return "150-250 words, platform-optimized, conversational tone, relevant hashtags.";
    case "Email":
      return "Subject line, preview text, 200-400 word body, clear CTA.";
    case "Blog Article":
      return "800-1200 words, SEO-friendly headline, 3-4 subheadings, clear next steps.";
    case "LinkedIn Article":
      return "1000-1500 words, thought leadership tone, expert perspective, call to conversation.";
    default:
      return "Flexible content optimized for the specified platform.";
  }
}
