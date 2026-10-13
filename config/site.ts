const configuredUrl = process.env.SITE_URL ?? "http://localhost:3000";
const url = new URL(configuredUrl);
if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
  throw new Error("SITE_URL must be a public HTTP(S) origin without credentials.");
}

export const siteConfig = {
  name: "Simplex Studio",
  description: "Scaling and digital transformation partner.",
  locale: "en",
  url: url.origin,
  indexable: process.env.SITE_INDEXABLE === "true" && url.hostname !== "localhost",
} as const;
