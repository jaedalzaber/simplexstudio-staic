# Booking Systems Page Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build `/services/booking-system` as the Booking Systems solution page, including a small restaurant demo where visitors choose a table in a 2D plan or a 3D view.

**Architecture:** A static server page composed of section components, in the same pattern as the ecommerce and real estate pages. Copy and sample data live in `content/booking.ts`. Shared layout comes from `components/sections/solution/`. The demo is one client component: it works fully in 2D (SVG plan plus an accessible table list) and loads the 3D room only when the visitor switches to it, reusing the light-baking approach from the real estate site view.

**Tech Stack:** Next.js 16.4 App Router, React 19, TypeScript, CSS Modules, Motion, GSAP, `three` (already a dependency).

**Spec:** `docs/superpowers/specs/2026-10-25-booking-solution-content.md`

## Global Constraints

- Keep the `/services/booking-system` route. The page stays fully static under `ensureStatic = "navigation"`.
- Name no underlying booking product. Present payments, deposits, reminders, calendar sync, and other integrations as scope options, never as features every project gets.
- No invented clients, figures, testimonials, prices, or timelines. Omit the Selected work section until approved projects are supplied.
- The demo collects no personal details and makes no network requests. It always shows: "Interactive demo with sample availability. No real reservation is made."
- Use "Discuss your project" for the studio enquiry. Booking language ("Reserve", "Preview reservation") appears only inside the example interfaces.
- No horizontal page overflow at 390px or 1440px, including while anything animates. Keep reduced-motion support and visible keyboard focus.
- Selection must never depend on hover, pointer, colour, or WebGL alone: every choice in the plan or 3D view is also available in the table list.

## Inputs Needed

| Input | Needed for | If missing |
| --- | --- | --- |
| Supplied images 1–11 (forms, page builder, interface references). They are not in the repository yet. Save them to `docs/superpowers/assets/booking/`. | Tasks 8 and 9: interface previews based on the real software | Build the previews from the spec's descriptions and flag them for review |
| A fictional restaurant name for the example business, checked against obvious real brands | Hero, demo, and all interface previews | Use "Example Restaurant" |
| Two or three approved client projects with contribution captions | Task 1 work slot | The section stays hidden |
| The modules offered for each proposed scope | Captions in Task 8 | Keep captions to the spec's wording |

## File Map

```text
app/(site)/services/booking-system/page.tsx        page, metadata, section order
content/booking.ts                                  copy, business types, interface captions, FAQs
content/booking-demo.ts                             restaurant layout and sample availability (pure)
components/sections/booking/                        hero, work, flows, demo, management, builders, channels, team
components/sections/booking/booking.module.css      section styles
components/sections/booking/table-demo.tsx          demo controls, list, plan, details, confirmation (client)
components/sections/booking/table-plan.tsx          2D SVG plan
components/sections/booking/room-view.tsx           3D view wrapper, loaded on request (client)
components/sections/booking/room-3d/                room scene: models, labels, camera
components/sections/solution/solution-enquiry.tsx   shared closing enquiry and FAQ (Task 3)
lib/three/bake.ts, lib/three/noise.ts               moved from real-estate/site-3d (Task 7)
tests/booking-demo.test.ts                          availability rules
```

## Review Focus

- **Demo flow:** guests, day, and time → available tables → table details → preview reservation → sample confirmation, in both 2D and 3D, by mouse, touch, and keyboard.
- **Loading:** no 3D code or WebGL context is created until "3D" is chosen; when WebGL 2 is unavailable, the 2D plan and list remain with a short notice.
- **Touch:** one-finger swipes over the 3D view scroll the page. Two fingers or the zoom and reset buttons move the camera.
- **Truthfulness:** captions describe scope options; nothing implies live venue data or universal integrations.

---

### Task 1: Route, solution entry, and page shell

**Files:**
- Create: `app/(site)/services/booking-system/page.tsx`
- Modify: `content/solutions.ts`
- Create: `components/sections/booking/work.tsx`

**Interfaces:**
- `BookingSystemPage` composes, in order: Hero, Work, Flows, Demo, Management, Builders, Channels, Team, Enquiry.
- `Work` renders nothing when `content/booking.ts` exports an empty `projects` array.

- [x] Mark the `booking-system` solution `ownPage: true`; the generic `[slug]` page then skips it. Rename it "Booking Systems". Rewrite its summary and highlights to the spec's positioning: appointments, reservations, spaces, and seats; 2D and 3D selection; customer management; websites and apps. Remove the current wording that presents live availability, payments, and calendar sync as standard.
- [x] Add the page with `RevealScope`, `SkyFade`, and the shared `solution.module.css` page class, using the spec's SEO title and description. Robots follow `pages.services.status`, as on the other solution pages.
- [x] Add the work slot (shared project grid, external links in a new tab, preview images only) with `projects: []`, so it ships hidden.
- [x] Check the header's Solutions menu and the home Solutions section show "Booking Systems" and link to the route.

