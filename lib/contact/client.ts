import type { ContactInput, ContactResult } from "./schema";

// No UI yet. Call this from the future contact form's submit handler.
export async function submitContact(input: ContactInput, signal?: AbortSignal): Promise<ContactResult> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
    });
    const result: unknown = await response.json();
    if (typeof result === "object" && result !== null && "ok" in result && typeof result.ok === "boolean") {
      return result as ContactResult;
    }
    throw new Error("Unexpected response.");
  } catch (error) {
    if (signal?.aborted) throw error;
    return { ok: false, error: "Couldn't reach the server. Please try again." };
  }
}
