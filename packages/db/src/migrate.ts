import { neon, neonConfig } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

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
const db = drizzle(sql);

try {
	await migrate(db, { migrationsFolder: "./src/migrations" });
	console.log("Migrations applied successfully");
} catch (error) {
	console.error("Migration failed:", error);
	process.exit(1);
}
