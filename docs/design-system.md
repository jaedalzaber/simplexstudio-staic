# Design system foundation

The shared header follows the supplied reference, including the brand logo,
mega menus, contact link, and responsive mobile disclosure. Navigation labels,
the Capabilities groups (with their icons from `public/icons`), the Solutions
image grid, and the footer columns live in `config/navigation.ts`. The footer
is shared by every page through `SiteShell`.

The header is fixed: it is transparent at the top of the home, Work (including
case studies), About, Blog (including articles), and Contact pages, where it sits inside the sky hero
(`immersiveRoutes` in `header.tsx`), and becomes a frosted white bar after 12 pixels of
scrolling. It slides away while scrolling down and returns on any upward
scroll. Open menus join their toggle with a white folder tab. Header spacing is
reserved on other pages; home cover content starts at the top of `main`.

`ScrollProvider` supplies a single root Lenis instance with wheel smoothing,
native touch scrolling, anchor support, and reduced-motion handling. GSAP's
ticker drives Lenis so ScrollTrigger and smooth scrolling share one frame. The slim
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

- `PillLink`: the reference "Book a call" capsule (dot, rolling label, flying
  arrow, magnetic pull); `tone` dark/light, `size` sm/md/lg.
- `ServicePill`: "View Service" capsule whose artwork fades in and whose arrow
  knob travels across on hover; light and dark tones.
- `Eyebrow`: dot-led uppercase section label.
- `PillButton`: the `PillLink` capsule as a `<button>`, for forms.
- `Media`: renders an `ImageSlot`, or a grey placeholder with the same
  proportions until the slot has a `src`.
- `SkyBackdrop`: the drifting light-blue clouds behind heroes; `SkyFade` is a
  rounded sky panel that fades to white behind content that runs past it.
  Mark the page wrapper with `data-sky-scope` so the clouds follow the pointer.
- `StatRow`: counting figures with hairline rules (home, About, case studies).
- `ExploreCursor`: "Explore case" capsule that trails the pointer over media.
- `FilterTabs`: pill category filter whose dark fill glides to the chosen
  option (Work and Blog).
- `ScrollSpyNav`: in-page section list that highlights the section in view
  (article table of contents, home Solutions index).
- `TalkCard`: small dark "Let’s talk" call-to-action card for sidebars.

Keep section data in `content/` and markup in `components/sections/`.
Compose sections in pages. Reuse semantic tokens and primitives; use isolated
CSS Modules for section-specific layouts.

## Motion

Import GSAP only through `lib/gsap.ts`, which registers ScrollTrigger and
SplitText once. Wrap animations in `gsap.matchMedia()` with `motionQuery` so
nothing moves for visitors who prefer reduced motion; Motion (`motion/react`)
follows the same preference through `MotionConfig`.

For scroll entrances in server-rendered markup, wrap the section in
`RevealScope` and mark descendants with `data-reveal` (`up`, `lines`,
`stagger`, `scale`, `fade`) plus optional `data-reveal-delay`. Animations are
scoped to that subtree so they never touch DOM that has not hydrated yet;
content stays visible without JavaScript. Above-the-fold hero entrances use
CSS keyframes so they play before hydration.

Section backgrounds come from the artwork in `public/section`, rendered to
compact WebP files in `public/images/backgrounds`. The home showreel plays
`/videos/showreel.webm` or `/videos/showreel.mp4` when present and shows the
dashboard poster frame until then.
