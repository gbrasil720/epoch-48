import { neonConfig } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

import { resolveMigrationDatabaseUrl } from "./src/db-url";

// drizzle-kit uses @neondatabase/serverless under the hood; Bun's WebSocket
// implementation breaks the default pool driver, so use fetch-based queries.
neonConfig.poolQueryViaFetch = true;

dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: resolveMigrationDatabaseUrl(),
  },
});
