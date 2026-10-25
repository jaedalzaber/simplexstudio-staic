# Project foundation

## Rendering and hosting

Marketing routes live in `app/(site)/`. Their layout exports
`ensureStatic = "navigation"`, the Next.js 16.4 setting that validates fully
prerendered server output. Marketing content stays local and build-time.
Neon is used only by `POST /api/contact`.

This is a static marketing site with a server endpoint. It needs a host that
supports Next.js Node/serverless routes. `output: "export"` is absent because a
file-only host cannot execute the contact API. If that hosting model is chosen
later, deploy the API separately and update its origin policy and client URL
together. No hosting service has been selected or deployed.

## Structure

```text
app/(site)/           Empty home/expertise/services/work/about/pricing/contact
app/api/contact/      The only application request-time backend
app/layout.tsx        Base document, viewport, default metadata
app/globals.css       Tailwind imports and accessible base styles
app/robots.ts         Indexing gate
app/sitemap.ts        Published page URLs
components/layout/   Site shell, responsive header, container, stack
components/ui/       Buttons and accessible field primitives
components/sections/ Future sections, currently empty
config/              Site identity, origin, navigation data
content/             Typed local page and collection content
styles/              Tokens and primitive styles
lib/contact/         Shared validation, HTTP handler, client submit helper
lib/server/          Server-only Neon access and storage
db/migrations/       Versioned SQL
scripts/             Local setup and database checks
tests/               Contact validation and HTTP behavior
```

## Content workflow

`content/pages.ts` holds route titles, optional descriptions, and publication
status. Expertise, services, and pricing are empty typed collections.
`content/work.ts`, `content/about.ts`, `content/contact.ts`, and
`content/home.ts` hold the copy from the supplied designs; comments mark copy
that the design itself repeats as a placeholder. Add approved content there
instead of hardcoding copy in JSX. Related records refer to each other by slug.
There is no CMS or admin UI.

Image positions are `ImageSlot`s. Without a `src` they render a grey
placeholder of the same proportions; add the path to show the real image.

Pages start as drafts with indexing disabled. Once a page has real content,
mark it `published`. At launch set the real `SITE_URL` and
`SITE_INDEXABLE=true`. Both that setting and page status gate indexing; the
sitemap includes only published pages. Content/metadata edits require a rebuild.

## Detail routes

`/work/[slug]` exists: every published work entry with a `study` gets a page,
listed by `generateStaticParams` and added to the sitemap once the Work page is
published. The page shell (sky, back link) renders without `params`; the
slug-dependent study streams inside `<Suspense>` so client navigations stay
instant, as Next.js validates in development.

`/blog/[slug]` works the same way: posts in `content/blog.ts` with a `body`
get an article page; the rest appear on the `/blog` listing only. Article
bodies are typed blocks (paragraph, heading, list, figure, video, callout);
headings feed the table of contents. Each article also emits `BlogPosting`
JSON-LD.

`/services/[slug]` holds one page per solution in `content/solutions.ts`
(eCommerce, Real Estate, and so on). eCommerce, Real Estate, Booking Systems and
Manufacturing & Logistics have their own full pages (`app/(site)/services/ecommerce`,
`.../real-estate`, `.../booking-system` and `.../industrial-erp`, marked
`ownPage`). The booking and factory demos run on sample data in
`content/booking-demo.ts` and `content/factory-demo.ts`, which are deterministic
so the server and browser agree and `tests/` can check them. All 3D views bake
light into box-built models with `lib/three/bake.ts`, each passing its own
lighting; the booking and factory views share the interactive stage in
`lib/three/stage.ts` (renderer, camera rules, picking, labels, on-demand
rendering). The old `/services/property-management` URL redirects permanently to
`/services/real-estate` (see `next.config.ts`). The others are deliberately
blank for now, a hero with the name only, and stay out of search results until the
Services page is published. The same file feeds the home Solutions section and
the header Solutions menu.

Add `/expertise/[slug]` the same way with approved
detail content. Cache Components requires at least one complete static parameter
set, so no empty dynamic route is mounted. Once there is a published entry:

```tsx
// app/(site)/expertise/[slug]/page.tsx
import { notFound } from "next/navigation";
import { expertise } from "@/content/expertise";
import { publishedEntries, publishedEntry } from "@/content/collections";

export function generateStaticParams() {
  return publishedEntries(expertise).map(({ slug }) => ({ slug }));
}

export default async function ExpertisePage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = publishedEntry(expertise, slug);
  if (!entry) notFound();
  // Compose approved sections here.
  return null;
}
```

Add detail metadata and sitemap URLs with each implementation. Slugs must be
unique, URL-safe, and stable. Reject unknown and draft slugs with `notFound()`;
`dynamicParams` is unsupported with Cache Components. Keep data local rather
than introducing runtime database reads into marketing pages.

## Contact contract

The contact page form calls `submitContact` in `lib/contact/client.ts`. Input is
JSON: `name`, `email`, `message`, optional `company`, optional `nda` (boolean,
stored as `nda_requested`; run `pnpm db:migrate` to add the column), optional
`website`. The website field is a honeypot: keep it empty, hidden from people and screen readers,
out of the tab order, and with autofill disabled. The server normalizes fields
and returns `{ ok: true }` or `{ ok: false, error, fieldErrors? }`.

Responses: 201 saved, 200 honeypot ignored, 400 malformed JSON, 403 origin
rejected, 413 oversized body, 415 wrong content type, 422 validation failure,
429 rate limited, 503 storage unavailable. The actual request body is capped at
16 KiB even without a content length. Responses are not cached. Browser requests
must come from the request origin or configured `SITE_URL`; no CORS is enabled.

Tables live in the separate `simplex` schema. Messages have `new`, `read`, and
`archived` statuses. Existing Neon auth tables are not used. There is no public
endpoint to read submissions or email notification integration. A successful
submission means the record was saved to Neon.

Rate limits allow five submissions per normalized email per 15 minutes, and
five per IP when a trusted proxy header is enabled. Counters and inserts commit
in one transaction, preventing concurrent requests from passing the same limit.
HMAC hashes are stored for limiting; raw IP addresses are not stored. Keep the
contact secret server-only and at least 32 characters.

Configure `CONTACT_IP_HEADER` only behind a proxy that overwrites it. Default
`none` limits by email only. Missing/invalid configured headers fail closed.
Expired rate-limit rows can be pruned in Neon:

```sql
DELETE FROM simplex.contact_rate_limits
WHERE window_started_at < now() - interval '1 day';
```

## Migrations

Run `db:migrate` against a fresh database before starting. SQL files run in order,
record checksums in `simplex.schema_migrations`, and commit with their ledger
entry. Add a new migration instead of editing an applied one. Separate statements
with `-- statement-breakpoint`; this allows future PostgreSQL function bodies.
Run one migrator per deployment.
