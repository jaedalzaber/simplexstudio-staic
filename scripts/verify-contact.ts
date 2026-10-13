import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { database } from "../lib/server/database";
import { saveContactSubmission } from "../lib/server/contact-repository";
import { contactSchema } from "../lib/contact/schema";

async function main() {
  loadEnvConfig(process.cwd());
  const secret = process.env.CONTACT_RATE_LIMIT_SECRET;
  assert.ok(secret);
  const email = `foundation-check+${randomUUID()}@example.invalid`;
  const submission = contactSchema.parse({ name: "Foundation verification", email, message: "Verification only. A quote ' and a SQL-like string SELECT 1; must be stored literally." });
  const key = createHmac("sha256", secret).update(`email:${email}`).digest("hex");
  const sql = database();
  const request = new Request("http://localhost:3000/api/contact");
  // Test without a proxy. The public deployment must configure its trusted IP header.
  process.env.CONTACT_IP_HEADER = "none";
  try {
    const outcomes = await Promise.all(Array.from({ length: 8 }, () => saveContactSubmission(submission, request)));
    assert.equal(outcomes.filter((outcome) => outcome === "saved").length, 5);
    assert.equal(outcomes.filter((outcome) => outcome === "limited").length, 3);
    const stored = await sql`SELECT message FROM simplex.contact_submissions WHERE email = ${email}`;
    assert.equal(stored.length, 5);
    assert.equal(stored[0].message, submission.message);
    await sql`UPDATE simplex.contact_rate_limits SET window_started_at = now() - interval '16 minutes' WHERE key_hash = ${key}`;
    assert.equal(await saveContactSubmission(submission, request), "saved");
    console.log("Verified Neon persistence, parameterized input, concurrent rate limiting, and window reset.");
  } finally {
    await sql.transaction([
      sql`DELETE FROM simplex.contact_submissions WHERE email = ${email}`,
      sql`DELETE FROM simplex.contact_rate_limits WHERE key_hash = ${key}`,
    ]);
    console.log("Verification records removed.");
  }
}

main().catch(() => {
  console.error("Contact database verification failed; credentials withheld.");
  process.exitCode = 1;
});
