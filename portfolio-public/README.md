# Portfolio — Public Site

Public-facing portfolio site for Ankit Kumar. Next.js 14 (App Router) + TypeScript + Tailwind CSS, reading all content from PostgreSQL via Prisma. Nothing user-facing is hardcoded — every string, image, stat, and link comes from the database.

This is one of two aligned deployments. See **`SHARED_FOUNDATIONS.md`** for the contract this project shares with the admin panel (schema ownership, models, env vars, icon keys). Read that file — not this whole codebase — before generating the admin panel.

## Schema ownership

This project does **not** own the database schema. The admin project owns `prisma/schema.prisma` and is the only place `prisma migrate` is ever run. This repo's copy of `prisma/schema.prisma` must be kept byte-identical to the admin repo's copy.

**Sync mechanism (copy-on-deploy):** before every deploy, copy `schema.prisma` from the admin repo into `prisma/schema.prisma` here, then run `prisma generate` (already wired into `postinstall` and `build`). If you use a monorepo or a shared private npm package instead, swap that in — just keep it to one mechanism and keep this section updated.

This project only ever runs:
```bash
npx prisma generate
```
Never `prisma migrate *` from this repo.

## Local setup

```bash
npm install                 # also runs `prisma generate` via postinstall
cp .env.example .env        # fill in real values — DATABASE_URL must match the admin project's
npm run seed                # optional: populate demo content (see prisma/seed.ts)
npm run dev
```

Visit http://localhost:3000.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string — **must be identical** to the admin project's |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary account (public site only reads/transforms URLs, never uploads) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same cloud name, exposed client-side for `next/image` |
| `RESEND_API_KEY` | Primary email provider for the contact form |
| `CONTACT_TO_EMAIL` | Inbox that receives contact-form submissions |
| `BREVO_SMTP_HOST`, `BREVO_SMTP_PORT`, `BREVO_SMTP_USER`, `BREVO_SMTP_PASS` | Fallback SMTP if Resend fails |
| `NEXT_PUBLIC_SITE_URL` | Used for metadata / canonical URLs |

## Structure

```
app/
  layout.tsx            root layout — fetches Navbar/Footer data
  page.tsx               /  (home)
  about/
    page.tsx              /about
    [hobby]/page.tsx       /about/:hobbySlug — fully dynamic field renderer
  projects/
    page.tsx               /projects
    [slug]/page.tsx         /projects/:slug
  experience/page.tsx      /experience
  education/page.tsx       /education
  blogs/
    page.tsx                /blogs
    [slug]/page.tsx          /blogs/:slug
  contact/page.tsx          /contact
  api/contact/route.ts       POST — sends contact form email, not persisted
components/                 all presentational components, DB-shaped props only
lib/
  prisma.ts                  Prisma client singleton
  data.ts                    every DB read used by pages goes through here
  cloudinary.ts               Cloudinary URL transform helpers (read-only)
  email.ts                    Resend + Brevo SMTP contact-form sender
  icons.tsx                   string-key → react-icons component registry
prisma/
  schema.prisma                synced from the admin repo (see above)
  seed.ts                      demo content matching the reference design
```

## Notes

- The hero's connected-dots network and floating cubes are both live, client-rendered (`ParticleNetwork.tsx`, `FloatingCubes.tsx`) — no static images.
- The hobbies system (`/about/[hobby]`) has zero hardcoded layout per hobby: it walks whatever sub-collections and fields exist for that hobby in the DB and renders them generically by field type (image, rating, url, date, etc).
- The icon registry (`lib/icons.tsx`) must stay in sync with whatever icon-key strings the admin panel's icon picker writes to the DB — see `SHARED_FOUNDATIONS.md`.
