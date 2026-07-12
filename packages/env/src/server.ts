import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Resolve this file's directory when available.
 * Next.js / Turbopack often leave `import.meta.dirname` undefined, so fall back.
 */
function getModuleDir(): string | undefined {
	try {
		if (typeof import.meta.dirname === "string" && import.meta.dirname) {
			return import.meta.dirname;
		}
		const url = import.meta.url;
		if (typeof url === "string" && url.startsWith("file:")) {
			return dirname(fileURLToPath(url));
		}
	} catch {
		// Bundlers may rewrite import.meta in ways that throw.
	}
	return undefined;
}

/**
 * Walk upward from `start` until we find a monorepo root marker.
 */
function findMonorepoRoot(start: string): string | undefined {
	let dir = start;
	for (let i = 0; i < 8; i++) {
		if (
			existsSync(resolve(dir, "turbo.json")) ||
			existsSync(resolve(dir, "bun.lock")) ||
			existsSync(resolve(dir, "package.json"))
		) {
			// Prefer a root that actually contains apps/server/.env
			if (existsSync(resolve(dir, "apps/server/.env"))) {
				return dir;
			}
			// package.json at apps/web is not monorepo root — keep walking
			if (
				existsSync(resolve(dir, "turbo.json")) ||
				existsSync(resolve(dir, "bun.lock"))
			) {
				return dir;
			}
		}
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return undefined;
}

/**
 * Load .env files from monorepo-aware locations.
 * cwd differs by process:
 *   - Next.js  → apps/web
 *   - Hono     → apps/server
 *   - db tools → packages/db
 * dotenv does not override vars already set in the process environment.
 *
 * NOTE: Do not rely solely on import.meta.dirname — Next/Turbopack may leave it undefined.
 */
function loadMonorepoEnv(): void {
	const cwd = process.cwd();
	const moduleDir = getModuleDir();
	const monorepoRoot =
		findMonorepoRoot(cwd) ??
		(moduleDir ? findMonorepoRoot(moduleDir) : undefined);

	const candidates = [
		// Local cwd first (app-specific overrides)
		resolve(cwd, ".env.local"),
		resolve(cwd, ".env"),
		// Relative to common app locations without import.meta
		resolve(cwd, "../server/.env"), // apps/web → apps/server
		resolve(cwd, "../web/.env"), // apps/server → apps/web
		resolve(cwd, "../../apps/server/.env"), // packages/* → apps/server
		resolve(cwd, "apps/server/.env"), // monorepo root
		resolve(cwd, "apps/web/.env"),
	];

	if (monorepoRoot) {
		candidates.push(
			resolve(monorepoRoot, "apps/server/.env"),
			resolve(monorepoRoot, "apps/web/.env"),
			resolve(monorepoRoot, ".env"),
		);
	}

	if (moduleDir) {
		// packages/env/src → repo root is ../../../
		candidates.push(
			resolve(moduleDir, "../../../apps/server/.env"),
			resolve(moduleDir, "../../../apps/web/.env"),
			resolve(moduleDir, "../../../.env"),
		);
	}

	const seen = new Set<string>();
	for (const path of candidates) {
		if (seen.has(path)) continue;
		seen.add(path);
		if (existsSync(path)) {
			loadEnv({ path });
		}
	}
}

loadMonorepoEnv();

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
	onValidationError: (issues) => {
		const details = issues
			.map((issue) => {
				const path = issue.path?.join(".") || "unknown";
				return `  - ${path}: ${issue.message}`;
			})
			.join("\n");
		console.error(
			`❌ Invalid server environment variables:\n${details}\n\n` +
				`Expected DATABASE_URL and CORS_ORIGIN (see apps/server/.env).\n` +
				`cwd=${process.cwd()}`,
		);
		throw new Error("Invalid environment variables");
	},
});
