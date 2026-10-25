"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import {
  areaById,
  areaSummary,
  factoryAreas,
  orderStepDetail,
  orderSteps,
  sampleOrder,
  scenarioSummary,
  scenarios,
  stepLabels,
  type AreaId,
  type AreaSummary,
  type Scenario,
} from "@/content/factory-demo";
import { FactoryPlan } from "./factory-plan";
import styles from "./manufacturing.module.css";

// three.js and the factory load only when a visitor first asks for the 3D view.
const FactoryView = dynamic(() => import("./factory-view"), { ssr: false, loading: () => <div className={styles.factoryPending} /> });

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Select a work area, follow one order through the factory, and switch to a material
 * shortage. The plan and 3D view are pointer shortcuts; the area list offers every
 * choice to keyboard and screen reader users. Status is given in text, not colour alone.
 */
export function FactoryDemo() {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [follow, setFollow] = useState(true);
  const [selected, setSelected] = useState<AreaId>("fabrication");
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [factoryRequested, setFactoryRequested] = useState(false);
  const [factoryUnavailable, setFactoryUnavailable] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const id = useId();

  const summaries = useMemo(
    () => Object.fromEntries(factoryAreas.map((area) => [area.id, areaSummary(area.id, scenario)])) as Record<AreaId, AreaSummary>,
    [scenario],
  );
  const steps = useMemo(() => orderSteps(scenario), [scenario]);
  const factoryState = useMemo(
    () => ({ selected, follow, attention: factoryAreas.filter((area) => summaries[area.id].status === "attention").map((area) => area.id) }),
    [selected, follow, summaries],
  );

  const area = areaById(selected);
  const summary = summaries[selected];
  const stage = factoryAreas.indexOf(area) + 1;

  function select(next: AreaId, announce = false) {
    setSelected(next);
    if (announce) setAnnouncement(`${areaById(next).code} ${areaById(next).name} selected: ${summaries[next].statusLabel.toLowerCase()}.`);
  }

  function showView(next: "2d" | "3d") {
    setView(next);
    if (next === "3d") setFactoryRequested(true);
  }

  return (
    <div className={styles.demo}>
      <div className={styles.stageColumn}>
        <div className={styles.stageBar}>
          <div className={styles.viewSwitch} role="group" aria-label="Factory view">
            <button type="button" aria-pressed={view === "2d"} onClick={() => showView("2d")}>Floor plan</button>
            <button type="button" aria-pressed={view === "3d"} disabled={factoryUnavailable} onClick={() => showView("3d")}>3D view</button>
          </div>
          <span className={styles.badge}>Factory digital twin demo · Simulated data</span>
        </div>

        <div className={styles.stage} data-view={view}>
          <div className={styles.planWrap} hidden={view !== "2d"}>
            <FactoryPlan selected={selected} follow={follow} summaries={summaries} steps={steps} onSelect={(next) => select(next, true)} />
          </div>
          {factoryRequested && !factoryUnavailable && (
            <div className={styles.factoryWrap} hidden={view !== "3d"}>
              <FactoryView
                state={factoryState}
                summaries={summaries}
                onPick={(next) => select(next, true)}
                onUnavailable={() => {
                  setFactoryUnavailable(true);
                  setView("2d");
                  setAnnouncement("The 3D view isn’t available in this browser, so the floor plan is shown.");
                }}
              />
            </div>
          )}
        </div>

        <ol className={styles.route} aria-label={`Route of ${sampleOrder.workOrder}`}>
          {steps.map((step) => {
            const stepArea = areaById(step.area);
            return (
              <li key={step.area} data-state={step.state}>
                <button type="button" aria-pressed={selected === step.area} onClick={() => select(step.area)}>
                  <span className={styles.routeCode}>{stepArea.code}</span>
                  <span className={styles.routeName}>{stepArea.name}</span>
                  <span className={styles.routeState}>{stepLabels[step.state]}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelControls}>
          <div className={styles.segmented} role="group" aria-label="Scenario">
            {scenarios.map((option) => (
              <button key={option.id} type="button" aria-pressed={scenario === option.id} onClick={() => setScenario(option.id)}>{option.label}</button>
            ))}
          </div>
          <button type="button" className={styles.toggle} aria-pressed={follow} onClick={() => setFollow((value) => !value)}>
            <span aria-hidden="true" />
            Follow order {sampleOrder.workOrder}
          </button>
        </div>

        <p className={styles.scenario} role="status" data-scenario={scenario}>{scenarioSummary(scenario)}</p>
        <p className={styles.visuallyHidden} aria-live="polite">{announcement}</p>

        <fieldset className={styles.areas}>
          <legend className={styles.visuallyHidden}>Work area</legend>
          {factoryAreas.map((item) => {
            const itemSummary = summaries[item.id];
            return (
              <label key={item.id} className={styles.areaOption} data-attention={itemSummary.status === "attention" || undefined}>
                <input type="radio" name={`${id}-area`} value={item.id} checked={selected === item.id} onChange={() => select(item.id)} />
                <span className={styles.areaCode} aria-hidden="true">{item.code}</span>
                <span className={styles.areaText}>
                  <strong>{item.name}</strong>
                  <small>{itemSummary.statusLabel}</small>
                </span>
              </label>
            );
          })}
        </fieldset>

        <motion.div
          key={`${selected}-${scenario}`}
          className={styles.areaDetails}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className={styles.detailsHead}>
            <h4>{area.code} {area.name}</h4>
            <span className={styles.statusTag} data-attention={summary.status === "attention" || undefined}>{summary.statusLabel}</span>
          </div>
          <dl className={styles.facts}>
            <div><dt>Stage</dt><dd>{stage} of {factoryAreas.length}</dd></div>
            <div><dt>Equipment</dt><dd>{area.equipment}</dd></div>
            <div><dt>Next step</dt><dd>{summary.next}</dd></div>
          </dl>
          <div className={styles.detailBlock}>
            <h5>Current jobs</h5>
            <ul>
              {summary.jobs.map((job) => (
                <li key={job.id}><b>{job.id}</b> {job.product} × {job.quantity}<small>{job.progress}</small></li>
              ))}
            </ul>
          </div>
          <div className={styles.detailBlock}>
            <h5>Materials</h5>
            <ul>
              {summary.materials.map((line) => (
                <li key={line.item} data-state={line.state}>
                  <b>{line.item}</b>
                  <small><span className={styles.materialState}>{line.state === "short" ? "Short" : "Ready"}</span> {line.note}</small>
                </li>
              ))}
            </ul>
          </div>
          {follow && summary.order && (
            <div className={styles.orderBlock} data-state={summary.order.state}>
              <h5>{sampleOrder.workOrder} here: {stepLabels[summary.order.state]}</h5>
              <p>{summary.order.note}</p>
              <ul>{orderStepDetail[selected].map((line) => <li key={line}>{line}</li>)}</ul>
            </div>
          )}
        </motion.div>

        <p className={styles.disclosure}>
          Simulated records for an illustrative factory. Not a live client site, a process simulator, or a machine-control interface.
        </p>
      </div>
    </div>
  );
}
