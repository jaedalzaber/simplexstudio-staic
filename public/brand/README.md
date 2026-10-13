# Brand assets

`logo-black.svg` is the supplied Simplex Studio logo, preserved as provided
(121 x 53 viewBox). Use `Logo` from `components/brand/logo.tsx` when implementing
the header or another approved section. It preserves the artwork's proportions
and defaults to an accessible "Simplex Studio" description.

The supplied gradient favicon is preserved in `app/icon.svg`. Next.js adds the
icon link to every page automatically using its file-based metadata convention.

Place additional approved assets and licensed font files here when supplied.
A local font can be loaded with `next/font/local` in `app/layout.tsx` and
assigned to `--font-body`.
