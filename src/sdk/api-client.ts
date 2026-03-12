import type { ConsolidatedVideoConfig } from "../UpdateVideo/types";

/**
 * Lightweight client for the Update Video API.
 * Used by the SDK hooks to fetch video configs and mark updates as seen.
 */
export class UpdateVideoClient {
  constructor(private baseUrl: string) {}

  async getVideoConfig(
    projectId: string,
    userId: string,
    projectName?: string,
    projectLogo?: string,
  ): Promise<ConsolidatedVideoConfig | null> {
    const params = new URLSearchParams({ userId });
    if (projectName) params.set("projectName", projectName);
    if (projectLogo) params.set("projectLogo", projectLogo);

    const res = await fetch(
      `${this.baseUrl}/api/updates/${encodeURIComponent(projectId)}/video-config?${params}`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch video config: ${res.status}`);
    }

    const data = await res.json();
    return data ?? null;
  }

  async markSeen(
    projectId: string,
    userId: string,
    deployId?: string,
  ): Promise<void> {
    const res = await fetch(
      `${this.baseUrl}/api/updates/${encodeURIComponent(projectId)}/seen`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, deployId }),
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to mark seen: ${res.status}`);
    }
  }
}
