import type { UpdateRecord } from "../consolidation/types";
import type { UpdateStore, UserState, UserStateStore } from "./types";

/**
 * In-memory store for development and testing.
 * Data is lost when the process exits.
 */
export class MemoryUpdateStore implements UpdateStore {
  private updates: UpdateRecord[] = [];

  async ingest(updates: UpdateRecord[]): Promise<void> {
    this.updates.push(...updates);
  }

  async getByProject(projectId: string): Promise<UpdateRecord[]> {
    return this.updates
      .filter((u) => u.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnseen(
    projectId: string,
    sinceDeployId: string,
  ): Promise<UpdateRecord[]> {
    const all = await this.getByProject(projectId);

    // Find the index of the last-seen deploy
    const seenIndex = all.findIndex((u) => u.deployId === sinceDeployId);

    // If we can't find it, return everything (user has never seen any updates)
    if (seenIndex === -1) return all;

    // Return only updates newer than the last-seen deploy
    // (all is sorted newest-first, so slice before the seen index)
    return all.slice(0, seenIndex);
  }

  async getById(id: string): Promise<UpdateRecord | null> {
    return this.updates.find((u) => u.id === id) ?? null;
  }

  async listProjects(): Promise<string[]> {
    return [...new Set(this.updates.map((u) => u.projectId))];
  }

  async getLatestDeployId(projectId: string): Promise<string | null> {
    const updates = await this.getByProject(projectId);
    return updates[0]?.deployId ?? null;
  }
}

export class MemoryUserStateStore implements UserStateStore {
  private states = new Map<string, UserState>();

  private key(userId: string, projectId: string): string {
    return `${userId}:${projectId}`;
  }

  async get(userId: string, projectId: string): Promise<UserState | null> {
    return this.states.get(this.key(userId, projectId)) ?? null;
  }

  async markSeen(
    userId: string,
    projectId: string,
    deployId: string,
  ): Promise<void> {
    this.states.set(this.key(userId, projectId), {
      userId,
      projectId,
      lastSeenDeployId: deployId,
      lastSeenAt: new Date(),
    });
  }
}
