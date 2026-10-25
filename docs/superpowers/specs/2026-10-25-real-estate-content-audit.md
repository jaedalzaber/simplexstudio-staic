# Real estate page: rendering and configuration audit

Route: `/services/real-estate` · Reviewed: 25 October 2026

## Finding

The page described a broad website and property-software offer. Rendering,
animation, web tours, and VR were grouped under generic “visuals” wording. The
property selector demonstrated choosing a unit but did not explain configuring
the interior. Lowe’s, the most relevant configuration example, appeared only as
a small related-work card. All project media used grey placeholders.

## Implemented improvements

| Area | Change |
| --- | --- |
| Hero | “3D rendering and configurators for real estate.” The introduction names interior and exterior renders, architectural films, web and VR tours, and configurators. Websites and management tools remain part of the offer. |
| Service navigation | Added direct links to rendering, tours and VR, property selection, and 3D configurators. |
| Early proof | The UAE/USA experience line now appears in the hero. An actual Hay Al Wafa project screenshot replaces the hero placeholder. |
| Rendering | Moved this section directly after the hero. Separate descriptions explain exterior/master-plan rendering, interior rendering, architectural animation, and browser/VR tours. |
| Visual examples | Added labelled project previews of Hay Al Wafa and Lowe’s with links to their live experiences. Removed the inert play badge and empty walkthrough placeholder. |
| Property selection | Clarified the purpose: choose a plot, floor, or apartment from an interactive property view and enquire about that property. The existing interactive sample remains labelled as illustrative. |
| Interior configuration | Added a dedicated section for comparing room layouts, cabinet finishes, countertops, flooring, and fixtures. Explain how selected preferences can support enquiries. |
| Configuration proof | Promoted Lowe’s to a large example with a real project screenshot and a link to the kitchen configurator. It is no longer buried in the related-work list. |
| Websites | Explained how renders, tours, plans, and selectors work together on a property website. |
| Team and FAQ | Named modelling, rendering, animation, and configurators explicitly. Added a question distinguishing interior customisation from unit selection. |
| Site discovery | Updated the solution summary, highlights, image, and page metadata to reflect rendering and configuration. |

## Current page order

1. Hero, service links, client-region experience, and rendered master-plan preview.
2. Interior and exterior 3D rendering, with animation and tour coverage.
3. Interactive plot and unit selection.
4. 3D interior configurators, with the Lowe’s example.
5. Selected real estate work and the related ABB presentation.
6. Property websites and enquiries.
7. Listings, sales, and property management.
8. In-house team and delivery process.
9. Project enquiry and FAQs.

## Content boundaries

- A selector identifies a property; a configurator compares options within it.
  Explain both without treating the existing schematic selector as a real-time
  3D rendering demo.
- Keep the copy direct and brief. The page shows how the capabilities help
  buyers and property teams; production methods belong on capability pages.
- Name browser tours and dedicated VR separately. Do not imply a headset is
  required for a web tour.
- Keep availability integration scoped to the client's data connection. The
  sample selector is not live inventory.
- Continue describing property-management functions without naming the
  underlying software product.
- The UAE/USA experience line comes from the brief. Hay Al Wafa is an Oman
  development; its location is not relabelled.

## Visual asset provenance

The new images are captured screenshots of the user-supplied portfolio sites:

- `public/images/real-estate/hay-al-wafa-masterplan.png`:
  [Hay Al Wafa master plan](https://hay-alwafa.voom.cc/master-plan).
- `public/images/real-estate/lowes-kitchen-visualizer.png`:
  [Lowe’s Kitchen Visualizer](https://kitchendesign2.lowes.com/kitchenvisualizer).

They are labelled as project previews, rather than standalone render files or
newly created 3D assets. They establish the examples without inventing work or
conversion results. Existing remaining project slots are preserved.

Full-resolution standalone interior/exterior renders, architectural films, and
VR footage can replace or supplement these previews when approved media is
available. The page describes those capabilities without fabricating a film
or a working VR demo.

## Validation

- `pnpm typecheck` passed.
- Targeted ESLint checks passed for the real estate page, sections, and content.
- Checked the rendered hero, real project images, and new configuration section.
- Exercised the existing selector from Building A to floor 6 to apartment A-601;
  its details and enquiry link remained available.
