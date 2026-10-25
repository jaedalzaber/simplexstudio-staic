# Page sections

Sections are grouped by page:

- `home/`: hero, intro and stats, showreel, stacked case studies, challenges
  band, client strip, process, solutions showcase, services band, and FAQ.
- `work/`: the filterable case-study grid, the project card, and the case
  study page styles.
- `about/`: hover-reveal hero, story, impact band, photo gallery, values, and
  team carousel.
- `blog/`: the filterable, paginated Insights listing, post cards, and the
  article page (body renderer, table of contents, reading progress).
- `ecommerce/` and `real-estate/`: the solution pages (`/services/ecommerce`,
  `/services/real-estate`), each built from its content strategy in
  `docs/superpowers/specs`. Real estate includes the interactive plot and unit
  selector (`plot-selector.tsx`), which runs on illustrative sample data.
  Its plan is a three.js landscape (`site-view.tsx`, engine in `site-3d/`),
  loaded only near the viewport: box-built homes with light baked in at load,
  painted ground masks turned into satellite-style surfaces by one shader, and
  instanced low-poly trees. Buyers can restyle a home's design, finish, pool
  and solar roof. Without WebGL 2 the flat SVG plan (`site-plan.tsx`) is shown.
- `booking/`: the Booking Systems page (`/services/booking-system`). Its
  restaurant demo (`table-demo.tsx`) runs on sample availability: guests, day
  and time, then a table from the list, the floor plan (`table-plan.tsx`) or
  the 3D room (`room-view.tsx`, engine in `room-3d/`). The 3D room loads only
  when a visitor chooses it, and falls back to the plan without WebGL 2. The
  management, form, website and device previews are HTML recreations for the
  same sample restaurant (`interface-previews.tsx`, `previews.module.css`).
  The Selected work section stays hidden until `projects` in
  `content/booking.ts` has entries.
- `manufacturing/`: the Manufacturing & Logistics page (`/services/industrial-erp`).
  One sample order (`content/factory-demo.ts`) runs through every view. The
  factory demo (`factory-demo.tsx`) links a floor plan (`factory-plan.tsx`) or
  a 3D hall (`factory-view.tsx`, engine in `factory-3d/`, loaded on request) to
  simulated work-area records, with a normal and a material-shortage scenario.
  The configured product, warehouse and training views are isometric SVG
  drawings built from boxes (`iso.tsx`), so only the demo uses WebGL. The
  Skywings images are grey placeholders until project media is supplied.
- `solution/`: shared by solution pages: styles, the animated process steps,
  the closing enquiry with FAQ (`solution-enquiry.tsx`), the dark-band
  interface tabs (`interface-tabs.tsx`), the sample application window
  (`app-window.tsx`), and the label and control styles for inline 3D views
  (`scene-view.module.css`).
- `contact/`: the contact form and page styles.

Add `expertise/`, `services/`, and `pricing/` folders as those pages are
designed.

Pages compose sections. Text and data belong in `content/`; shared controls in
`components/ui/`; layout helpers in `components/layout/`; scroll and motion
helpers in `components/motion/`.
