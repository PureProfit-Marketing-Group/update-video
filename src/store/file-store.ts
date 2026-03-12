import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { UpdateRecord } from "../consolidation/types";
import type { UpdateStore, UserState, UserStateStore } from "./types";

type SerializedUserState = Omit<UserState, "lastSeenAt"> & {
  lastSeenAt: string;
};

/**
 * JSON file-based store for simple deployments.
 * Stores data as JSON files in a directory.
 *
 * Structure:
 *   <dataDir>/updates.json   — All update records
 *   <dataDir>/user-state.json — User seen-state tracking
 */
export class FileUpdateStore implements UpdateStore {
  private filePath: string;

  constructor(dataDir: string) {
    mkdirSync(dataDir, { recursive: true });
    this.filePath = join(dataDir, "updates.json");
  }

  private read(): UpdateRecord[] {
    if (!existsSync(this.filePath)) return [];
    const raw = readFileSync(this.filePath, "utf-8");
    const parsed = JSON.parse(raw) as Array<UpdateRecord & { createdAt: string }>;
    return parsed.map((u) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }));
  }

  private write(updates: UpdateRecord[]): void {
    writeFileSync(this.filePath, JSON.stringify(updates, null, 2));
  }

  async ingest(updates: UpdateRecord[]): Promise<void> {
    const existing = this.read();
    const existingIds = new Set(existing.map((u) => u.id));
    const newUpdates = updates.filter((u) => !existingIds.has(u.id));
    this.write([...existing, ...newUpdates]);
  }

  async getByProject(projectId: string): Promise<UpdateRecord[]> {
    return this.read()
      .filter((u) => u.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnseen(
    projectId: string,
    sinceDeployId: string,
  ): Promise<UpdateRecord[]> {
    const all = await this.getByProject(projectId);
    const seenIndex = all.findIndex((u) => u.deployId === sinceDeployId);
    if (seenIndex === -1) return all;
    return all.slice(0, seenIndex);
  }

  async getById(id: string): Promise<UpdateRecord | null> {
    return this.read().find((u) => u.id === id) ?? null;
  }

  async listProjects(): Promise<string[]> {
    return [...new Set(this.read().map((u) => u.projectId))];
  }

  async getLatestDeployId(projectId: string): Promise<string | null> {
    const updates = await this.getByProject(projectId);
    return updates[0]?.deployId ?? null;
  }
}

export class FileUserStateStore implements UserStateStore {
  private filePath: string;

  constructor(dataDir: string) {
    mkdirSync(dataDir, { recursive: true });
    this.filePath = join(dataDir, "user-state.json");
  }

  private read(): Record<string, SerializedUserState> {
    if (!existsSync(this.filePath)) return {};
    return JSON.parse(readFileSync(this.filePath, "utf-8"));
  }

  private writeAll(states: Record<string, SerializedUserState>): void {
    writeFileSync(this.filePath, JSON.stringify(states, null, 2));
  }

  private key(userId: string, projectId: string): string {
    return `${userId}:${projectId}`;
  }

  async get(userId: string, projectId: string): Promise<UserState | null> {
    const states = this.read();
    const entry = states[this.key(userId, projectId)];
    if (!entry) return null;
    return { ...entry, lastSeenAt: new Date(entry.lastSeenAt) };
  }

  async markSeen(
    userId: string,
    projectId: string,
    deployId: string,
  ): Promise<void> {
    const states = this.read();
    states[this.key(userId, projectId)] = {
      userId,
      projectId,
      lastSeenDeployId: deployId,
      lastSeenAt: new Date().toISOString(),
    };
    this.writeAll(states);
  }
}
