import type { ContentEntry } from "./types";

export function publishedEntries<T extends ContentEntry>(entries: readonly T[]): T[] {
  return entries.filter((entry) => entry.status === "published");
}

export function publishedEntry<T extends ContentEntry>(entries: readonly T[], slug: string): T | undefined {
  return entries.find((entry) => entry.status === "published" && entry.slug === slug);
}
