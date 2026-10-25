import assert from "node:assert/strict";
import { test } from "node:test";
import { areaSummary, factoryAreas, jobs, orderSteps, sampleOrder, scenarios, type Scenario } from "../content/factory-demo";

const ids = factoryAreas.map((area) => area.id);

test("areas are unique and listed in flow order", () => {
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(orderSteps("normal").map((step) => step.area), ids);
});

test("every job is on its own route and every area has current work", () => {
  for (const job of jobs) {
    assert.ok(job.route.includes(job.at), `${job.id} is not on its route`);
    assert.deepEqual([...job.route], ids.filter((id) => job.route.includes(id)), `${job.id} route is out of order`);
  }
  for (const id of ids) assert.ok(areaSummary(id, "normal").jobs.length > 0, `${id} has no current job`);
});

test("normal progress has no shortages or held steps", () => {
  for (const id of ids) {
    const summary = areaSummary(id, "normal");
    assert.equal(summary.status, "running");
    assert.ok(summary.materials.every((line) => line.state === "ready"));
  }
  assert.ok(orderSteps("normal").every((step) => step.state !== "waiting" && step.state !== "hold"));
});

test("a shortage stops the followed order at assembly and holds everything after it", () => {
  const steps = orderSteps("shortage");
  const waiting = steps.findIndex((step) => step.state === "waiting");
  assert.equal(steps[waiting].area, "assembly");
  assert.ok(steps.slice(waiting + 1).every((step) => step.state === "hold"));
  assert.deepEqual(steps.slice(0, waiting), orderSteps("normal").slice(0, waiting), "earlier steps are unchanged");
  assert.equal(areaSummary("assembly", "shortage").status, "attention");
  assert.ok(areaSummary("assembly", "shortage").materials.some((line) => line.state === "short"));
});

test("scenarios only change the followed order's records", () => {
  for (const id of ids) {
    const [normal, short] = (["normal", "shortage"] as Scenario[]).map((scenario) => areaSummary(id, scenario));
    assert.deepEqual(normal.jobs, short.jobs, `${id} jobs differ between scenarios`);
  }
  assert.equal(scenarios.length, 2);
  assert.equal(jobs.filter((job) => job.id === sampleOrder.workOrder).length, 1);
});
