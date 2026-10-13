import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { ContactSubmission } from "@/lib/contact/schema";
import { database } from "./database";

function rateLimitKeys(submission: ContactSubmission, request: Request) {
  const secret = process.env.CONTACT_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) throw new Error("Configure CONTACT_RATE_LIMIT_SECRET before enabling contact submissions.");
  const hash = (value: string) => createHmac("sha256", secret).update(value).digest("hex");
  const keys = [hash(`email:${submission.email}`)];
  const header = process.env.CONTACT_IP_HEADER ?? "none";
  const trustedHeaders = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"];
  if (header !== "none" && !trustedHeaders.includes(header)) throw new Error("Invalid CONTACT_IP_HEADER.");
  if (header !== "none") {
    const ip = request.headers.get(header)?.split(",")[0].trim();
    if (!ip || !isIP(ip)) throw new Error("The trusted proxy IP header is missing or invalid.");
    keys.push(hash(`ip:${ip}`));
  }
  // A stable lock order avoids deadlocks between concurrent submissions.
  return keys.sort();
}

export async function saveContactSubmission(submission: ContactSubmission, request: Request): Promise<"saved" | "limited"> {
  const keys = rateLimitKeys(submission, request);
  const sql = database();
  // Counters and submission commit together. UPSERT locks prevent concurrent
  // requests from passing the same limit. Neither raw IPs nor hashes of message
  // contents are stored on contact records.
  const results = await sql.transaction([
    ...keys.map((key) => sql`
      INSERT INTO simplex.contact_rate_limits (key_hash) VALUES (${key})
      ON CONFLICT (key_hash) DO UPDATE SET
        attempts = CASE WHEN simplex.contact_rate_limits.window_started_at <= now() - interval '15 minutes'
          THEN 1 ELSE simplex.contact_rate_limits.attempts + 1 END,
        window_started_at = CASE WHEN simplex.contact_rate_limits.window_started_at <= now() - interval '15 minutes'
          THEN now() ELSE simplex.contact_rate_limits.window_started_at END
    `),
    sql`
      INSERT INTO simplex.contact_submissions (name, email, company, message)
      SELECT ${submission.name}, ${submission.email}, ${submission.company}, ${submission.message}
      WHERE NOT EXISTS (
        SELECT 1 FROM simplex.contact_rate_limits
        WHERE key_hash = ANY(${keys}::text[]) AND attempts > 5
      )
      RETURNING id
    `,
  ]);
  return results[results.length - 1].length ? "saved" : "limited";
}
