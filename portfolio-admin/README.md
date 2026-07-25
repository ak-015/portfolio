# Portfolio — Admin Portal

Separate Next.js 14 (App Router) + TypeScript + Tailwind project. Manages every piece of content the public site renders, via a staged, OTP-confirmed workflow. Deployed on its own host/subdomain, fully `noindex`'d, never linked from the public site.

Read **`SHARED_FOUNDATIONS.md`** (from the public repo) before touching anything here — it's the contract between the two apps.

## Schema ownership

This project **owns** `prisma/schema.prisma` and is the only place `prisma migrate` is ever run. The public project keeps a synced, read-only copy and only runs `prisma generate` against it — never `migrate`.

**Sync mechanism (copy-on-deploy):** whenever you change a *shared content model* in `prisma/schema.prisma` here, copy the file into the public repo before its next deploy. Admin-only models (`AdminUser`, `OtpRequest`, `PendingChange`, their enums) never need to go to the public repo.

## How the staging + OTP flow works

1. Every create/update/delete from the dashboard UI calls `POST /api/pending`, which inserts a row into `PendingChange` — **nothing is written to the real tables yet**.
2. `PendingChange.section` groups related edits into one confirmable batch (e.g. `"projects"`, `"experience"`, `"hobby:<hobbyId>"`). You can stage several edits in the same section before confirming.
3. The **Pending Changes** page (`/dashboard/pending`) lists every section with outstanding changes. Each section has its own "Send OTP" button.
4. Sending an OTP emails a 6-digit code (Resend → Brevo SMTP fallback), hashed + expiring in 10 minutes, max 5 attempts before a 15-minute lockout (`lib/otp.ts`).
5. Entering the correct code calls `commitSection()` (`lib/staging.ts`), which applies every pending row for that section inside a single `prisma.$transaction`, deletes the staged rows, and — only after that succeeds — calls the public site's revalidation webhook so the change shows up without a redeploy.
6. Any pending row can be discarded individually before confirmation.

Login uses the same OTP primitive with `purpose: LOGIN` instead of `STAGING`.

## Real-time reflection on the public site

Admin and public are separate deployments, so `revalidatePath` here can't affect the public process directly. Instead:

- `lib/revalidate.ts` POSTs to `${PUBLIC_SITE_URL}/api/revalidate` with a shared `REVALIDATE_SECRET` header after every successful `commitSection()`.
- The public repo needs a matching `app/api/revalidate/route.ts` that checks the secret and calls `revalidatePath(...)` for the paths given. See the public repo's README for that route.
- `REVALIDATE_SECRET` must be identical in both projects' env vars.

## Local setup

```bash
npm install                     # also runs `prisma generate` via postinstall
cp .env.example .env            # DATABASE_URL must match the public project's
npx prisma migrate dev --name init   # this project owns migrations
npm run seed:admin              # creates the one admin account from SEED_ADMIN_EMAIL/PASSWORD
npm run dev                     # runs on :3001 by default
```

Visit http://localhost:3001/login.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string — **must match the public project's** |
| `JWT_SECRET` | Signs admin session + pending-login cookies |
| `SESSION_COOKIE_NAME` | Optional override for the session cookie name |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used once by `npm run seed:admin` to create the single admin account |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Uploads — admin is the only app that writes to Cloudinary |
| `RESEND_API_KEY`, `OTP_FROM_EMAIL` | Primary OTP email provider |
| `BREVO_SMTP_HOST/PORT/USER/PASS` | Fallback OTP email provider |
| `PUBLIC_SITE_URL` | Base URL of the public deployment, for the revalidation webhook |
| `REVALIDATE_SECRET` | Shared secret with the public project's `/api/revalidate` route |
| `NEXT_PUBLIC_SITE_URL` | This admin app's own URL (used in metadata only) |

## Seeding the initial admin account

There is intentionally no sign-up UI — this is a single-admin system.

```bash
SEED_ADMIN_EMAIL="you@example.com" SEED_ADMIN_PASSWORD="a-strong-password" npm run seed:admin
```

Re-running it with the same email updates the password hash (safe to use for password resets from the command line).

## What's a "flat" resource vs a bespoke page

- **Generic CRUD** (`app/dashboard/[resource]/`, config in `lib/resources.ts`): Social Links, Footer Links, Stat Strips, Services, Tech Stack, Project Categories, Key Subjects, Achievements, Education Timeline, Certificates. Adding a new flat model to the schema means adding one entry to `lib/resources.ts` and one `case` in `lib/applyChange.ts` (or letting it fall through to the generic flat-model path if it has no nested relations).
- **Bespoke pages** (nested relations, can't be config-driven cleanly): Profile/Hero/About (`/dashboard/profile`), Contact (`/dashboard/contact`, same underlying Profile row), Projects (`/dashboard/projects`, nested features + tech links), Experience (`/dashboard/experience`, nested bullets), Blog (`/dashboard/blog`, nested tags), Hobbies (`/dashboard/hobbies/[hobbyId]`, full 3-level dynamic field builder).

## Known limitation: staged sub-collections inside a hobby

Within one hobby's `hobby:<id>` batch, a pending `HobbySubCollection` (not yet committed, no real id) can't yet have fields or entries staged against it in the *same* batch — Prisma needs a real foreign key. Confirm the sub-collection's OTP first, then add its fields/entries in a follow-up batch. Solving this properly would mean resolving client-side placeholder IDs to real ones inside `commitSection()`'s transaction; left as a documented follow-up rather than built here.

## Security notes

- Passwords and OTPs are hashed (bcrypt); OTPs are never logged or returned in any response body.
- Login and OTP endpoints are rate-limited (`lib/rateLimit.ts` — in-memory; swap for Redis/Upstash in a multi-instance deployment).
- CSRF: double-submit cookie (`lib/csrf.ts` + `components/apiClient.ts`) required on every mutating route, on top of the `sameSite=lax` session cookie.
- The whole app sends `X-Robots-Tag: noindex, nofollow, noarchive` (see `middleware.ts`) and ships its own `robots.ts` disallowing everything.