### Task 2: Content and demo data

**Files:**
- Create: `content/booking.ts`
- Create: `content/booking-demo.ts`
- Create: `tests/booking-demo.test.ts`

**Interfaces:**
- `content/booking.ts` exports all copy from the spec: hero, hero anchor links, six business types, management views, builder views, channel examples, process steps, and five FAQs, with no edits beyond the spec.
- `content/booking-demo.ts` exports:
  - `DemoTable { id; number; seats; area: "Window" | "Main room" | "Booth" | "Bar side"; shape: "square" | "rect" | "booth"; x; y; width; height; rotation }` for 10 tables in plan units.
  - `demoDays` as relative labels ("Today", "Tomorrow", "In 2 days"), so no real dates are rendered and nothing differs between server and browser.
  - `demoTimes` from 18:00 to 21:30 in 30-minute steps.
  - `tableStatus(table, { guests, day, time }): "available" | "booked" | "unsuitable"`. A table suits a party if `seats >= guests` and `seats <= guests + 2`; "booked" comes from a deterministic hash of table, day, and time.

- [x] Keep tables rectangular or booth-shaped so the existing box-based light baking (Task 7) applies; round tables would need a new geometry path.
- [x] Test that `tableStatus` is deterministic, respects the capacity rule, and leaves at least two suitable available tables for every guest count from 1 to 8 at every day and time. Run `pnpm test`.

### Task 3: Shared closing enquiry

**Files:**
- Create: `components/sections/solution/solution-enquiry.tsx`
- Modify: `components/sections/ecommerce/questions.tsx`, `components/sections/real-estate/questions.tsx`

**Interfaces:**
- `SolutionEnquiry({ eyebrow, title, body, questions })` renders the existing layout: intro, "Discuss your project", WhatsApp from `content/contact.ts`, and `FaqList`.

- [x] Extract the component (this will be its third copy). Switch the two existing pages to it, keeping their current copy word for word, and compare before-and-after screenshots of both pages.
- [x] Use it for the booking page with the spec's heading, body, and five FAQs.

### Task 4: Hero with a static booking preview

**Files:**
- Create: `components/sections/booking/hero.tsx`
- Create: `public/images/booking/room-preview.webp` (from Task 7)

**Interfaces:**
- Primary link "Discuss your project" to the contact page; secondary "Try the booking demo" to `#demo`; the four supporting links jump to the Demo, Management, and Channels sections.

- [x] Compose the preview from a room image (a grey placeholder until Task 7 produces the still), a decorative reservation panel in HTML ("Table 7 · 4 guests · Tomorrow 19:30"), and a smaller staff schedule card behind it. Mark the composition `aria-hidden` and describe it in the surrounding copy.
- [x] Keep it static. The interactive demo lives only in its own section.

### Task 5: Booking flows for different businesses

**Files:**
- Create: `components/sections/booking/flows.tsx`
- Modify: `components/ui/icons.tsx` (six line icons: stay, desk, restaurant, clinic, consultation, transport)

- [x] Render the six business types as a compact three-column grid of cards (icon, business, what customers choose), one column on mobile.
- [x] Close with one line stating that rules and integrations are confirmed per project, and that maps or 3D are used where location matters.

### Task 6: Restaurant demo in 2D

**Files:**
- Create: `components/sections/booking/demo.tsx` (section wrapper)
- Create: `components/sections/booking/table-demo.tsx`
- Create: `components/sections/booking/table-plan.tsx`

**Interfaces:**
- `TableDemo` state: `{ guests, day, time, tableId | null, step: "choose" | "details" | "confirmed", view: "2d" | "3d" }`.
- `TablePlan({ tables, statuses, selected, onSelect })`: pointer shortcut; `aria-hidden`.

- [x] Controls: a guests stepper (1–8) with `−`/`+` buttons and a live count; day and time as native radio groups styled as chips.
- [x] List: tables as native radio inputs grouped by area, each showing table number, seats, area, and status in text. Booked and unsuitable tables are disabled, with the reason given.
- [x] Plan: walls, entrance, bar, kitchen pass, window wall, and tables with seat markers. Available tables are outlined, booked ones hatched with a "Booked" label, and the selected one filled. Changing guests, day, or time updates statuses and clears a selection that no longer fits, saying so.
- [x] Details: table number, seats, area, day, and time, plus "Preview reservation". The confirmation shows the summary, the disclosure line, and "Start again". No form fields.
- [x] A polite live region announces each change. Place the visible disclosure under the demo.
- [x] Add the "2D | 3D" toggle (`aria-pressed`); 3D is wired in Task 7.

### Task 7: 3D room view, loaded on request

**Files:**
- Move: `components/sections/real-estate/site-3d/bake.ts` and `noise.ts` to `lib/three/`
- Modify: real estate imports
- Create: `components/sections/booking/room-view.tsx`
- Create: `components/sections/booking/room-3d/scene.ts`
- Create: `components/sections/booking/room-3d/models.ts`

