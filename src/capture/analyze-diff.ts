import Anthropic from "@anthropic-ai/sdk";
import type { UpdateRecord } from "../consolidation/types";
import type { DiffSummary } from "./types";
import { buildAnalysisPrompt } from "./prompt";

interface AnalysisResult {
  category: UpdateRecord["category"];
  priority: UpdateRecord["priority"];
  featureArea: string;
  affectedComponents: string[];
  title: string;
  description: string;
  suggestedRoutes?: string[];
}

/**
 * Send a git diff to Claude for analysis.
 * Returns structured UpdateRecord[] and any suggested screenshot routes.
 */
export async function analyzeDiff(
  diff: DiffSummary,
  options: {
    projectId: string;
    deployId?: string;
    apiKey?: string;
  },
): Promise<{
  updates: UpdateRecord[];
  suggestedRoutes: string[];
}> {
  const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Anthropic API key required. Set ANTHROPIC_API_KEY env var or pass apiKey option.",
    );
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildAnalysisPrompt(diff);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const parsed = parseAnalysisResponse(text);
  const deployId = options.deployId ?? diff.toRef.slice(0, 8);

  const updates: UpdateRecord[] = parsed.map((item, index) => ({
    id: `${deployId}-${index}`,
    projectId: options.projectId,
    deployId,
    createdAt: new Date(),
    category: item.category,
    priority: item.priority,
    featureArea: item.featureArea,
    affectedComponents: item.affectedComponents,
    title: item.title,
    description: item.description,
  }));

  const suggestedRoutes = [
    ...new Set(parsed.flatMap((item) => item.suggestedRoutes ?? [])),
  ];

  return { updates, suggestedRoutes };
}

/**
 * Parse the JSON array from Claude's response.
 * Handles edge cases like markdown fences or extra text.
 */
function parseAnalysisResponse(text: string): AnalysisResult[] {
  // Strip markdown fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  // Find the JSON array
  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  try {
    const parsed = JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1));
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item: Record<string, unknown>) =>
        item.category && item.title && item.description,
    );
  } catch {
    console.error("Failed to parse Claude response as JSON:", text.slice(0, 200));
    return [];
  }
}
