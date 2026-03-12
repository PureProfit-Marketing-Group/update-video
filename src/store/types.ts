import type { UpdateRecord } from "../consolidation/types";

// --- User state tracking ---

export interface UserState {
  userId: string;
  projectId: string;
  /** The deploy ID the user has seen up to */
  lastSeenDeployId: string;
  lastSeenAt: Date;
}

// --- Store interfaces ---

export interface UpdateStore {
  /** Insert updates from a capture pipeline run */
  ingest(updates: UpdateRecord[]): Promise<void>;

  /** Get all updates for a project */
  getByProject(projectId: string): Promise<UpdateRecord[]>;

  /** Get updates created after a specific deploy */
  getUnseen(projectId: string, sinceDeployId: string): Promise<UpdateRecord[]>;

  /** Get a single update by ID */
  getById(id: string): Promise<UpdateRecord | null>;

  /** List distinct project IDs */
  listProjects(): Promise<string[]>;

  /** Get the latest deploy ID for a project */
  getLatestDeployId(projectId: string): Promise<string | null>;
}

export interface UserStateStore {
  /** Get the user's state for a project */
  get(userId: string, projectId: string): Promise<UserState | null>;

  /** Mark updates as seen — sets lastSeenDeployId to the latest */
  markSeen(userId: string, projectId: string, deployId: string): Promise<void>;
}
