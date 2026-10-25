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
- `solution/`: styles and the animated process steps shared by solution pages.
- `contact/`: the contact form and page styles.

Add `expertise/`, `services/`, and `pricing/` folders as those pages are
designed.

Pages compose sections. Text and data belong in `content/`; shared controls in
`components/ui/`; layout helpers in `components/layout/`; scroll and motion
helpers in `components/motion/`.
