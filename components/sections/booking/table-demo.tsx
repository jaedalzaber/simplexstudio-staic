"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useId, useMemo, useRef, useState } from "react";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import {
  bookedTables,
  demoDays,
  demoTables,
  demoTimes,
  demoVenue,
  guestLimits,
  tableStatus,
  type DemoSlot,
  type DemoTable,
  type TableStatus,
} from "@/content/booking-demo";
import { TablePlan } from "./table-plan";
import styles from "./booking.module.css";

// three.js and the room load only when a visitor first asks for the 3D view.
const RoomView = dynamic(() => import("./room-view"), { ssr: false, loading: () => <div className={styles.roomPending} /> });

type Step = "choose" | "confirmed";

const ease = [0.16, 1, 0.3, 1] as const;
const firstSlot: DemoSlot = { guests: 2, day: 1, time: 3 };
const guestLabel = (guests: number) => `${guests} ${guests === 1 ? "guest" : "guests"}`;
const tableById = (id: string) => demoTables.find((item) => item.id === id)!;

function statusesFor(slot: DemoSlot): Record<string, TableStatus> {
  const booked = bookedTables(slot.day, slot.time);
  return Object.fromEntries(demoTables.map((item) => [item.id, tableStatus(item, slot.guests, booked)]));
}

function statusLabel(item: DemoTable, status: TableStatus) {
  if (status === "available") return "Available";
  if (status === "booked") return "Booked";
  return `For ${Math.max(1, item.seats - 2)}–${item.seats}`;
}

/**
 * Guests, day and time → available tables → table details → sample confirmation.
 * The floor plan and 3D room are pointer shortcuts; the table list offers every
 * choice to keyboard and screen reader users. Status is shown by pattern and
 * text, not colour alone. Nothing is sent anywhere.
 */
