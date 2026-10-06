/**
 * `npm run doctor` — storefront configuration preflight.
 *
 * The single most common support question for a self-hosted storefront is "the
 * products load but checkout doesn't" or "it says Not allowed by CORS". Both
 * are configuration, not code, and both are invisible until a customer tries
 * to pay. This turns them into an obvious message before the first sale.
 *
 * Reads .env.local, then .env, the same way Next.js does at build time.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const checks = [];
const record = (level, label, detail) => checks.push({ level, label, detail });

const load = (file) => {
  const full = path.resolve(process.cwd(), file);

  if (!existsSync(full)) return {};

  const env = {};

  for (const line of readFileSync(full, "utf8").split("\n")) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);

    if (match) env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }

  return env;
};

// Merge in precedence order: .env.local wins, then .env, then the real process
// environment (which is what actually applies during `next build`).
const fileEnv = { ...load(".env"), ...load(".env.local") };
const env = (key) => process.env[key] ?? fileEnv[key];

const isProd = process.env.NODE_ENV === "production";

if (!existsSync(path.resolve(process.cwd(), ".env.local")) &&
    !existsSync(path.resolve(process.cwd(), ".env"))) {
  record("fail", "Environment file", "missing — copy it: cp .env.example .env.local");
}

// ── API ─────────────────────────────────────────────────────────────────────

const baseApi = env("NEXT_PUBLIC_BASE_API");

if (!baseApi) {
  record(
    "fail",
    "NEXT_PUBLIC_BASE_API",
    "not set — the shop cannot load products, save carts or take orders"
  );
} else if (!/^https?:\/\/.+\/api\/v1\/?$/.test(baseApi)) {
  record(
    "fail",
    "NEXT_PUBLIC_BASE_API",
    `"${baseApi}" does not look like an API root — expected http(s)://host/api/v1`
  );
} else if (baseApi.startsWith("http://") && baseApi.includes("localhost") === false && isProd) {
  record("fail", "NEXT_PUBLIC_BASE_API", "plain http:// on a non-local host — use https://");
} else {
  record("ok", `NEXT_PUBLIC_BASE_API (${baseApi})`);
}

// ── Public origin ───────────────────────────────────────────────────────────

const siteUrl = env("NEXT_PUBLIC_SITE_URL");

if (!siteUrl) {
  record(
    isProd ? "warn" : "warn",
    "NEXT_PUBLIC_SITE_URL",
    "not set — social previews and reset links fall back to inferred URLs"
  );
} else if (siteUrl.startsWith("http://") && isProd) {
  record("fail", "NEXT_PUBLIC_SITE_URL", "plain http:// in production — use https://");
} else {
  record("ok", `NEXT_PUBLIC_SITE_URL (${siteUrl})`);
}

// ── Guard against shipping the demo build ───────────────────────────────────

const demoHosts = ["x-mart-client.vercel.app", "x-mart-backend.vercel.app"];
const hits = demoHosts.filter((host) => (baseApi ?? "").includes(host));

if (hits.length) {
  record(
    "fail",
    "Demo deployment reference",
    `still pointing at ${hits.join(", ")} — customers' orders would be saved into the demo database`
  );
}

// ── Build configuration ─────────────────────────────────────────────────────

const nextConfig = path.resolve(process.cwd(), "next.config.js");

if (existsSync(nextConfig)) {
  const source = readFileSync(nextConfig, "utf8");

  if (/ignoreBuildErrors\s*:\s*true/.test(source)) {
    record(
      "fail",
      "next.config.js",
      "typescript.ignoreBuildErrors is true — type errors ship silently; set it to false"
    );
  }

  if (/output\s*:\s*["']standalone["']/.test(source)) {
    record("ok", "next.config.js (standalone output — slim Docker image)");
  } else {
    record("warn", "next.config.js", "no `output: \"standalone\"` — needed for a small Docker image");
  }
}

// ── Report ──────────────────────────────────────────────────────────────────

const ICON = { ok: "  ok  ", warn: " warn ", fail: " FAIL " };

console.log("\n  X-Mart storefront — configuration check\n");

for (const check of checks) {
  console.log(`  [${ICON[check.level]}] ${check.label}${check.detail ? ` — ${check.detail}` : ""}`);
}
console.log("");

const failures = checks.filter((c) => c.level === "fail");
const warnings = checks.filter((c) => c.level === "warn");

if (failures.length) {
  console.log(`  ${failures.length} blocking problem(s). Fix the FAIL lines, then re-run.\n`);
  process.exit(1);
}

console.log(
  warnings.length
    ? `  ${warnings.length} warning(s) — review before going live.\n`
    : "  Configuration looks good.\n"
);

console.log("  Next: npm run dev\n");