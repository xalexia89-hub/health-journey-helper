/**
 * Production-safe logger.
 * - In dev: forwards to console.* with original signatures
 * - In prod: silences debug/info/warn; preserves errors for diagnostics
 *
 * Use instead of raw console.* throughout the app.
 */

const isDev = import.meta.env.DEV;

type LogArgs = readonly unknown[];

export const logger = {
  debug: (...args: LogArgs): void => {
    if (isDev) console.debug(...args);
  },
  log: (...args: LogArgs): void => {
    if (isDev) console.log(...args);
  },
  info: (...args: LogArgs): void => {
    if (isDev) console.info(...args);
  },
  warn: (...args: LogArgs): void => {
    if (isDev) console.warn(...args);
  },
  /** Always emitted — production diagnostics. */
  error: (...args: LogArgs): void => {
    console.error(...args);
  },
};

/**
 * Narrow an `unknown` thrown value into a readable message.
 * Use in catch blocks instead of `error: any`.
 */
export function getErrorMessage(error: unknown, fallback = "Unknown error"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const m = (error as { message: unknown }).message;
    if (typeof m === "string") return m;
  }
  return fallback;
}
