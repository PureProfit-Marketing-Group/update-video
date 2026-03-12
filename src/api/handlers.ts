import type { UpdateStore, UserStateStore } from "../store/types";
import type { UpdateRecord } from "../consolidation/types";
import type { ConsolidatedVideoConfig } from "../UpdateVideo/types";
import { consolidate } from "../consolidation/engine";

// --- Request / Response types ---

export interface IngestRequest {
  updates: Array<UpdateRecord & { createdAt: string }>;
}

export interface VideoConfigRequest {
  projectId: string;
  userId: string;
  projectName?: string;
  projectLogo?: string;
}

export interface MarkSeenRequest {
  projectId: string;
  userId: string;
  deployId?: string;
}

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

// --- Handlers ---

/**
 * POST /api/updates/ingest
 * Accept capture results from the CI/CD pipeline.
 */
export async function handleIngest(
  store: UpdateStore,
  req: IngestRequest,
): Promise<ApiResponse> {
  if (!req.updates || !Array.isArray(req.updates)) {
    return { status: 400, body: { error: "updates array required" } };
  }

  const updates: UpdateRecord[] = req.updates.map((u) => ({
    ...u,
    createdAt: new Date(u.createdAt),
  }));

  await store.ingest(updates);
  return { status: 200, body: { ingested: updates.length } };
}

/**
 * GET /api/updates/:projectId
 * List all updates for a project.
 */
export async function handleListUpdates(
  store: UpdateStore,
  projectId: string,
): Promise<ApiResponse<UpdateRecord[]>> {
  const updates = await store.getByProject(projectId);
  return { status: 200, body: updates };
}

/**
 * GET /api/updates/:projectId/video-config?userId=X
 * The main endpoint — returns a consolidated video config for the user.
 *
 * Flow:
 * 1. Get user's last-seen state
 * 2. Fetch all unseen updates
 * 3. Run consolidation engine
 * 4. Return ConsolidatedVideoConfig (or null if nothing new)
 */
export async function handleVideoConfig(
  updateStore: UpdateStore,
  userStateStore: UserStateStore,
  req: VideoConfigRequest,
): Promise<ApiResponse<ConsolidatedVideoConfig | null>> {
  const { projectId, userId, projectName, projectLogo } = req;

  if (!projectId || !userId) {
    return { status: 400, body: null };
  }

  // Get user's last-seen state
  const userState = await userStateStore.get(userId, projectId);

  // Fetch unseen updates
  let updates: UpdateRecord[];
  if (userState) {
    updates = await updateStore.getUnseen(
      projectId,
      userState.lastSeenDeployId,
    );
  } else {
    // First-time user — show all updates
    updates = await updateStore.getByProject(projectId);
  }

  if (updates.length === 0) {
    return { status: 200, body: null };
  }

  // Run the consolidation engine
  const config = consolidate({
    projectName: projectName ?? projectId,
    projectLogo,
    updates,
  });

  return { status: 200, body: config };
}

/**
 * POST /api/updates/:projectId/seen
 * Mark updates as seen for a user.
 */
export async function handleMarkSeen(
  updateStore: UpdateStore,
  userStateStore: UserStateStore,
  req: MarkSeenRequest,
): Promise<ApiResponse> {
  const { projectId, userId, deployId } = req;

  if (!projectId || !userId) {
    return { status: 400, body: { error: "projectId and userId required" } };
  }

  // Use provided deployId or find the latest
  const resolvedDeployId =
    deployId ?? (await updateStore.getLatestDeployId(projectId));

  if (!resolvedDeployId) {
    return { status: 404, body: { error: "No updates found for project" } };
  }

  await userStateStore.markSeen(userId, projectId, resolvedDeployId);
  return { status: 200, body: { marked: resolvedDeployId } };
}

/**
 * GET /api/projects
 * List all projects that have updates.
 */
export async function handleListProjects(
  store: UpdateStore,
): Promise<ApiResponse<string[]>> {
  const projects = await store.listProjects();
  return { status: 200, body: projects };
}
