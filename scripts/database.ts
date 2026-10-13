import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const command = process.argv[2];
  if (command !== "check" && command !== "migrate") {
    throw new Error("Use db:check or db:migrate.");
  }

  const connectionString =
    (command === "migrate" && process.env.DATABASE_URL_UNPOOLED) ||
    process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required.");
  const sql = neon(connectionString, {
    fetchOptions: { signal: AbortSignal.timeout(30_000) },
  });

  if (command === "check") {
    const tables = await sql`
      SELECT table_schema, table_name FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `;
    console.log(JSON.stringify({ connected: true, tables }, null, 2));
    return;
  }

  await sql`CREATE SCHEMA IF NOT EXISTS simplex`;
  await sql`
    CREATE TABLE IF NOT EXISTS simplex.schema_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const directory = path.join(process.cwd(), "db", "migrations");
  const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
  for (const name of files) {
    const source = await readFile(path.join(directory, name), "utf8");
    const checksum = createHash("sha256").update(source).digest("hex");
    const [applied] = await sql`
      SELECT checksum FROM simplex.schema_migrations WHERE name = ${name}
    `;
    if (applied) {
      if (applied.checksum !== checksum) {
        throw new Error(`Applied migration changed: ${name}. Add a new migration instead.`);
      }
      console.log(`Already applied: ${name}`);
      continue;
    }

    // Statement markers also support future PostgreSQL function bodies.
    const statements = source.split(/^-- statement-breakpoint\s*$/m).map((part) => part.trim()).filter(Boolean);
    await sql.transaction([
      ...statements.map((statement) => sql.query(statement)),
      sql`INSERT INTO simplex.schema_migrations (name, checksum) VALUES (${name}, ${checksum})`,
    ]);
    console.log(`Applied: ${name}`);
  }
}

main().catch((error: unknown) => {
  // Driver errors can include connection details: only print our own safe errors.
  const message = error instanceof Error && (
    error.message.startsWith("Applied migration changed:") ||
    error.message === "DATABASE_URL is required." ||
    error.message === "Use db:check or db:migrate."
  ) ? error.message : "Database operation failed. Check connectivity and migration SQL; credentials withheld.";
  console.error(message);
  process.exitCode = 1;
});
