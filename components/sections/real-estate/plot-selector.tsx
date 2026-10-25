"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { pages } from "@/content/pages";
import {
  defaultHomeConfig,
  demoBuilding,
  demoPlots,
  demoUnits,
  homeDesigns,
  homeExtras,
  homeFinishes,
  type HomeConfig,
  type Plot,
  type PropertyStatus,
  type Unit,
} from "@/content/real-estate";
import type { PickTarget, SiteSelection } from "./site-3d/types";
import { SitePlan } from "./site-plan";
import styles from "./real-estate.module.css";

// three.js and the scene load only when the plan nears the viewport.
const SiteView = dynamic(() => import("./site-view"), { ssr: false, loading: () => <div className={styles.planPlaceholder} /> });

const typeFilters = ["All", "Villas", "Townhouses", "Apartments"] as const;
type TypeFilter = (typeof typeFilters)[number];

const ease = [0.16, 1, 0.3, 1] as const;
const plotName = (plot: Plot) => `${plot.type} ${plot.id}`;
const floors = Array.from({ length: demoBuilding.floors }, (_, index) => index + 1);
const availableUnits = demoUnits.filter((unit) => unit.status === "Available").length;
const initialConfigs = (): Record<string, HomeConfig> => Object.fromEntries(demoPlots.map((plot, index) => [plot.id, defaultHomeConfig(index)]));

function matchesType(plot: Plot, filter: TypeFilter) {
  return filter === "All" || (filter === "Villas" && plot.type === "Villa") || (filter === "Townhouses" && plot.type === "Townhouse");
}

function StatusTag({ status }: { status: PropertyStatus }) {
  return <span className={styles.status} data-status={status}>{status}</span>;
}

