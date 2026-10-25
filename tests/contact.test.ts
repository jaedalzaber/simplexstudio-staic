import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTACT_BODY_LIMIT, createContactHandler } from "../lib/contact/handler";
import { contactSchema } from "../lib/contact/schema";

const valid = { name: "Test Visitor", email: "visitor@example.invalid", message: "A valid test enquiry message." };
const origin = "https://simplex.example";
const request = (body: unknown = valid, headers: Record<string, string> = {}) => new Request(`${origin}/api/contact`, {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body),
});

test("normalizes input and defaults optional fields", () => {
  const result = contactSchema.parse({ ...valid, name: "  Test Visitor  ", email: " VISITOR@EXAMPLE.INVALID " });
  assert.equal(result.name, valid.name);
  assert.equal(result.email, valid.email);
  assert.equal(result.company, "");
  assert.equal(result.website, "");
  assert.equal(result.nda, false);
});

test("accepts an NDA request and rejects non-boolean values", () => {
  assert.equal(contactSchema.parse({ ...valid, nda: true }).nda, true);
  assert.equal(contactSchema.safeParse({ ...valid, nda: "yes" }).success, false);
});

test("rejects invalid email, whitespace, oversized fields, unknown keys, and nonobjects", () => {
  const invalid = [
    { ...valid, email: "not-an-email" }, { ...valid, name: "  " },
    { ...valid, message: "short" }, { ...valid, name: "x".repeat(101) },
    { ...valid, company: "x".repeat(161) }, { ...valid, message: "x".repeat(5001) },
    { ...valid, role: "admin" }, null, [], "text",
  ];
  for (const input of invalid) assert.equal(contactSchema.safeParse(input).success, false);
});

test("valid submission is saved once and returns 201 without caching", async () => {
  let calls = 0;
  const handler = createContactHandler({ persist: async (submission) => {
    calls++;
    assert.equal(submission.email, valid.email);
    return "saved";
  } });
  const response = await handler(request());
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(calls, 1);
});

test("validation errors identify the invalid fields and never reach persistence", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  const response = await handler(request({ ...valid, email: "bad", message: "bad" }));
  assert.equal(response.status, 422);
  const result = await response.json();
  assert.ok(result.fieldErrors.email.length);
  assert.ok(result.fieldErrors.message.length);
});

test("honeypot submissions return success without persistence", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  const response = await handler(request({ ...valid, website: "https://spam.example" }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test("rejects foreign and missing origins before reading the body", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  assert.equal((await handler(request(valid, { Origin: "https://foreign.example" }))).status, 403);
  const missing = request();
  missing.headers.delete("origin");
  assert.equal((await handler(missing)).status, 403);
});

test("allows an explicitly configured canonical origin", async () => {
  const handler = createContactHandler({ allowedOrigin: "https://canonical.example", persist: async () => "saved" });
  assert.equal((await handler(request(valid, { Origin: "https://canonical.example" }))).status, 201);
});

test("rejects unsupported methods and content types", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  const get = await handler(new Request(`${origin}/api/contact`));
  assert.equal(get.status, 405);
  assert.equal(get.headers.get("allow"), "POST");
  assert.equal((await handler(request(valid, { "Content-Type": "text/plain" }))).status, 415);
});

test("returns 400 for malformed JSON", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  const malformed = new Request(`${origin}/api/contact`, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{bad",
  });
  assert.equal((await handler(malformed)).status, 400);
});

test("enforces actual byte limit even without a content-length header", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  const response = await handler(request({ ...valid, message: "é".repeat(CONTACT_BODY_LIMIT / 2) }));
  assert.equal(response.status, 413);
});

test("rejects an oversized declared body", async () => {
  const handler = createContactHandler({ persist: async () => { assert.fail("Must not persist."); } });
  const response = await handler(request(valid, { "Content-Length": String(CONTACT_BODY_LIMIT + 1) }));
  assert.equal(response.status, 413);
});

test("rate limiting returns 429 and Retry-After", async () => {
  const handler = createContactHandler({ persist: async () => "limited" });
  const response = await handler(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "900");
});

test("persistence failures never expose credentials or submitted data", async () => {
  let notified = false;
  const handler = createContactHandler({
    persist: async () => { throw new Error("postgres://secret@example.invalid private data"); },
    onError: () => { notified = true; },
  });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.ok(notified);
  assert.doesNotMatch(await response.text(), /secret|private data|postgres/);
});
