# Design system foundation

The shared header follows the supplied reference, including the brand logo,
navigation dropdowns, contact link, and responsive mobile disclosure. Navigation
labels and dropdown items live in `config/navigation.ts`. Page bodies remain
empty; marketing sections and the footer will be built separately.

The header is fixed: it is transparent at the top of the home page, overlays
the future cover, and becomes opaque white after 12 pixels of scrolling.
Other pages and the expanded mobile menu use white. Header spacing is reserved
on other pages; future home cover content should start at the top of `main`.

`ScrollProvider` supplies a single root Lenis instance with wheel smoothing,
native touch scrolling, anchor support, and reduced-motion handling. The slim
scrollbar overlays the page with a transparent track and supports dragging and
keyboard navigation. It appears only when content overflows the viewport;
native scrollbar chrome is hidden after this replacement mounts. Horizontal
overflow is clipped. [Lenis reference](https://github.com/darkroomengineering/lenis).

## Tokens

`styles/tokens.css` is the source of truth. White paper, near-black ink, mist
surfaces, and blue accents follow the reference palette. The system font is
temporary until the final brand font is supplied.

The shared content container is centered with a maximum width of **1330px** and
responsive gutters. Header content uses this same `Container`; its background
still spans the viewport. The component uses `site-container` so Tailwind's
breakpoint-based `container` utility cannot override the site's width.

| Purpose | CSS variables | Tailwind examples |
| --- | --- | --- |
| Surface and text | `--surface`, `--text` | `bg-surface`, `text-foreground` |
| Quiet surface/text | `--surface-muted`, `--text-muted` | `bg-surface-muted`, `text-muted` |
| Border and accent | `--border`, `--accent` | `border-border`, `text-accent` |
| Type scale | `--type-caption` through `--type-display` | `text-caption`, `text-body`, `text-title` |
| Spacing | `--space-1` through `--space-10` | CSS variables or Tailwind's standard scale |
| Layout | `--gutter`, `--container-width`, `--reading-width` | `Container` |
| Shape | `--control-radius`, `--panel-radius`, `--radius-pill` | `rounded-control`, `rounded-panel`, `rounded-full` |
| Motion | `--duration-fast`, `--duration-base`, `--ease-standard` | CSS variables |

Dark sections explicitly use `data-surface="dark"` with `bg-surface
text-foreground`. Semantic tokens change for descendants; the visitor's OS theme
does not change the site. Accent blue is decorative; ordinary small text should
use semantic text colors.

## Primitives

- `Container`: responsive centered wrapper, optional `width="reading"`.
- `Stack`: vertical flow with `gap={1}` through `gap={10}` token spacing.
- `Button`: defaults to `type="button"`; primary, secondary, ghost variants.
- `ButtonLink`: Next.js link with matching variants; use for navigation.
- `TextField`, `TextAreaField`: required `id` and `label`, optional description
  and error; native input props, associated labels, and accessible feedback.

Primitives have no global client boundary. Import them into a Client Component
when event handlers or browser state are needed. Button targets are at least
44 pixels; focus indicators and reduced-motion support are included.

Keep future section data in `content/` and markup in `components/sections/`.
Compose sections in pages. Reuse semantic tokens and primitives; use isolated
CSS Modules for section-specific layouts. Complex interactive components will
be added when their sections are requested.
