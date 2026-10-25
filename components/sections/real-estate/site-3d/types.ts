import type { HomeConfig } from "@/content/real-estate";

export type SiteSelection =
  | { kind: "plot"; id: string }
  | { kind: "building"; floor: number | null; unit: string | null }
  | null;

/** What a click in the 3D plan asks for; the selector decides whether it applies. */
export type PickTarget =
  | { kind: "plot"; id: string }
  | { kind: "building" }
  | { kind: "floor"; floor: number }
  | { kind: "unit"; floor: number; unit: string };

export interface SiteState {
  selection: SiteSelection;
  /** Plots that match the current filters. */
  shownPlots: readonly string[];
  buildingShown: boolean;
  /** Show the homes, or only the land plots. */
  homes: boolean;
  configs: Readonly<Record<string, HomeConfig>>;
}
