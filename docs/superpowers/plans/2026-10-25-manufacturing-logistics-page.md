# Manufacturing & Logistics Page Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace the blank `/services/industrial-erp` page with the Manufacturing & Logistics solution page, including an inline factory demo that links a 2D or 3D factory view to simulated work-order records.

**Architecture:** A static server page composed of section components, like the booking and real estate pages. Copy lives in `content/manufacturing.ts`; one sample order and its factory records live in `content/factory-demo.ts`, so every view (hero, configuration, ERP, warehouse, demo, training) uses the same product, references and quantities. Only the factory demo uses WebGL, and only on request. The product, warehouse and training visuals are isometric SVG drawings and HTML interface previews.

**Tech Stack:** Next.js 16.4 App Router, React 19, TypeScript, CSS Modules, Motion, GSAP, `three`.

**Spec:** `docs/superpowers/specs/2026-10-25-manufacturing-logistics-content.md`

## Audit of the spec

| Finding | Resolution |
| --- | --- |
| The Rockwell Emulate3D link is malformed (`…emulate3d-digital-twin.htmlEmulate3D.html`). The server tolerates it, but it is not the canonical URL. | Corrected to `…/emulate3d-digital-twin.html` in the spec. |
| The Tata Elxsi source (a MOGEN Expo 2026 event page) blocks automated requests and could not be found in search, so its claims cannot be checked. | Replaced with Tata Elxsi's Industry 4.0 services page, which describes digital manufacturing, IoT and AR/VR training. |
| SAP logistics returns 403 to scripts but is live (confirmed by search). The other eight sources load and match their descriptions. | No change. |
| The spec calls for 3D in three places (configured product, warehouse rack, factory twin). Three WebGL scenes would be heavy and repeat the same point. | One WebGL scene: the factory demo, loaded on request. The configured product and warehouse location are isometric SVG drawings that read as 3D without WebGL. |
| Several FAQ answers are written as instructions to the team ("Review the available APIs…"). | Rewritten as answers to the visitor, keeping the same commitments. |
| No sample references are defined, but the spec requires consistent numbers across views. | Defined once in `content/factory-demo.ts` (below). |
| Skywings media, brand spelling and ERP modules are unconfirmed; no URL. | Built with grey placeholders and the drafted caption only. The ERP view is the largest of the three. Nothing beyond the brief is claimed. |
| "Link to capability pages for technical detail": every capability currently links to `/expertise`. | One link to `/expertise`. |
| SEO title includes the site name, which the layout's title template already adds. | `title: "Manufacturing ERP, Logistics Software & Digital Twins"`. |

## Global Constraints

