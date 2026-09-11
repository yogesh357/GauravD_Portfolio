import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

// Global database client singleton for Next.js development & production
declare global {
  // eslint-disable-next-line no-var
  var __globalDbClient: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

export function getDb() {
  if (global.__globalDbClient) {
    return global.__globalDbClient;
  }

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured in .env.local. Please provide a valid PostgreSQL connection string."
    );
  }

  const client = postgres(connectionString, { max: 10, prepare: false });
  const db = drizzle(client, { schema });

  if (process.env.NODE_ENV !== "production") {
    global.__globalDbClient = db;
  }

  return db;
}

export const db = getDb();
export { schema };