**Interfaces:**
- `room-view.tsx` is imported with `next/dynamic` (`ssr: false`) only after the visitor first chooses 3D. It takes the same `tables`, `statuses`, `selected`, and `onSelect` as `TablePlan`, plus a `fallback`.
- `createRoomScene({ container, labels, tables, state, reducedMotion, signal, onPick })` returns `{ update(state), zoom(direction), resetView(), dispose() }`.

- [x] Move the light baker and noise helpers into `lib/three/`. Pass the sun and sky settings that `bake.ts` currently imports from `real-estate/site-3d/layout.ts` as options. Confirm the real estate 3D view renders unchanged.
- [x] Build the room from boxes: floor, low cut-away walls on the near sides, bar, booths, tables with chairs, and planters. Bake warm interior light; add emissive pendant lamps. Keep it to the one furnished room from the spec.
- [x] Reuse the real estate interaction rules:
  - Fail quietly to the 2D plan when WebGL 2 is unavailable.
  - One-finger touch scrolls the page; two fingers turn and zoom.
  - A plain mouse wheel scrolls the page; Ctrl/⌘ plus the wheel zooms.
  - Zoom and reset buttons; only render while visible; instant camera moves under reduced motion.
- [x] Overlay HTML table labels projected from 3D positions. Selection uses the same state as 2D, so switching views keeps the chosen table.
- [x] Capture a still of the room in headless Chrome for `public/images/booking/room-preview.webp` and use it in the hero (Task 4).

### Task 8: Booking management and customer records

**Files:**
- Create: `components/sections/booking/management.tsx`
- Create: `components/sections/booking/interface-previews.tsx`

- [x] Show three large interface views (booking calendar, customer record, availability and resources), recreated in HTML and CSS from the supplied software (images 1–7) using the example restaurant's data. No internal branding, unrelated imagery, or real customer data. Mark them `aria-hidden`; each has a visible caption from the spec.
- [x] On mobile, show one view at a time with tabs rather than shrinking all three.
- [x] Add one line stating that payments, reminders, calendar connections, and reporting are agreed per project.

### Task 9: Custom forms and business websites

**Files:**
- Create: `components/sections/booking/builders.tsx`

- [x] Show two large pairs: form editor beside the finished booking form (service choice, custom questions, date and time, customer details), and page editor beside the finished service page. Use the same restaurant throughout.
- [x] Include the confirmation and follow-up step in the form pair, so it reads as part of the booking journey.

### Task 10: Web, mobile, and on-site channels

**Files:**
- Create: `components/sections/booking/channels.tsx`

- [x] Compose a website, phone, and on-site screen showing the same booking. Label the kiosk as interactive self-service and the display as information only.
- [x] Captions for customer apps, staff tools, and on-site screens; native apps and hardware are described as options confirmed per project.

### Task 11: In-house team and closing enquiry

**Files:**
- Create: `components/sections/booking/team.tsx`

- [x] Show the spec's heading and body with the shared `ProcessSteps` (four steps).
- [x] Add the closing `SolutionEnquiry` from Task 3.

### Task 12: Verification and documentation

**Files:**
- Modify: `components/sections/README.md`, `docs/architecture.md`, the spec's status line

- [x] Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`. Expected: all pass, with `/services/booking-system` prerendered as static.
- [x] In headless Chrome at 1440px and 390px:
  - Capture each section.
  - Sample the page width over ten seconds during animation; it must stay at the viewport width.
  - Walk the demo flow in 2D and 3D.
  - Confirm no 3D chunk loads before the toggle (network log).
  - Repeat with WebGL disabled and with reduced motion.
- [x] Complete the demo using only the keyboard; check focus order, announcements, and that disabled tables state their reason.
- [x] Update the section README, the architecture notes (route, demo data, shared `lib/three`), and the spec status.

---

## Implementation notes (25 October 2026)

All tasks are done. Where the build differs from the steps above:

- **Demo data (Task 2):** tables carry chairs per side or a `booth` flag instead of a shape name and rotation. Days are fixed sample weekdays (Thursday to Saturday) rather than relative labels. `bookedTables(day, time)` frees a suitable table whenever a party size would otherwise have none, so the test checks for at least one available table per party size; with a single 8-seat table, two is not possible for 7–8 guests.
- **Controls (Task 6):** day and time are native selects, which keep the panel compact. Table details appear under the list instead of replacing it, so arrow keys in the radio group keep working.
- **Light baking (Task 7):** `lib/three/bake.ts` now takes `lighting` (each scene passes its own) and `occluders` (boxes that shade without being drawn), so the room floor carries the shadows of the furniture.
- **Management (Task 8):** the three views are tabs at every width, one large view at a time.
- **Team (Task 11):** a single link to the capabilities page, since every capability currently links there.
- **Hero still (Task 4):** `public/images/booking/room-preview.webp`; its README says how it was captured.
