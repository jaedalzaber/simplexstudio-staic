import { z } from "zod";
import { contactSchema, type ContactResult, type ContactSubmission } from "./schema";

export const CONTACT_BODY_LIMIT = 16_384;
export const CONTACT_WINDOW_SECONDS = 900;

type Dependencies = {
  allowedOrigin?: string;
  persist: (submission: ContactSubmission, request: Request) => Promise<"saved" | "limited">;
  onError?: () => void;
};

function json(body: ContactResult, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function readBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > CONTACT_BODY_LIMIT) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(body);
}

export function createContactHandler({ persist, allowedOrigin, onError }: Dependencies) {
  return async function handleContact(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Use POST." }, 405, { Allow: "POST" });
    }
    const origin = request.headers.get("origin");
    const origins = new Set([new URL(request.url).origin, allowedOrigin].filter(Boolean));
    if (!origin || !origins.has(origin)) {
      return json({ ok: false, error: "Submit the form from this website." }, 403);
    }
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return json({ ok: false, error: "Send a JSON request." }, 415);
    }
    const declaredLength = Number(request.headers.get("content-length"));
    if (declaredLength > CONTACT_BODY_LIMIT) {
      return json({ ok: false, error: "Your message is too large." }, 413);
    }

    let payload: unknown;
    try {
      const body = await readBody(request);
      if (body === null) return json({ ok: false, error: "Your message is too large." }, 413);
      payload = JSON.parse(body);
    } catch {
      return json({ ok: false, error: "Send valid JSON." }, 400);
    }

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return json({ ok: false, error: "Check the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors }, 422);
    }
    if (parsed.data.website.trim()) return json({ ok: true });

    try {
      const result = await persist(parsed.data, request);
      if (result === "limited") {
        return json({ ok: false, error: "Too many messages. Please try again in 15 minutes." }, 429, { "Retry-After": String(CONTACT_WINDOW_SECONDS) });
      }
      return json({ ok: true }, 201);
    } catch {
      onError?.();
      return json({ ok: false, error: "We couldn't save your message. Please try again shortly." }, 503);
    }
  };
}
