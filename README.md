# Simplex Studio

Foundation for a multi-page static marketing site with a Neon contact backend.
The shared header is implemented. Home, expertise, services, work, about,
pricing, and contact page bodies stay empty until their sections are built.

## Local setup

Use Node.js 22+ and the pinned pnpm version. The supplied Neon credentials stay
in ignored `.env`. On a new checkout, copy `.env.example` to `.env.local` and
supply `DATABASE_URL`.

```sh
pnpm install
pnpm setup:local
pnpm db:check
pnpm db:migrate
pnpm dev
```

On Windows PowerShell use `pnpm.cmd` if execution policy blocks `pnpm.ps1`.
Local setup generates a secret in ignored `.env.local` without printing it,
preserving an existing configured secret. Visit `http://localhost:3000`; the
header is visible, with an empty page body until the first section is built.

## Checks

```sh
pnpm typecheck
pnpm test
pnpm build
```

`pnpm db:verify-contact` checks persistence, concurrent rate limiting, and window
reset against the configured Neon database. It writes temporary records with a
unique `example.invalid` email and removes them in a `finally` block. This is an
explicit integration check, separate from the default tests.

## Continue development

- [Architecture and content workflow](docs/architecture.md)
- [Design system and reusable primitives](docs/design-system.md)
- Edit page metadata and publication state in `content/pages.ts`.
- Add sections in `components/sections/` and compose them in `app/(site)/`.
- Keep database credentials and storage inside server-only modules.

Marketing routes enforce static output with Next.js 16.4 `ensureStatic`.
The contact endpoint requires a Next.js Node/serverless host; this is not a
file-only export. Before launch configure the real `SITE_URL`, server-only
database credentials, `CONTACT_RATE_LIMIT_SECRET`, and the host's trusted
`CONTACT_IP_HEADER`. Enable `SITE_INDEXABLE=true` only for published, completed
content. Nothing has been deployed.

Read bundled `node_modules/next/dist/docs/` guidance before changing Next.js
code, as required by `AGENTS.md`. Driver reference:
[Neon serverless driver](https://neon.com/docs/serverless/serverless-driver).
