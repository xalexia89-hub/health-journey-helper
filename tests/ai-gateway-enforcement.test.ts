/**
 * AI Gateway Enforcement Tests
 * ----------------------------
 * Guarantees the architectural rule: every AI call MUST be routed through
 * the Lovable AI Gateway (https://ai.gateway.lovable.dev). No component,
 * hook, edge function, or shared library may call provider SDKs / endpoints
 * directly (Anthropic, OpenAI, Google GenAI, Mistral, Cohere, Together, etc.).
 *
 * If a new AI integration is added, it MUST go through the gateway —
 * otherwise this test fails and blocks the merge.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src", "supabase/functions"];
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".git",
  "tests",
  "__tests__",
]);
const EXTS = [".ts", ".tsx"];

const APPROVED_GATEWAY = "ai.gateway.lovable.dev";

/** Patterns that indicate a DIRECT call to a non-gateway AI provider. */
const FORBIDDEN_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: "Anthropic REST", regex: /api\.anthropic\.com/i },
  { name: "OpenAI REST", regex: /api\.openai\.com/i },
  { name: "Google Generative Language REST", regex: /generativelanguage\.googleapis\.com/i },
  { name: "Mistral REST", regex: /api\.mistral\.ai/i },
  { name: "Cohere REST", regex: /api\.cohere\.(ai|com)/i },
  { name: "Together AI REST", regex: /api\.together\.xyz/i },
  { name: "Groq REST", regex: /api\.groq\.com/i },
  { name: "Perplexity REST", regex: /api\.perplexity\.ai/i },
  { name: "Anthropic SDK import", regex: /from\s+["']@anthropic-ai\/sdk["']/ },
  { name: "OpenAI SDK import", regex: /from\s+["']openai["']/ },
  { name: "Google GenAI SDK import", regex: /from\s+["']@google\/(generative-ai|genai)["']/ },
  { name: "Mistral SDK import", regex: /from\s+["']@mistralai\/mistralai["']/ },
  { name: "Cohere SDK import", regex: /from\s+["']cohere-ai["']/ },
];

/** Files allowed to mention forbidden strings (e.g. tests, docs). */
const ALLOWLIST = new Set<string>([
  "tests/ai-gateway-enforcement.test.ts",
]);

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(full, out);
    else if (EXTS.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

function collectFiles(): string[] {
  const all: string[] = [];
  for (const d of SCAN_DIRS) walk(join(ROOT, d), all);
  return all;
}

const allFiles = collectFiles();

describe("AI Gateway enforcement", () => {
  it("project has files to scan", () => {
    expect(allFiles.length).toBeGreaterThan(0);
  });

  it("no source file calls a non-gateway AI provider directly", () => {
    const violations: string[] = [];
    for (const file of allFiles) {
      const rel = relative(ROOT, file).replace(/\\/g, "/");
      if (ALLOWLIST.has(rel)) continue;
      const src = readFileSync(file, "utf8");
      for (const { name, regex } of FORBIDDEN_PATTERNS) {
        if (regex.test(src)) {
          violations.push(`${rel} → ${name}`);
        }
      }
    }
    expect(
      violations,
      `Direct AI provider usage detected. All AI calls must go through ${APPROVED_GATEWAY}:\n` +
        violations.map((v) => `  - ${v}`).join("\n")
    ).toEqual([]);
  });

  it("every edge function that performs an AI completion uses the Lovable AI Gateway", () => {
    const fnDir = join(ROOT, "supabase/functions");
    const fnFiles = walk(fnDir).filter((f) => f.endsWith("/index.ts"));
    const offenders: string[] = [];

    for (const file of fnFiles) {
      const src = readFileSync(file, "utf8");
      // Heuristic: any chat/completions call
      const hasCompletionCall = /\/v1\/chat\/completions/.test(src) ||
        /chat\.completions\.create/.test(src);
      if (!hasCompletionCall) continue;

      const usesGateway = src.includes(APPROVED_GATEWAY);
      if (!usesGateway) {
        offenders.push(relative(ROOT, file).replace(/\\/g, "/"));
      }
    }

    expect(
      offenders,
      `These edge functions perform completions but do not target the Lovable AI Gateway:\n` +
        offenders.map((o) => `  - ${o}`).join("\n")
    ).toEqual([]);
  });

  it("every gateway call authenticates with LOVABLE_API_KEY", () => {
    const offenders: string[] = [];
    for (const file of allFiles) {
      const src = readFileSync(file, "utf8");
      if (!src.includes(APPROVED_GATEWAY)) continue;
      // The same file must reference the LOVABLE_API_KEY env var
      if (!/LOVABLE_API_KEY/.test(src)) {
        offenders.push(relative(ROOT, file).replace(/\\/g, "/"));
      }
    }
    expect(
      offenders,
      `These files call the gateway without using LOVABLE_API_KEY:\n` +
        offenders.map((o) => `  - ${o}`).join("\n")
    ).toEqual([]);
  });

  it("client code (src/**) never calls the AI gateway directly — only via supabase.functions.invoke", () => {
    const clientOffenders: string[] = [];
    for (const file of allFiles) {
      const rel = relative(ROOT, file).replace(/\\/g, "/");
      if (!rel.startsWith("src/")) continue;
      const src = readFileSync(file, "utf8");
      if (src.includes(APPROVED_GATEWAY)) {
        clientOffenders.push(rel);
      }
    }
    expect(
      clientOffenders,
      `Client code must never hit the AI gateway directly. Use supabase.functions.invoke():\n` +
        clientOffenders.map((o) => `  - ${o}`).join("\n")
    ).toEqual([]);
  });
});