function Details({ title, rows, status, children }: { title: string; rows: [string, string][]; status: PropertyStatus; children?: ReactNode }) {
  return (
    <div className={styles.details}>
      <div className={styles.detailsHead}>
        <h4>{title}</h4>
        <StatusTag status={status} />
      </div>
      <dl>
        {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      {children}
      {status !== "Sold" && (
        <Link href={pages.contact.path} className={styles.enquire}>
          Enquire about {title}
          <ArrowUpRightIcon />
        </Link>
      )}
    </div>
  );
}

/** Design, finish and extras for one home; the 3D plan rebuilds and relights it as these change. */
function Customise({ config, onChange }: { config: HomeConfig; onChange: (patch: Partial<HomeConfig>) => void }) {
  return (
    <div className={styles.customise}>
      <h5>Customise this home</h5>
      <fieldset>
        <legend>Design</legend>
        <div className={styles.options}>
          {homeDesigns.map((design) => (
            <button key={design.id} type="button" aria-pressed={config.design === design.id} onClick={() => onChange({ design: design.id })}>
              {design.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Finish</legend>
        <div className={styles.options}>
          {homeFinishes.map((finish) => (
            <button key={finish.id} type="button" aria-pressed={config.finish === finish.id} onClick={() => onChange({ finish: finish.id })}>
              <span className={styles.swatch} style={{ background: finish.swatch }} aria-hidden="true" />
              {finish.label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Extras</legend>
        <div className={styles.options}>
          {homeExtras.map((extra) => (
            <button key={extra.id} type="button" aria-pressed={config[extra.id]} onClick={() => onChange({ [extra.id]: !config[extra.id] })}>
              {extra.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/**
 * Example development → plot or building → floor → unit → details → enquiry.
 * The 3D plan is a pointer shortcut; the list beside it offers every choice to
 * keyboard and screen reader users. Status is shown by pattern and text, not colour alone.
 */
export function PlotSelector() {
  const [filter, setFilter] = useState<TypeFilter>("All");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selection, setSelection] = useState<SiteSelection>(null);
  const [configs, setConfigs] = useState(initialConfigs);
  const [near, setNear] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setNear(true);
      observer.disconnect();
    }, { rootMargin: "1200px 0px" });
    if (planRef.current) observer.observe(planRef.current);
    return () => observer.disconnect();
  }, []);

  const plotShown = (plot: Plot) => matchesType(plot, filter) && (!availableOnly || plot.status === "Available");
  const buildingShown = (filter === "All" || filter === "Apartments") && (!availableOnly || availableUnits > 0);
  const listedPlots = demoPlots.filter(plotShown);

  const siteState = useMemo(() => ({
    selection,
    shownPlots: demoPlots.filter((plot) => matchesType(plot, filter) && (!availableOnly || plot.status === "Available")).map((plot) => plot.id),
    buildingShown: (filter === "All" || filter === "Apartments") && (!availableOnly || availableUnits > 0),
    configs,
  }), [selection, filter, availableOnly, configs]);

  const plot = selection?.kind === "plot" ? demoPlots.find((item) => item.id === selection.id) : undefined;
  const floor = selection?.kind === "building" ? selection.floor : null;
  const unit: Unit | undefined = selection?.kind === "building" && selection.unit ? demoUnits.find((item) => item.id === selection.unit) : undefined;
  const floorUnits = floor ? demoUnits.filter((item) => item.floor === floor && (!availableOnly || item.status === "Available")) : [];

  const path = ["Development"];
  if (plot) path.push(plotName(plot), "Details");
  if (selection?.kind === "building") {
    path.push(demoBuilding.name);
    if (floor) path.push(`Floor ${floor}`);
    if (unit) path.push(`Apartment ${unit.id}`, "Details");
  }

  const announcement = plot
    ? `${plotName(plot)} selected, ${plot.status.toLowerCase()}.`
    : unit ? `Apartment ${unit.id} selected, ${unit.status.toLowerCase()}.`
      : selection?.kind === "building" ? `${demoBuilding.name} selected${floor ? `, floor ${floor}` : ""}.` : "";

  function chooseFilter(next: TypeFilter) {
    setFilter(next);
    setSelection(null);
  }

  function pick(target: PickTarget) {
    if (target.kind === "plot") return setSelection({ kind: "plot", id: target.id });
    if (target.kind === "building") return setSelection({ kind: "building", floor: null, unit: null });
    if (target.kind === "floor") return setSelection({ kind: "building", floor: target.floor, unit: null });
    const picked = demoUnits.find((item) => item.id === target.unit);
    if (picked && (!availableOnly || picked.status === "Available")) setSelection({ kind: "building", floor: target.floor, unit: picked.id });
  }

  return (
    <div className={styles.selector}>
      <div ref={planRef} className={styles.plan}>
        {near ? (
          <SiteView
            plots={demoPlots}
            building={demoBuilding}
            units={demoUnits}
            state={siteState}
            onPick={pick}
            fallback={<SitePlan selection={selection} plotShown={plotShown} buildingShown={buildingShown} onSelect={setSelection} />}
          />
        ) : <div className={styles.planPlaceholder} />}
        <ul className={styles.legend} aria-hidden="true">
          <li data-status="Available">Available</li>
          <li data-status="Reserved">Reserved</li>
          <li data-status="Sold">Sold</li>
        </ul>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelControls}>
          <FilterTabs options={typeFilters} value={filter} onChange={chooseFilter} label="Property type" controls={`${id}-list`} size="md" className={styles.typeFilter} />
          <button type="button" className={styles.availableToggle} aria-pressed={availableOnly} onClick={() => { setAvailableOnly((value) => !value); setSelection(null); }}>
            <span aria-hidden="true" />
            Available only
          </button>
        </div>

        <ol className={styles.path} aria-label="Your selection">
          {path.map((step, index) => <li key={step} aria-current={index === path.length - 1 ? "step" : undefined}>{step}</li>)}
        </ol>
        <p className={styles.visuallyHidden} aria-live="polite">{announcement}</p>

        <AnimatePresence mode="wait" initial={false}>
          {selection === null ? (
            <motion.ul
              key="list"
              id={`${id}-list`}
              className={styles.propertyList}
              data-lenis-prevent
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
            >
              {buildingShown && (
                <li>
                  <button type="button" onClick={() => setSelection({ kind: "building", floor: null, unit: null })}>
                    <span><strong>{demoBuilding.name}</strong><small>{demoUnits.length} apartments · {demoBuilding.floors} floors</small></span>
                    <span className={styles.status} data-status="Available">{availableUnits} available</span>
                  </button>
                </li>
              )}
              {listedPlots.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setSelection({ kind: "plot", id: item.id })}>
                    <span><strong>{plotName(item)}</strong><small>{item.area} m² plot · {item.bedrooms} bedrooms</small></span>
                    <StatusTag status={item.status} />
                  </button>
                </li>
              ))}
              {!buildingShown && listedPlots.length === 0 && <li className={styles.empty}>No properties match these filters.</li>}
            </motion.ul>
          ) : (
            <motion.div
              key={plot?.id ?? `building-${floor ?? "all"}-${unit?.id ?? "none"}`}
              className={styles.stepPanel}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.4, ease }}
            >
              <button type="button" className={styles.back} onClick={() => setSelection(
                selection.kind === "building" && unit ? { kind: "building", floor, unit: null }
                  : selection.kind === "building" && floor ? { kind: "building", floor: null, unit: null } : null,
              )}>
                ← Back
              </button>

              {plot && (
                <Details
                  title={plotName(plot)}
                  status={plot.status}
                  rows={[["Type", plot.type], ["Plot area", `${plot.area} m²`], ["Bedrooms", String(plot.bedrooms)]]}
                >
                  {plot.status !== "Sold" && (
                    <Customise config={configs[plot.id]} onChange={(patch) => setConfigs((current) => ({ ...current, [plot.id]: { ...current[plot.id], ...patch } }))} />
                  )}
                </Details>
              )}

              {selection.kind === "building" && !floor && (
                <div className={styles.choice}>
                  <h4>Choose a floor</h4>
                  <ul className={styles.floorGrid}>
                    {[...floors].reverse().map((level) => {
                      const free = demoUnits.filter((item) => item.floor === level && item.status === "Available").length;
                      return (
                        <li key={level}>
                          <button type="button" onClick={() => setSelection({ kind: "building", floor: level, unit: null })}>
                            Floor {level}<small>{free} available</small>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {selection.kind === "building" && floor && !unit && (
                <div className={styles.choice}>
                  <h4>Floor {floor}: choose an apartment</h4>
                  <ul className={styles.unitGrid}>
                    {floorUnits.map((item) => (
                      <li key={item.id}>
                        <button type="button" onClick={() => setSelection({ kind: "building", floor, unit: item.id })}>
                          <strong>{item.id}</strong>
                          <small>{item.area} m² · {item.bedrooms} bed</small>
                          <StatusTag status={item.status} />
                        </button>
                      </li>
                    ))}
                    {floorUnits.length === 0 && <li className={styles.empty}>No available apartments on this floor.</li>}
                  </ul>
                </div>
              )}

              {unit && (
                <Details
                  title={`Apartment ${unit.id}`}
                  status={unit.status}
                  rows={[["Building", demoBuilding.name], ["Floor", String(unit.floor)], ["Area", `${unit.area} m²`], ["Bedrooms", String(unit.bedrooms)]]}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className={styles.sample}>Illustrative example with sample data.</p>
      </div>
    </div>
  );
}
