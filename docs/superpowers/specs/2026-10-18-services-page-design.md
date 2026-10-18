# Services page design

## Goal

Build the `/services` route as a responsive, accessible service overview for Simplex Studio, using the supplied Page 2 desktop design and artwork. The existing route is intentionally empty. The page should explain the studio's service capabilities, show work and outcomes, and give visitors a clear path to book a call.

## Approved direction

Keep the reference's sequence and visual character: a light two-column introduction, followed by two dark, blue-lit sections. Retain the existing shared header and site design system. Adapt layouts for narrow screens rather than scaling a desktop composition down unchanged.

## Page structure

1. **Capabilities introduction** — A restrained “Services” eyebrow and smart apartment product illustration on the left, with a “Our core capabilities” heading and an expandable list on the right. Include a prominent “Book a call” link below the illustration. Start with “Strategic Experience Optimization” expanded and provide concise descriptions for the remaining capabilities, based on services already named on the home page and in the reference (UX/UI and product design, mobile app design, MVP development, software development, and business automation). Do not add unsubstantiated client or performance claims.
2. **Work and outcomes** — A rounded, near-black panel with the blue glow from the reference, a “Real impact, real outcome” heading, and the two supplied project visuals. Make the project navigation operable and labeled for assistive technology. Present outcome metrics as readable text, preserving only metrics shown in the supplied design; do not invent new ones.
3. **Approach and process** — A second dark panel with “The core of our approach,” the phone/product visual, two design principles, and a four-step process from insight to impact. Keep the process readable and sequential on mobile.

## Assets

Use `image 518.svg` for the apartment illustration and `Frame 19.svg` for the call-to-action treatment. Source the project and phone artwork from the two `Mask group` SVG composites, but rebuild headings, copy, metrics, and controls as HTML so they remain selectable and accessible. Use `Desktop - 2.svg` as the overall layout reference; do not render either the full-page screenshot or the composite section screenshots as page content. Use descriptive alternative text for meaningful artwork and empty alternative text for decorative glows.

## Behavior and accessibility

- Use semantic section headings with one page-level heading and a logical hierarchy.
- Implement capabilities as keyboard-operable disclosure controls with visible focus styles and clear expanded state. Keep the initially open capability shown in the reference.
- Provide visible, adequately sized project controls with accessible names. Keep keyboard order aligned with visual order.
- Make all layouts reflow without horizontal scrolling. Stack the introduction and project content on small screens; retain comfortable text sizes and touch targets.
- Respect reduced-motion preferences and avoid motion as the only feedback.

## Implementation boundaries

Implement the page in the existing `/services` route and an isolated CSS Module. Reuse the existing site shell, metadata helper, shared design tokens, and contact route. Keep all sections statically renderable under the existing marketing route configuration. Do not change the header, navigation, global tokens, other pages, or backend.

## Review criteria

- The page follows the reference's light intro and two dark sections, with supplied artwork used in the matching places.
- Capability details and project controls work with mouse, touch, and keyboard.
- The content remains available as HTML text and the artwork has appropriate text alternatives.
- The page reflows cleanly at mobile and desktop widths and retains the site's header and visual language.
- No unsupported service promises or outcome claims are introduced.
