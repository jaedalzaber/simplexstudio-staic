"use client";

import { useEffect, useRef, useState } from "react";
import { CompassIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { factoryAreas, type AreaId, type AreaSummary } from "@/content/factory-demo";
import { WebGLUnavailable, createFactoryScene, type FactoryScene, type FactoryState } from "./factory-3d/scene";
import styles from "@/components/sections/solution/scene-view.module.css";

interface FactoryViewProps {
  state: FactoryState;
  summaries: Readonly<Record<AreaId, AreaSummary>>;
  onPick: (id: AreaId) => void;
  /** Called when WebGL 2 is unavailable; the floor plan is shown instead. */
  onUnavailable: () => void;
}

/**
 * The sample factory as a lit 3D hall. Loaded on request. Labels and controls
 * overlay the canvas; every area is also in the list beside it.
 */
export default function FactoryView({ state, summaries, onPick, onUnavailable }: FactoryViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<FactoryScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [hint, setHint] = useState<"wheel" | "touch" | null>(null);
  const [mac] = useState(() => /Mac|iPhone|iPad/.test(navigator.userAgent));
  const latest = useRef({ state, onPick, onUnavailable });

  useEffect(() => {
    latest.current = { state, onPick, onUnavailable };
  });

  useEffect(() => {
    const controller = new AbortController();
    let hintTimer = 0;
    createFactoryScene({
      container: viewRef.current!,
      labels: labelsRef.current!,
      state: latest.current.state,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      signal: controller.signal,
      onPick: (id) => latest.current.onPick(id),
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
        // Without WebGL 2 the floor plan is expected; anything else is a bug worth reporting.
        if (!(error instanceof WebGLUnavailable)) console.error("3D factory failed", error);
        latest.current.onUnavailable();
      });
    return () => {
      controller.abort();
      window.clearTimeout(hintTimer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.update(state);
  }, [state]);

  return (
    <div className={styles.view} data-status={status}>
      <div ref={viewRef} className={styles.stage} aria-hidden="true">
        <div ref={labelsRef} className={styles.labels}>
          {factoryAreas.map((area) => {
            const summary = summaries[area.id];
            return (
              <span key={area.id} className={styles.label} data-label={area.id} data-tone={summary.status === "attention" ? "warn" : "ok"} data-selected={state.selected === area.id || undefined}>
                <span className={styles.chip}>
                  <i />
                  {area.code} {area.name}
                  <em>{summary.statusLabel}</em>
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.loading} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        {status === "loading" ? "Preparing the 3D factory" : ""}
      </div>

      <p className={styles.hint} data-visible={hint !== null || undefined} aria-hidden="true">
        {hint === "touch" ? "Use two fingers to turn and zoom the factory" : `Use ${mac ? "⌘" : "Ctrl"} + scroll to zoom the factory`}
      </p>

      <div className={styles.zoom} role="group" aria-label="3D view">
        <button type="button" aria-label="Zoom in" onClick={() => sceneRef.current?.zoom(1)}><PlusIcon /></button>
        <button type="button" aria-label="Zoom out" onClick={() => sceneRef.current?.zoom(-1)}><MinusIcon /></button>
        <button type="button" aria-label="Reset view" onClick={() => sceneRef.current?.resetView()}><CompassIcon /></button>
      </div>
    </div>
  );
}
