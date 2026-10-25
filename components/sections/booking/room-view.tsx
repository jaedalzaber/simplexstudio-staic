"use client";

import { useEffect, useRef, useState } from "react";
import { CompassIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { demoTables, type TableStatus } from "@/content/booking-demo";
import { WebGLUnavailable, createRoomScene, type RoomScene } from "./room-3d/scene";
import styles from "@/components/sections/solution/scene-view.module.css";

interface RoomViewProps {
  statuses: Readonly<Record<string, TableStatus>>;
  selected: string | null;
  onPick: (id: string) => void;
  /** Called when WebGL 2 is unavailable; the floor plan is shown instead. */
  onUnavailable: () => void;
}

const statusText: Record<TableStatus, string> = { available: "Available", booked: "Booked", unsuitable: "Not for your party" };
const tone: Record<TableStatus, string> = { available: "ok", booked: "muted", unsuitable: "outline" };

/**
 * The restaurant as a lit 3D room. Loaded on request. Labels and controls
 * overlay the canvas; every choice is also in the table list beside it.
 */
export default function RoomView({ statuses, selected, onPick, onUnavailable }: RoomViewProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<RoomScene | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [hint, setHint] = useState<"wheel" | "touch" | null>(null);
  const [mac] = useState(() => /Mac|iPhone|iPad/.test(navigator.userAgent));
  const latest = useRef({ state: { statuses, selected }, onPick, onUnavailable });

  useEffect(() => {
    latest.current = { state: { statuses, selected }, onPick, onUnavailable };
  });

  useEffect(() => {
    const controller = new AbortController();
    let hintTimer = 0;
    createRoomScene({
      container: viewRef.current!,
      labels: labelsRef.current!,
      tables: demoTables,
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
        if (!(error instanceof WebGLUnavailable)) console.error("3D room failed", error);
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
    sceneRef.current?.update({ statuses, selected });
  }, [statuses, selected]);

  return (
    <div className={styles.view} data-status={status}>
      <div ref={viewRef} className={styles.stage} aria-hidden="true">
        <div ref={labelsRef} className={styles.labels}>
          {demoTables.map((item) => (
            <span key={item.id} className={styles.label} data-label={item.id} data-tone={tone[statuses[item.id]]} data-selected={selected === item.id || undefined}>
              <span className={styles.chip}>
                <i />
                {item.number}
                <em>{item.seats} seats · {statusText[statuses[item.id]]}</em>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.loading} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        {status === "loading" ? "Preparing the 3D room" : ""}
      </div>

      <p className={styles.hint} data-visible={hint !== null || undefined} aria-hidden="true">
        {hint === "touch" ? "Use two fingers to turn and zoom the room" : `Use ${mac ? "⌘" : "Ctrl"} + scroll to zoom the room`}
      </p>

      <div className={styles.zoom} role="group" aria-label="3D view">
        <button type="button" aria-label="Zoom in" onClick={() => sceneRef.current?.zoom(1)}><PlusIcon /></button>
        <button type="button" aria-label="Zoom out" onClick={() => sceneRef.current?.zoom(-1)}><MinusIcon /></button>
        <button type="button" aria-label="Reset view" onClick={() => sceneRef.current?.resetView()}><CompassIcon /></button>
      </div>
    </div>
  );
}
