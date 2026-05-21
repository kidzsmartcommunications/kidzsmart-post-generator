// lib/types.ts

export interface FormInputs {
  brandName: string;
  eventSubject: string;
  sampleCopy?: string;
  primaryChannel: "LinkedIn" | "Instagram" | "TikTok" | "Twitter" | "Multi";
  secondaryChannels?: ("LinkedIn" | "Instagram" | "TikTok" | "Twitter")[];
  contentType?: "Social Post" | "Email" | "Blog Article" | "LinkedIn Article";
  tone?: "Strategic" | "Celebratory" | "Playful" | "Authentic" | "Thought Leadership";
  hashtags?: string;
  additionalNotes?: string;
}

export interface ResearchData {
  brand_name: string;
  research_summary: string;
  potential_hooks: Hook[];
  context_for_posts: string;
}

export interface Hook {
  hook_type: string;
  hook_name: string;
  description: string;
  example_angle: string;
}

export interface PostVariation {
  position: number;
  post_copy: string;
  hook_used: string;
  why_it_works: string;
  platform_notes: string;
  kidzsmart_angle?: string;
}

export interface GeneratedPosts {
  variations: PostVariation[];
}

export interface RefinementRequest {
  originalPost: string;
  additionalNotes: string;
  platform: string;
  brand: string;
  contentType?: string;
  tone?: string;
}

export interface RefinedPost {
  refined_copy: string;
  changes_made: string;
}
