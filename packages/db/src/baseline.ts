import { neon, neonConfig } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { readMigrationFiles } from "drizzle-orm/migrator";

import { resolveMigrationDatabaseUrl } from "./db-url";

neonConfig.poolQueryViaFetch = true;

dotenv.config({
	path: "../../apps/server/.env",
});

const databaseUrl = resolveMigrationDatabaseUrl();

if (!databaseUrl) {
	console.error("DATABASE_URL is not set");
	process.exit(1);
}

const sql = neon(databaseUrl);
const migrations = readMigrationFiles({ migrationsFolder: "./src/migrations" });
const applied = await sql`SELECT hash FROM drizzle.__drizzle_migrations`;
const appliedHashes = new Set(applied.map((row) => row.hash));

let inserted = 0;

for (const migration of migrations) {
	if (appliedHashes.has(migration.hash)) {
		continue;
	}

	await sql`
    INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
    VALUES (${migration.hash}, ${migration.folderMillis})
  `;
	inserted += 1;
}

if (inserted === 0) {
	console.log("All migrations are already baselined");
} else {
	console.log(`Baselined ${inserted} migration(s)`);
}
