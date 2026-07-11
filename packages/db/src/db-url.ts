/**
 * Resolves the direct (non-pooler) Neon URL used by drizzle-kit and migrations.
 * Always targets the same database as DATABASE_URL so push/migrate match the app.
 */
export function resolveMigrationDatabaseUrl(): string {
	const pooled = process.env.DATABASE_URL;
	const direct = process.env.DATABASE_URL_DIRECT;

	if (!pooled) {
		return direct ?? "";
	}

	const pooledHost = new URL(pooled).hostname.replace("-pooler", "");

	if (direct) {
		const directHost = new URL(direct).hostname.replace("-pooler", "");
		if (directHost === pooledHost) {
			return direct;
		}
	}

	return pooled.replace("-pooler", "");
}
