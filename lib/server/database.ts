import "server-only";
import { neon } from "@neondatabase/serverless";

export function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required.");
  return neon(connectionString, { fetchOptions: { signal: AbortSignal.timeout(10_000) } });
}
