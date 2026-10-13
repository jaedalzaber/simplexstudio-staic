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
status. Expertise, services, work, and pricing are empty typed collections.
Add approved content there instead of hardcoding copy in JSX. Related records
refer to each other by slug. No projects, prices, statistics, or testimonials
are invented, and there is no CMS or admin UI.

Pages start as drafts with indexing disabled. Once a page has real content,
mark it `published`. At launch set the real `SITE_URL` and
`SITE_INDEXABLE=true`. Both that setting and page status gate indexing; the
sitemap includes only published pages. Content/metadata edits require a rebuild.

## Future detail routes

Add `/expertise/[slug]`, `/services/[slug]`, and `/work/[slug]` with approved
detail content. Cache Components requires at least one complete static parameter
set, so no empty dynamic route is mounted now. Once there is a published entry:

```tsx
// app/(site)/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { publishedEntries, publishedEntry } from "@/content/collections";

export function generateStaticParams() {
  return publishedEntries(services).map(({ slug }) => ({ slug }));
}

export default async function ServicePage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = publishedEntry(services, slug);
  if (!service) notFound();
  // Compose approved sections here.
  return null;
}
```

Add detail metadata and sitemap URLs with each implementation. Slugs must be
unique, URL-safe, and stable. Reject unknown and draft slugs with `notFound()`;
`dynamicParams` is unsupported with Cache Components. Keep data local rather
than introducing runtime database reads into marketing pages.

## Contact contract

The future form calls `submitContact` in `lib/contact/client.ts`. Input is JSON:
`name`, `email`, `message`, optional `company`, optional `website`. The website
field is a honeypot: keep it empty, hidden from people and screen readers,
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
