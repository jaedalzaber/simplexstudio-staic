import assert from "node:assert/strict";
import { test } from "node:test";
import { bookedTables, demoDays, demoTables, demoTimes, fitsParty, guestLimits, tableStatus } from "../content/booking-demo";

const slots = demoDays.flatMap((_, day) => demoTimes.map((__, time) => ({ day, time })));
const guestCounts = Array.from({ length: guestLimits.max - guestLimits.min + 1 }, (_, index) => guestLimits.min + index);

test("availability is deterministic", () => {
  for (const { day, time } of slots) assert.deepEqual([...bookedTables(day, time)], [...bookedTables(day, time)]);
});

test("a table suits parties it seats with at most two chairs spare", () => {
  const booth = demoTables.find((item) => item.seats === 6)!;
  assert.equal(fitsParty(booth, 4), true);
  assert.equal(fitsParty(booth, 6), true);
  assert.equal(fitsParty(booth, 3), false);
  assert.equal(fitsParty(booth, 7), false);
  assert.equal(tableStatus(booth, 7, new Set()), "unsuitable");
  assert.equal(tableStatus(booth, 5, new Set([booth.id])), "booked");
  assert.equal(tableStatus(booth, 5, new Set()), "available");
});

test("every party size has an available table at every day and time", () => {
  for (const { day, time } of slots) {
    const booked = bookedTables(day, time);
    for (const guests of guestCounts) {
      const open = demoTables.filter((item) => tableStatus(item, guests, booked) === "available");
      assert.ok(open.length > 0, `no table for ${guests} on ${demoDays[day].label} at ${demoTimes[time]}`);
    }
  }
});

test("busy evenings show some booked tables", () => {
  const peak = demoTimes.indexOf("19:30");
  for (const day of demoDays.keys()) assert.ok(bookedTables(day, peak).size >= 2, `${demoDays[day].label} 19:30 looks empty`);
});

test("table numbers and ids are unique", () => {
  assert.equal(new Set(demoTables.map((item) => item.id)).size, demoTables.length);
  assert.equal(new Set(demoTables.map((item) => item.number)).size, demoTables.length);
});