export function TableDemo() {
  const [slot, setSlot] = useState(firstSlot);
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("choose");
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [roomRequested, setRoomRequested] = useState(false);
  const [roomUnavailable, setRoomUnavailable] = useState(false);
  const [message, setMessage] = useState("");
  // Set by actions that remove the focused control; the next heading to mount takes focus.
  const moveFocus = useRef(false);
  const id = useId();

  const statuses = useMemo(() => statusesFor(slot), [slot]);
  const table = selected ? tableById(selected) : undefined;
  const open = demoTables.filter((item) => statuses[item.id] === "available").length;
  const day = demoDays[slot.day].label;
  const time = demoTimes[slot.time];
  const summary = message || `${open} of ${demoTables.length} tables available for ${guestLabel(slot.guests)} on ${day} at ${time}.`;

  function changeSlot(patch: Partial<DemoSlot>) {
    const next = { ...slot, ...patch };
    setSlot(next);
    if (selected && statusesFor(next)[selected] !== "available") {
      setSelected(null);
      setMessage(`Table ${tableById(selected).number} isn’t available for ${guestLabel(next.guests)} on ${demoDays[next.day].label} at ${demoTimes[next.time]}. Choose another table.`);
    } else {
      setMessage("");
    }
  }

  function pick(tableId: string) {
    const item = tableById(tableId);
    const status = statuses[tableId];
    if (status === "available") {
      setSelected(tableId);
      setStep("choose");
      setMessage(`Table ${item.number} selected: ${item.area.toLowerCase()}, ${item.seats} seats.`);
    } else {
      setMessage(status === "booked"
        ? `Table ${item.number} is booked on ${day} at ${time}. Choose an available table.`
        : `Table ${item.number} seats ${item.seats}, so it isn’t offered for ${guestLabel(slot.guests)}.`);
    }
  }

  function showView(next: "2d" | "3d") {
    setView(next);
    if (next === "3d") setRoomRequested(true);
  }

  function confirm() {
    moveFocus.current = true;
    setStep("confirmed");
    setMessage("");
  }

  function restart() {
    moveFocus.current = true;
    setSelected(null);
    setStep("choose");
    setMessage("");
  }

  const focusOnMount = (node: HTMLElement | null) => {
    if (node && moveFocus.current) {
      moveFocus.current = false;
      node.focus();
    }
  };

  const path = ["Party and time", "Table", "Details", "Confirmation"];
  const current = step === "confirmed" ? 3 : table ? 2 : 1;

  return (
    <div className={styles.demo}>
      <div className={styles.stageColumn}>
        <div className={styles.stageBar}>
          <div className={styles.viewSwitch} role="group" aria-label="Layout view">
            <button type="button" aria-pressed={view === "2d"} onClick={() => showView("2d")}>Floor plan</button>
            <button type="button" aria-pressed={view === "3d"} disabled={roomUnavailable} onClick={() => showView("3d")}>3D view</button>
          </div>
          <span className={styles.venue}>{demoVenue.name}</span>
        </div>

        <div className={styles.stage} data-view={view}>
          <div className={styles.planWrap} hidden={view !== "2d"}>
            <TablePlan statuses={statuses} selected={selected} onSelect={pick} />
          </div>
          {roomRequested && !roomUnavailable && (
            <div className={styles.roomWrap} hidden={view !== "3d"}>
              <RoomView
                statuses={statuses}
                selected={selected}
                onPick={pick}
                onUnavailable={() => {
                  setRoomUnavailable(true);
                  setView("2d");
                  setMessage("The 3D view isn’t available in this browser, so the floor plan is shown.");
                }}
              />
            </div>
          )}
        </div>

        <ul className={styles.legend} aria-hidden="true">
          <li data-status="available">Available</li>
          <li data-status="booked">Booked</li>
          <li data-status="selected">Selected</li>
          <li data-status="unsuitable">Not for your party</li>
        </ul>
      </div>

      <div className={styles.panel}>
        <ol className={styles.path} aria-label="Your booking">
          {path.map((label, index) => (
            <li key={label} data-done={index < current || undefined} aria-current={index === current ? "step" : undefined}>{label}</li>
          ))}
        </ol>

        {step === "confirmed" && table ? (
          <motion.div
            key="confirmed"
            className={styles.confirmation}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className={styles.confirmIcon} aria-hidden="true"><CheckIcon /></span>
            <h4 ref={focusOnMount} tabIndex={-1}>Sample confirmation</h4>
            <p>Table {table.number} at {demoVenue.name} for {guestLabel(slot.guests)}, {day} at {time}.</p>
            <dl className={styles.facts}>
              <div><dt>Table</dt><dd>{table.number} · {table.area}</dd></div>
              <div><dt>Guests</dt><dd>{slot.guests}</dd></div>
              <div><dt>Day</dt><dd>{day}</dd></div>
              <div><dt>Time</dt><dd>{time}</dd></div>
            </dl>
            <button type="button" className={styles.secondaryButton} onClick={restart}>Start again</button>
          </motion.div>
        ) : (
          <>
            <h4 ref={focusOnMount} tabIndex={-1} className={styles.visuallyHidden}>Book a table</h4>
            <div className={styles.controls}>
              <div className={styles.control}>
                <span className={styles.controlLabel} id={`${id}-guests`}>Guests</span>
                <div className={styles.stepper} role="group" aria-labelledby={`${id}-guests`}>
                  {/* aria-disabled keeps focus on the button at either limit. */}
                  <button type="button" aria-label="Fewer guests" aria-disabled={slot.guests <= guestLimits.min} onClick={() => slot.guests > guestLimits.min && changeSlot({ guests: slot.guests - 1 })}><MinusIcon /></button>
                  <output aria-live="off">{slot.guests}</output>
                  <button type="button" aria-label="More guests" aria-disabled={slot.guests >= guestLimits.max} onClick={() => slot.guests < guestLimits.max && changeSlot({ guests: slot.guests + 1 })}><PlusIcon /></button>
                </div>
              </div>
              <label className={styles.control}>
                <span className={styles.controlLabel}>Day</span>
                <select value={slot.day} onChange={(event) => changeSlot({ day: Number(event.target.value) })}>
                  {demoDays.map((option, index) => <option key={option.label} value={index}>{option.label}</option>)}
                </select>
              </label>
              <label className={styles.control}>
                <span className={styles.controlLabel}>Time</span>
                <select value={slot.time} onChange={(event) => changeSlot({ time: Number(event.target.value) })}>
                  {demoTimes.map((option, index) => <option key={option} value={index}>{option}</option>)}
                </select>
              </label>
            </div>

            <p className={styles.status} role="status">{summary}</p>

            <fieldset className={styles.tables}>
              <legend className={styles.visuallyHidden}>Choose a table</legend>
              <div className={styles.tableList} data-lenis-prevent>
                {demoTables.map((item) => {
                  const status = statuses[item.id];
                  return (
                    <label key={item.id} className={styles.tableOption} data-status={status}>
                      <input
                        type="radio"
                        name={`${id}-table`}
                        value={item.id}
                        checked={selected === item.id}
                        disabled={status !== "available"}
                        onChange={() => pick(item.id)}
                      />
                      <span className={styles.tableBadge} aria-hidden="true">{item.number}</span>
                      <span className={styles.tableText}>
                        <strong>Table {item.number}</strong>
                        <small>{item.seats} seats · {item.area}</small>
                      </span>
                      <span className={styles.tableStatus} data-status={status}>{statusLabel(item, status)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {table && (
              <motion.div
                key={table.id}
                className={styles.details}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease }}
              >
                <div className={styles.detailsHead}>
                  <h4>Table {table.number}</h4>
                  <span className={styles.tableStatus} data-status="available">Available</span>
                </div>
                <dl className={styles.facts}>
                  <div><dt>Seating area</dt><dd>{table.area}</dd></div>
                  <div><dt>Seats</dt><dd>{table.seats}</dd></div>
                  <div><dt>Your booking</dt><dd>{guestLabel(slot.guests)} · {day} {time}</dd></div>
                </dl>
                <button type="button" className={styles.primaryButton} onClick={confirm}>Preview reservation</button>
              </motion.div>
            )}
          </>
        )}

        <p className={styles.disclosure}>Interactive demo with sample availability. No real reservation is made.</p>
      </div>
    </div>
  );
}
