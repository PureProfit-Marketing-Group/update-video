import { createServer, type IncomingMessage } from "http";
import type { UpdateStore, UserStateStore } from "../store/types";
import { MemoryUpdateStore, MemoryUserStateStore } from "../store/memory-store";
import { FileUpdateStore, FileUserStateStore } from "../store/file-store";
import {
  handleIngest,
  handleListUpdates,
  handleVideoConfig,
  handleMarkSeen,
  handleListProjects,
} from "./handlers";

export interface ServerConfig {
  port?: number;
  /** "memory" for in-memory, or a directory path for file-based storage */
  storage?: "memory" | string;
  /** Optional API key for write endpoints */
  apiKey?: string;
}

/**
 * Create and start the Update Video API server.
 *
 * Usage:
 *   npx tsx src/api/server.ts
 *   npx tsx src/api/server.ts --port=4000 --storage=./.data
 */
export function createUpdateServer(config: ServerConfig = {}) {
  const port = config.port ?? 3123;

  let updateStore: UpdateStore;
  let userStateStore: UserStateStore;

  if (config.storage === "memory" || !config.storage) {
    updateStore = new MemoryUpdateStore();
    userStateStore = new MemoryUserStateStore();
  } else {
    updateStore = new FileUpdateStore(config.storage);
    userStateStore = new FileUserStateStore(config.storage);
  }

  const server = createServer(async (req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const result = await route(
        req,
        updateStore,
        userStateStore,
        config.apiKey,
      );
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.body));
    } catch (err) {
      console.error("[api] Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });

  server.listen(port, () => {
    console.log(`[api] Update Video API running on http://localhost:${port}`);
    console.log(`[api] Storage: ${config.storage || "memory"}`);
  });

  return server;
}

// --- Router ---

async function route(
  req: IncomingMessage,
  updateStore: UpdateStore,
  userStateStore: UserStateStore,
  apiKey?: string,
) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method ?? "GET";

  // POST /api/updates/ingest
  if (method === "POST" && path === "/api/updates/ingest") {
    if (apiKey && !checkApiKey(req, apiKey)) {
      return { status: 401, body: { error: "Unauthorized" } };
    }
    const body = await readBody(req);
    return handleIngest(updateStore, body as { updates: Array<import("../consolidation/types").UpdateRecord & { createdAt: string }> });
  }

  // GET /api/projects
  if (method === "GET" && path === "/api/projects") {
    return handleListProjects(updateStore);
  }

  // Route: /api/updates/:projectId/...
  const updateMatch = path.match(/^\/api\/updates\/([^/]+)(\/.*)?$/);
  if (updateMatch) {
    const projectId = decodeURIComponent(updateMatch[1]);
    const subPath = updateMatch[2] ?? "";

    // GET /api/updates/:projectId/video-config?userId=X
    if (method === "GET" && subPath === "/video-config") {
      const userId = url.searchParams.get("userId");
      if (!userId) {
        return { status: 400, body: { error: "userId query param required" } };
      }
      return handleVideoConfig(updateStore, userStateStore, {
        projectId,
        userId,
        projectName: url.searchParams.get("projectName") ?? undefined,
        projectLogo: url.searchParams.get("projectLogo") ?? undefined,
      });
    }

    // POST /api/updates/:projectId/seen
    if (method === "POST" && subPath === "/seen") {
      const body = await readBody(req);
      return handleMarkSeen(updateStore, userStateStore, {
        projectId,
        userId: body.userId as string,
        deployId: body.deployId as string | undefined,
      });
    }

    // GET /api/updates/:projectId
    if (method === "GET" && !subPath) {
      return handleListUpdates(updateStore, projectId);
    }
  }

  return { status: 404, body: { error: "Not found" } };
}

// --- Utilities ---

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const text = Buffer.concat(chunks).toString("utf-8");
        resolve(text ? JSON.parse(text) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function checkApiKey(req: IncomingMessage, expected: string): boolean {
  const auth = req.headers.authorization;
  return auth === `Bearer ${expected}`;
}

// --- CLI entry point ---

const isDirectRun = process.argv[1]?.includes("api/server") ?? false;
if (isDirectRun) {
  const args = process.argv.slice(2);
  const getArg = (name: string) =>
    args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];

  createUpdateServer({
    port: parseInt(getArg("port") ?? "3123", 10),
    storage: getArg("storage") ?? "memory",
    apiKey: getArg("api-key"),
  });
}
