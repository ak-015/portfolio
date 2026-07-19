# Ankit Kumar — Portfolio (Public Site)

Public-facing portfolio built with Next.js (App Router) + TypeScript + Tailwind
CSS + PostgreSQL (Prisma). Every piece of content — projects, hobbies (and
their dynamic fields), about/bio/timeline text, education, experience, blog
posts, resume link, stats, tech stack, and social links — is fetched from
PostgreSQL at request time. Nothing is hardcoded, since the companion admin
portal manages this same database.

## Tech stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS, `next/font` (Sora for display, Inter for body)
- **Database:** PostgreSQL via Prisma (schema shared with the admin portal — see below)
- **Images:** Cloudinary (all gallery/cover/screenshot URLs are stored as Cloudinary URLs in the DB)
- **Email:** Resend (primary) with Brevo SMTP as automatic fallback, used by the `/contact` form

## Project structure

```
app/
  layout.tsx              root layout (navbar, footer, fonts, metadata)
  globals.css              design tokens + reusable utility classes
  page.tsx                 Home
  about/page.tsx            About
  projects/page.tsx         Projects (filterable grid)
  projects/[slug]/page.tsx  Project detail
  experience/page.tsx       Experience (timeline)
  education/page.tsx        Education (timeline)
  blogs/page.tsx             Blog list
  blogs/[slug]/page.tsx      Blog detail
  hobbies/[slug]/page.tsx    Dynamic hobby sub-page (sub-collections + fields, driven entirely by DB)
  contact/page.tsx           Contact form + info
  api/contact/route.ts       Sends contact form via Resend / Brevo SMTP fallback (not stored in DB)
  not-found.tsx
components/                 Navbar, Footer, ProjectCard/Grid, Timeline, StatStrip,
                             TechStackGrid, ServicesGrid, BlogCard, HobbiesGrid,
                             HobbyEntryCard, FloatingCubes, ContactForm, SectionHeading
lib/
  prisma.ts                 Prisma client singleton
  data.ts                   All DB read functions used by pages (server-side)
  mailer.ts                 sendMail() — Resend primary, Brevo SMTP fallback
  icons.tsx                 icon-key -> react-icons component map (admin-editable icon fields)
prisma/
  schema.prisma              full data model (see below)
  seed.ts                     seed script with real starter content
```

## Shared Prisma schema

`prisma/schema.prisma` is the **single source of truth** for the database and
is shared with the admin portal (a separate deliverable). It already includes
the admin-side models (`AdminUser`, `OtpRequest`, `PendingChange`) so the two
codebases can point at the same schema file without drift. If you generate the
admin portal from its own prompt, copy this exact file into that project (or
better, symlink / share it via a monorepo) rather than redefining the models.

Key content models: `Project`, `HobbyCard` → `HobbySubcollection` →
`HobbyField` / `HobbyEntry` → `HobbyEntryValue` (the dynamic hobby field
builder), `EducationEntry`, `ExperienceEntry`, `BlogPost`, `AboutContent`,
`RoleTitle`, `TechStackItem`, `StatItem`, `ServiceItem`, `SocialLink`.

The contact form is **not** stored in the database — it's emailed directly.

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `DATABASE_URL` | PostgreSQL connection string |
   | `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials (used by the admin portal for uploads; public site only reads the resulting URLs) |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name exposed to the client, if you add client-side upload widgets later |
   | `RESEND_API_KEY` | Resend API key for the contact form |
   | `CONTACT_TO_EMAIL` | Where contact form submissions are delivered |
   | `CONTACT_FROM_EMAIL` | Verified "from" address in Resend |
   | `BREVO_SMTP_HOST` / `BREVO_SMTP_PORT` / `BREVO_SMTP_USER` / `BREVO_SMTP_PASS` | Brevo SMTP fallback credentials |
   | `NEXT_PUBLIC_SITE_URL` | Public site URL, used for metadata |

3. **Create the database schema**

   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed starter content**

   ```bash
   npm run prisma:seed
   ```

   This populates the hero/about copy, stats, services, tech stack, four
   seed projects (`ride_share`, `Civil Engineer Working`, `Taskflow`, `URL
   Shortener`), an education timeline (including the SYL–BML canal-slope
   report as a featured entry), placeholder experience roles, three blog
   posts, and hobby demo data (Photography → Gallery; Book Reading → Read /
   Currently Reading / Wishlist; PC Games → Played / Wishlist) showing the
   dynamic field builder in action. Replace the placeholder Cloudinary URLs
   in `prisma/seed.ts` with real uploads, or edit content via the admin
   portal after seeding.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`.

## Notes on the dynamic hobby builder

- `HobbyCard` is a top-level hobby (e.g. "Photography").
- Each hobby has one or more `HobbySubcollection`s (e.g. "Gallery", or "Read" /
  "Currently Reading" / "Wishlist" for Book Reading).
- Each sub-collection defines its own `HobbyField`s (name, input type,
  required) — completely independent of every other sub-collection.
- `HobbyEntry` + `HobbyEntryValue` store the actual items and their field
  values.
- `components/HobbyEntryCard.tsx` and `app/hobbies/[slug]/page.tsx` render
  purely from this schema/config: they look for an `IMAGE` field to use as a
  cover and a `TEXT` field matching `title`/`name` as a heading, then render
  every other field generically by its `inputType`. There is no
  Photography/Books/Games-specific logic anywhere in the frontend, so the
  admin portal can add entirely new hobbies and field types without a code
  change.

## Notes on rendering strategy

Every page that reads from the database is marked
`export const dynamic = "force-dynamic"` so content is fetched fresh on each
request (per the brief) rather than baked in at build time — admin portal
edits show up immediately without a redeploy.

## Deploying

Any Next.js host (Vercel, Render, etc.) works. Make sure `DATABASE_URL` points
at a reachable PostgreSQL instance and that migrations have been applied
(`npx prisma migrate deploy`) before the app receives traffic.
