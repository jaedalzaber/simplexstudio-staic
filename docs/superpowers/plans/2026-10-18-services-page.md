# Services Page Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build and preview the responsive `/services` page from the approved design spec and supplied Page 2 artwork.

**Architecture:** Keep the route as a Next.js server page and place carousel state in a small client component. Reuse standalone supplied SVGs, extract the project and product illustrations embedded in the supplied composite SVGs, and style the page in one route-local CSS Module.

**Tech Stack:** Next.js 16.4 App Router, React 19, TypeScript, CSS Modules, supplied SVG/PNG artwork.

**Spec:** `docs/superpowers/specs/2026-10-18-services-page-design.md`

## Global Constraints

- Preserve the existing shared header, metadata helper, design tokens, and static marketing route configuration.
- Recreate all copy, metrics, headings, and controls as HTML; do not use the full-page or section screenshot as page content.
- Do not introduce client claims or outcome metrics absent from the supplied reference or existing site content.
- Keep the page responsive, keyboard accessible, reduced-motion aware, and free of horizontal page overflow.
- Do not add or run tests; validate the requested page with a production build and visual browser preview.

## Review Focus

- Mobile widths: verify the intro, project cards, and process reflow without horizontal page overflow using a 390px browser viewport.
- Disclosure controls: verify native keyboard operation and visible focus styles by reviewing the rendered page.
- Project navigation: verify labeled controls update the selected project and work at mobile and desktop widths.
- Artwork: verify extracted assets render sharply with correct alternative text and reserved dimensions.
- Static route: verify `/services` renders through the existing marketing shell with `pnpm.cmd build`.

---

### Task 1: Extract supplied project and phone artwork

**Files:**
- Create: `public/images/services/slattery-auctions.png`
- Create: `public/images/services/toto-community.png`
- Create: `public/images/services/product-dashboard.png`
- Copy: `public/images/services/smart-apartment.svg`
- Copy: `public/images/services/book-call.svg`
- Source: `public/images/references/page 2/Desktop - 2.svg`

**Interfaces:**
- Produces the standalone project and phone illustrations used by Task 2.

- [x] Extract embedded PNG data for image IDs `image3_245_27`, `image4_245_27`, and `image5_245_27` from the supplied SVG. Write the decoded images under the filenames above without re-encoding or changing the supplied source.
- [x] Inspect the extracted images in a contact sheet and confirm they correspond to the auction project, community product, and phone dashboard artwork.

### Task 2: Implement the services route and interactions

**Files:**
- Modify: `app/(site)/services/page.tsx`
- Create: `app/(site)/services/projects-carousel.tsx`
- Create: `app/(site)/services/services.module.css`
- Consume: The five self-contained assets in `public/images/services/`.

**Interfaces:**
- `ServicesPage` remains the default server component exported from `page.tsx`.
- `ProjectsCarousel` is a client component with two supplied project slides and labeled previous/next buttons.

- [x] Replace the empty route with three semantic sections following the spec: light capabilities intro, dark work and outcomes, dark approach and process. Preserve `pageMetadata("services")`.
- [x] Render the hero apartment art and CTA artwork copied from the supplied `image 518.svg` and `Frame 19.svg`, plus the two extracted case-study images and phone artwork. Add responsive image dimensions and suitable alt text.
- [x] Add an accessible capabilities disclosure list. Keep “Strategic Experience Optimization” expanded initially and provide service descriptions consistent with the home page and reference.
- [x] Add `ProjectsCarousel` with native buttons, descriptive accessible names, clear focus styles, and a single selected project at a time.
- [x] Rebuild the outcome metrics, two approach principles, and four process steps as readable HTML, retaining only supplied metrics and claims.
- [x] Implement responsive route-local CSS: two-column intro on desktop; rounded dark panels with restrained blue glows; stacked cards and process on mobile; touch-sized controls; reduced-motion handling.
- [x] Run `pnpm.cmd build`; expected: exit code 0 and the `/services` route included in static output.
- [x] Open `/services` in a browser at desktop and 390px mobile widths. Inspect section order, image alignment, clipping, keyboard focus, and responsive overflow; adjust CSS until the visual review criteria pass.
