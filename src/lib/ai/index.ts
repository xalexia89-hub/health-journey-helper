/**
 * Single import surface for the Medithos AI layer.
 *
 * Usage:
 *   import { aiGateway, runAgentLoop, retrieveRelevantMemories } from "@/lib/ai";
 *
 * NEVER import provider SDKs anywhere in the app — always go through aiGateway.
 */
export * from "./types";
export { aiGateway, MODEL_ROUTER, TASK_MODEL_MAP, resolveModel } from "./gateway";
export {
  retrieveRelevantMemories,
  storeMemory,
  listRecentMemories,
} from "./memory";
export { runAgentLoop, type AgentLoopResult } from "./agent-loop";
export {
  createPendingAction,
  approveAction,
  rejectAction,
  listPendingForUser,
} from "./approval";
export { orchestrate } from "./orchestrator";