- Keep the `/services/industrial-erp` route. The page stays fully static.
- Separate delivered work (Skywings, per the user's brief), offered custom scope, and illustrative demos. The factory demo always shows "Factory digital twin demo · Simulated data"; the training showcase always shows "Illustrative training example".
- No invented clients, testimonials, results, OEE, throughput, savings, delivery estimates, or certifications. Sample prices on the quote are marked as sample data.
- Barcode scanning, carrier integrations, GPS, route planning, machine telemetry, automatic BOM generation and integrations with existing ERP are presented as scoped options. The approval step before production is always shown.
- No horizontal overflow at 390px or 1440px, including during animation. Reduced motion and visible keyboard focus throughout.
- Every choice in the 2D plan or 3D view is also available in the area list.

## Sample data (single source)

- **Product:** Equipment enclosure EN-1200, 1200 × 800 × 300 mm, 1.5 mm mild steel, single solid door, RAL 7035 powder coat, gland plate. Quantity 12.
- **References:** quote Q-2417, approved specification SPEC-2417 rev B, sales order SO-2417, work order WO-3108, shipment SH-5520.
- **Parts per order:** body shells, doors, mounting plates, gland plates, hinge kits HK-20, door gasket kits GS-1200, quarter-turn locks L-3 (12 each), from six 2500 × 1250 mm sheets.
- **Factory areas:** A1 Materials, A2 Cutting, A3 Fabrication, A4 Assembly, A5 Inspection, A6 Dispatch, laid out as a U-shaped flow.
- **Scenarios:** *normal* (WO-3108 in fabrication, 8 of 12; later steps queued with materials ready) and *material shortage* (only 6 of 12 gasket kits; assembly waits, inspection and dispatch on hold, PO-7782 raised).
- **Other jobs:** one current job per area, so each area has something to show (WO-3114, WO-3111, WO-3108, WO-3099, WO-3105, WO-3102 with shipment SH-5517).
- **Warehouse:** hinge kits HK-20 at location B-04-2, reserved for WO-3108.

## File Map

```text
app/(site)/services/industrial-erp/page.tsx              page, metadata, section order
content/manufacturing.ts                                  copy, captions, capabilities, FAQ
content/factory-demo.ts                                   sample order, areas, jobs, scenarios (pure)
tests/factory-demo.test.ts                                scenario rules
components/sections/manufacturing/                        sections, isometric drawings, demo, 3D factory
components/sections/solution/interface-tabs.tsx (+ css)   dark-band tabs, moved from booking
components/sections/solution/app-window.tsx (+ css)       interface window chrome, moved from booking
components/sections/solution/scene-view.module.css        3D label chips and controls, moved from booking
lib/three/stage.ts                                        renderer, camera, picking, labels, render loop
public/images/manufacturing/factory-preview.webp          still of the factory demo for the hero
```

## Review Focus

- **Consistency:** the same references, quantities and states appear in the hero, configuration, ERP, warehouse and demo.
- **Demo:** select an area in the list, plan or 3D view; follow WO-3108; switch scenarios; the views and text agree, and the reason for the exception is stated in words.
- **Booking regression:** after the shared stage, tabs and window move, the booking page looks and behaves as before.

---

### Task 1: Shared 3D stage and overlays

**Files:**
- Create: `lib/three/stage.ts`, `components/sections/solution/scene-view.module.css`
- Modify: `components/sections/booking/room-3d/scene.ts`, `components/sections/booking/room-view.tsx`
- Delete: `components/sections/booking/room-view.module.css`

**Interfaces:**
- `createStage(options)` owns the WebGL 2 check (`WebGLUnavailable`), renderer, camera, OrbitControls with the touch and wheel rules, flights, eased values (`aim`), picking against `{ id, bounds }` targets, hover, projected labels, on-demand rendering, resize and visibility observers, and disposal.
- Label chips use `data-tone="ok" | "warn" | "muted" | "outline"` and `data-selected`, so each page maps its own statuses.

- [x] Extract the stage from the booking room scene and rebuild that scene on it. Run the booking demo walkthrough (2D, 3D, no WebGL, reduced motion, keyboard) and compare screenshots.

### Task 2: Shared interface tabs and window

**Files:**
- Create: `components/sections/solution/interface-tabs.tsx` (+ `.module.css`), `components/sections/solution/app-window.tsx` (+ `.module.css`)
- Modify: booking `management.tsx`, `interface-previews.tsx`, `booking.module.css`, `previews.module.css`
- Delete: `components/sections/booking/management-tabs.tsx`

- [x] Move the dark-band tabs and the window chrome (bar, dots, navigation, action, record facts, switch) out of the booking folder; the window navigation becomes a prop. Re-screenshot booking management and builders.

### Task 3: Route, solution entry, content and demo data

**Files:**
- Create: `app/(site)/services/industrial-erp/page.tsx`, `content/manufacturing.ts`, `content/factory-demo.ts`, `tests/factory-demo.test.ts`
- Modify: `content/solutions.ts`

- [x] Rename the solution "Manufacturing & Logistics", mark it `ownPage`, and give it a summary and highlights that keep ERP explicit. Keep the slug.
- [x] Add the page with the spec's metadata (title per the audit) and robots following the Services status.
- [x] Tests: area ids unique and in route order; every job's current area is on its route; the normal scenario has no shortages; in the shortage scenario only WO-3108's assembly waits and its later steps are on hold; area summaries are deterministic.

### Task 4: Hero

**Files:** `components/sections/manufacturing/hero.tsx`

- [x] H1, body, CTAs ("Discuss your project", "Explore the factory demo" to `#factory-demo`) and five supporting links.
- [x] Visual: a still of the factory demo (Task 10) beside a readable WO-3108 work-order panel with its six-step route. Static; text is visible before any demo loads.

### Task 5: Skywings showcase

**Files:** `components/sections/manufacturing/skywings.tsx`

- [x] The spec's H2 and caption; three captioned views: manufacturing software (wide, first), customer experience, product presentation. Grey placeholders until media is supplied; image slots in `content/manufacturing.ts`.

### Task 6: Configuration to production planning

**Files:** `components/sections/manufacturing/configuration.tsx`, `iso.tsx`, `product-drawing.tsx`

- [x] The six-step workflow as one compact strip, with the approval step marked.
- [x] Visual: the configured EN-1200 as an isometric drawing with dimensions, beside quote Q-2417 and its material list for 12 units. Same references as the demo.
- [x] Three outcome captions and the note on validated rules and approval.

### Task 7: Custom manufacturing ERP

**Files:** `components/sections/manufacturing/erp.tsx`, `erp-previews.tsx`, `previews.module.css`

- [x] Dark band with tabs for three views: materials and purchasing, planning and work orders (with a shop-floor tablet), quality and traceability.
- [x] One line on integrations and modules agreed per project; one line on example industries.

### Task 8: Warehouse and logistics

**Files:** `components/sections/manufacturing/logistics.tsx`, `warehouse-drawing.tsx`

- [x] Three stages (receive and store, prepare and dispatch, transport and delivery).
- [x] Visual: an isometric warehouse with location B-04-2 selected beside its stock panel, and the SH-5517 shipment record. No map and no moving vehicles.
- [x] Scope note: scanning, carriers, driver apps, GPS and routing are modules; this is software, not freight handling.

### Task 9: Factory demo in 2D

**Files:** `components/sections/manufacturing/demo.tsx`, `factory-demo.tsx`, `factory-plan.tsx`

- [x] Toolbar: Floor plan or 3D view, and the "Factory digital twin demo · Simulated data" label.
- [x] Panel: scenario switch, "Follow order WO-3108" toggle, a status line, the six areas as native radios, and area details (identifier, stage, status, current jobs, materials, next step, and WO-3108's step and parts when it passes through).
- [x] Route strip under the view with WO-3108's six steps and their states in text.
- [x] 2D plan: hall, areas, simplified equipment, aisle, and the route when following.

### Task 10: Factory demo in 3D

**Files:** `components/sections/manufacturing/factory-view.tsx`, `factory-3d/models.ts`, `factory-3d/scene.ts`

- [x] Box-built hall with cut-away near walls, columns, floor markings, and equipment per area: racks, laser cutter, press brake and welding cells, workbenches, inspection table, pallets and dock doors. Baked light, one mesh per area for highlighting.
- [x] Area pads and labels with status tones; route arrows when following. Loaded only on request; falls back to the plan without WebGL 2.
- [x] Capture `public/images/manufacturing/factory-preview.webp` for the hero.

### Task 11: Training showcase

**Files:** `components/sections/manufacturing/training.tsx`, `training-previews.tsx`

- [x] "Illustrative training example" label, the four-step learning sequence, a VR step view, a trainer dashboard, and a tablet AR view marked as a proposed extension.
- [x] Applications and the note that content and assessment criteria are agreed with the client's experts.

### Task 12: Capabilities, delivery and enquiry

**Files:** `components/sections/manufacturing/capabilities.tsx`, `questions.tsx`

- [x] Seven capabilities as a compact list, the four-step process, the note on shared assets, and one link to capabilities.
- [x] `SolutionEnquiry` with the spec's heading, body and five rewritten FAQs.

### Task 13: Verification and documentation

- [x] `pnpm typecheck`, lint, `pnpm test`, `pnpm build` (route prerendered as static).
- [x] Headless Chrome at 1440px and 390px: section screenshots; page width sampled while scrolling; demo walkthrough in 2D and 3D, by keyboard, without WebGL and with reduced motion; no 3D chunk before the toggle.
- [x] Booking page regression check (Tasks 1–2).
- [x] Update `components/sections/README.md`, `docs/architecture.md` and the spec's status line.

---

## Implementation notes (25 October 2026)

All tasks are done. Where the build differs from the steps above:

- **Shared code (Tasks 1–2):** `lib/three/stage.ts`, `interface-tabs`, `app-window` and `scene-view.module.css` now serve both the booking and manufacturing pages. The booking demo was re-run afterwards in 2D, 3D, without WebGL and by keyboard, with the same results as before. The real estate view keeps its own scene code.
- **Order route (Task 9):** the route strip under the view doubles as six buttons that select each area, so the order and the areas can be explored from either place. The followed order is shown by default.
- **3D route (Task 10):** chevrons along the two aisle lanes rather than a line through each area, so the route never crosses equipment.
- **ERP shortage (Task 7):** the materials view shows a shortage of locks for other jobs, so WO-3108 stays in its normal state everywhere except the demo's shortage scenario.
- **Hero still:** `public/images/manufacturing/factory-preview.webp`, with a README on how it was captured.
