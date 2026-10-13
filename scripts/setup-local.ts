import { randomBytes } from "node:crypto";
import { appendFile } from "node:fs/promises";
import { loadEnvConfig } from "@next/env";

async function main() {
  loadEnvConfig(process.cwd());
  if (process.env.CONTACT_RATE_LIMIT_SECRET) {
    if (process.env.CONTACT_RATE_LIMIT_SECRET.length < 32) throw new Error("CONTACT_RATE_LIMIT_SECRET must have at least 32 characters.");
    console.log("Contact secret is already configured.");
    return;
  }
  const secret = randomBytes(32).toString("hex");
  await appendFile(".env.local", `\n# Local contact API rate-limit secret (never commit).\nCONTACT_RATE_LIMIT_SECRET=${secret}\n`, { mode: 0o600 });
  console.log("Contact secret configured in ignored .env.local.");
}

main().catch(() => {
  console.error("Local setup failed. Check environment configuration and file permissions.");
  process.exitCode = 1;
});
