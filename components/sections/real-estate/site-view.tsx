"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CompassIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import type { Plot, Unit } from "@/content/real-estate";
import { WebGLUnavailable, createSiteScene, type SiteScene } from "./site-3d/scene";
import type { PickTarget, SiteState } from "./site-3d/types";
import styles from "./site-view.module.css";

interface SiteViewProps {
  plots: readonly Plot[];
  building: { floors: number; shape: { x: number; y: number; width: number; height: number } };
  units: readonly Unit[];
  state: Omit<SiteState, "homes">;
  onPick: (target: PickTarget) => void;
  /** Rendered instead when WebGL is unavailable. */
  fallback: ReactNode;
}

/**
 * The development as a 3D landscape with baked light. Loaded on demand. Labels and
 * controls overlay the canvas; every choice is also in the list beside it.
 */
export default function SiteView({ plots, building, units, state, onPick, fallback }: SiteViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SiteScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [homes, setHomes] = useState(true);
  const [hint, setHint] = useState<"wheel" | "touch" | null>(null);
  const [mac] = useState(() => /Mac|iPhone|iPad/.test(navigator.userAgent));
  const latest = useRef({ state: { ...state, homes }, onPick });

  useEffect(() => {
    latest.current = { state: { ...state, homes }, onPick };
  });

  useEffect(() => {
    const controller = new AbortController();
    let hintTimer = 0;
    createSiteScene({
      container: viewRef.current!,
      labels: labelsRef.current!,
      plots,
      building,
      units,
      state: latest.current.state,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      signal: controller.signal,
      onPick: (target) => latest.current.onPick(target),
      onHint: (kind) => {
        setHint(kind);
        window.clearTimeout(hintTimer);
        hintTimer = window.setTimeout(() => setHint(null), 1800);
      },
    })
      .then((scene) => {
        if (controller.signal.aborted) return scene.dispose();
        sceneRef.current = scene;
        scene.update(latest.current.state);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // Without WebGL 2 the flat plan is expected; anything else is a bug worth reporting.
        if (!(error instanceof WebGLUnavailable)) console.error("3D site plan failed", error);
        setStatus("failed");
      });
    return () => {
      controller.abort();
      window.clearTimeout(hintTimer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [plots, building, units]);

  useEffect(() => {
    sceneRef.current?.update({ ...state, homes });
  }, [state, homes]);

  if (status === "failed") return fallback;

  const shown = new Set(state.shownPlots);
  const selectedPlot = state.selection?.kind === "plot" ? state.selection.id : null;

  return (
    <div className={styles.view} data-status={status}>
      <div ref={viewRef} className={styles.stage} aria-hidden="true">
        <div ref={labelsRef} className={styles.labels}>
          {plots.map((plot) => (
            <span
              key={plot.id}
              className={styles.label}
              data-label={plot.id}
              data-status={plot.status}
              data-selected={selectedPlot === plot.id || undefined}
              data-dim={!shown.has(plot.id) || undefined}
            >
              <span className={styles.chip}>
                <i />
                {plot.id}
                <em>{plot.type} · {plot.status}</em>
              </span>
            </span>
          ))}
          <span className={styles.label} data-label="building" data-status="Available" data-selected={state.selection?.kind === "building" || undefined} data-dim={!state.buildingShown || undefined}>
            <span className={styles.chip}>
              <i />
              A<em>Apartments · {building.floors} floors</em>
            </span>
          </span>
        </div>
      </div>

      <div className={styles.loading} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        {status === "loading" ? "Preparing the 3D site plan" : ""}
      </div>

      <p className={styles.hint} data-visible={hint !== null || undefined} aria-hidden="true">
        {hint === "touch" ? "Use two fingers to turn and zoom the view" : `Use ${mac ? "⌘" : "Ctrl"} + scroll to zoom the view`}
      </p>

      <div className={styles.tools}>
        <button type="button" className={styles.toggle} aria-pressed={homes} onClick={() => setHomes((value) => !value)}>
          <span aria-hidden="true" />
          Homes
        </button>
        <div className={styles.zoom} role="group" aria-label="3D view">
          <button type="button" aria-label="Zoom in" onClick={() => sceneRef.current?.zoom(1)}><PlusIcon /></button>
          <button type="button" aria-label="Zoom out" onClick={() => sceneRef.current?.zoom(-1)}><MinusIcon /></button>
          <button type="button" aria-label="Reset view" onClick={() => sceneRef.current?.resetView()}><CompassIcon /></button>
        </div>
      </div>
    </div>
  );
}
