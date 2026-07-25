# Shared Foundations Reference — Public Site ↔ Admin Portal

Paste this whole file into the admin panel build prompt. It contains everything the admin app needs to match the public site exactly, without reading the public app's source.

## 1. Tech stack (fixed — do not substitute)

- Next.js 14+ (App Router), TypeScript
- Tailwind CSS
- PostgreSQL via Prisma ORM
- Cloudinary for all images
- Resend (primary) + Brevo SMTP (fallback) for email/OTP
- Framer Motion (public site only needs this for the hero; admin doesn't require it)

## 2. Repo / schema ownership rule

- **The admin project owns `prisma/schema.prisma` and is the only place `prisma migrate` ever runs.**
- The public project keeps a synced copy of the same file and only ever runs `prisma generate` against it — never `migrate`.
- Both projects point at the exact same `DATABASE_URL`.
- Two separate Next.js projects, two deployments, one schema file, one database.
- The full schema is below — reproduce it verbatim in the admin project's `prisma/schema.prisma`. Do not rename any model or field; the public app's queries (in its `lib/data.ts`) depend on these exact names.

## 3. Full Prisma schema (authoritative)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum EducationStatus { COMPLETED IN_PROGRESS }
enum TechCategory { LANGUAGES FRONTEND BACKEND DATABASE TOOLS MOBILE OTHER }
enum HobbyFieldType { TEXT TEXTAREA IMAGE DATE TIME DATETIME NUMBER RATING URL BOOLEAN }
enum StatContext { HOME ABOUT EXPERIENCE }

model Profile {
  id                  String   @id @default(cuid())
  name                String
  roles               String[]
  tagline             String
  profileImageUrl     String?
  resumeUrl           String?
  email               String
  phone               String
  education           String
  location            String
  languages           String
  availabilityStatus  String?
  bookingLink         String?
  mapLatitude         Float?
  mapLongitude        Float?
  mapLocationText     String?
  aboutHeadlinePrefix String?
  aboutHeadlineWord1  String?
  aboutHeadlineMiddle String?
  aboutHeadlineWord2  String?
  aboutIntro          String?
  positioningCopy     String?
  footerTagline       String?
  updatedAt           DateTime @updatedAt
  createdAt           DateTime @default(now())
}
// Singleton — one row only. Admin UI should be a single edit form, not a list.

model SocialLink   { id String @id @default(cuid()) platform String url String icon String order Int @default(0) visible Boolean @default(true) }
model QuickLink    { id String @id @default(cuid()) label String href String order Int @default(0) section String @default("quick") } // section: "quick" | "services"
model Stat         { id String @id @default(cuid()) context StatContext label String value String icon String order Int @default(0) }
model ServiceItem  { id String @id @default(cuid()) title String description String icon String order Int @default(0) }

model Technology {
  id       String       @id @default(cuid())
  name     String       @unique
  icon     String
  category TechCategory
  order    Int          @default(0)
  projects ProjectTechnology[]
}

model ProjectCategory {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  order    Int       @default(0)
  projects Project[]
}

model Project {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  summary       String
  description   String
  coverImageUrl String?
  liveDemoUrl   String?
  githubUrl     String?
  featured      Boolean  @default(false)
  order         Int      @default(0)
  categoryId    String
  category      ProjectCategory @relation(fields: [categoryId], references: [id])
  features      ProjectFeature[]
  technologies  ProjectTechnology[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ProjectFeature { id String @id @default(cuid()) text String order Int @default(0) projectId String project Project @relation(fields: [projectId], references: [id], onDelete: Cascade) }
model ProjectTechnology { id String @id @default(cuid()) projectId String technologyId String order Int @default(0) project Project @relation(fields: [projectId], references: [id], onDelete: Cascade) technology Technology @relation(fields: [technologyId], references: [id]) @@unique([projectId, technologyId]) }

model Experience {
  id        String   @id @default(cuid())
  role      String
  company   String
  startDate String
  endDate   String?  // null = "Present"
  color     String?
  icon      String?
  order     Int      @default(0)
  bullets   ExperienceBullet[]
}
model ExperienceBullet { id String @id @default(cuid()) text String order Int @default(0) experienceId String experience Experience @relation(fields: [experienceId], references: [id], onDelete: Cascade) }

model EducationEntry {
  id              String          @id @default(cuid())
  degree          String
  institution     String
  startDate       String
  endDate         String
  description     String?
  status          EducationStatus @default(COMPLETED)
  gpaOrPercentage String?
  order           Int             @default(0)
}
model KeySubject  { id String @id @default(cuid()) name String order Int @default(0) }
model Achievement { id String @id @default(cuid()) icon String title String description String order Int @default(0) }
model Certificate { id String @id @default(cuid()) title String imageUrl String order Int @default(0) }

model BlogPost {
  id            String   @id @default(cuid())
  title         String
  slug          String   @unique
  coverImageUrl String?
  excerpt       String?
  contentHtml   String   // rich text, admin-authored freeform sections
  liveDemoUrl   String?
  githubUrl     String?
  publishedAt   DateTime @default(now())
  order         Int      @default(0)
  tags          BlogPostTag[]
}
model BlogPostTag { id String @id @default(cuid()) label String order Int @default(0) blogPostId String blogPost BlogPost @relation(fields: [blogPostId], references: [id], onDelete: Cascade) }

model Hobby {
  id            String @id @default(cuid())
  name          String
  slug          String @unique
  coverImageUrl String?
  order         Int    @default(0)
  subCollections HobbySubCollection[]
}
model HobbySubCollection { id String @id @default(cuid()) name String order Int @default(0) hobbyId String hobby Hobby @relation(fields: [hobbyId], references: [id], onDelete: Cascade) fields HobbyField[] entries HobbyEntry[] }
model HobbyField { id String @id @default(cuid()) name String fieldType HobbyFieldType required Boolean @default(false) order Int @default(0) subCollectionId String subCollection HobbySubCollection @relation(fields: [subCollectionId], references: [id], onDelete: Cascade) values HobbyEntryValue[] }
model HobbyEntry { id String @id @default(cuid()) order Int @default(0) subCollectionId String subCollection HobbySubCollection @relation(fields: [subCollectionId], references: [id], onDelete: Cascade) createdAt DateTime @default(now()) values HobbyEntryValue[] }
model HobbyEntryValue { id String @id @default(cuid()) value String fieldId String field HobbyField @relation(fields: [fieldId], references: [id], onDelete: Cascade) entryId String entry HobbyEntry @relation(fields: [entryId], references: [id], onDelete: Cascade) @@unique([fieldId, entryId]) }
```

> Note: there is intentionally **no** `ContactMessage` model. Contact-form submissions are relayed by email only (Resend → Brevo SMTP fallback) and are never persisted — the admin panel has nothing to manage for contact submissions.

## 4. Conventions the admin panel must follow

- **Ordering:** every list model has an `order: Int`. The admin UI should let the user reorder (drag-and-drop or numeric input) and persist it — the public site always sorts by `order asc` (or `publishedAt desc` for blog posts).
- **Slugs:** `Project.slug`, `ProjectCategory.slug`, `BlogPost.slug`, `Hobby.slug` are unique and used directly in public URLs (`/projects/:slug`, `/about/:slug`, `/blogs/:slug`). Auto-generate from title/name but let the admin edit it, and validate uniqueness before save.
- **Icons:** every `icon` field stores a **string key**, not a file or emoji. The key must exactly match one of the keys registered in the public site's `lib/icons.tsx` icon map (built on `react-icons` — prefixes `Fa`, `Si`, `Md`, `Bs`, `Gi`). Build the admin's icon picker against the same key list so a value picked in admin renders correctly on the public site. Reproduce this exact list in the admin repo:
  `FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJava, FaAndroid, FaPython, FaGitAlt, FaFigma, FaLinux, FaDocker, FaAward, FaMedal, FaTrophy, FaMapMarkerAlt, FaClock, FaEnvelope, FaPhoneAlt, FaGlobe, FaBriefcase, FaGraduationCap, FaUserTie, FaCode, SiTypescript, SiJavascript, SiKotlin, SiExpress, SiPostgresql, SiMongodb, SiPrisma, SiTailwindcss, SiNextdotjs, SiVite, SiFirebase, SiCloudinary, SiMysql, SiVercel, SiRender, SiC, SiFlutter, MdWeb, MdSmartphone, MdDesignServices, MdStorage, MdBuild, MdEngineering, MdArticle, MdVerified, MdEmojiEvents, MdSchool, MdCalendarToday, MdStar, BsBriefcaseFill, BsPersonWorkspace, GiSteeltoeBoots`
  If the admin needs an icon outside this list, add it to both repos' registries at the same time.
- **Images:** every `*ImageUrl` field stores a Cloudinary `secure_url` string. The admin panel does the actual upload (via the Cloudinary SDK/unsigned upload widget) and writes the resulting URL — the public site never uploads, only renders/transforms.
- **Profile is a singleton.** Admin UI should be a single settings-style form (find-or-create the one row), not a CRUD list.
- **Hobby dynamic fields:** admin builds `Hobby → HobbySubCollection → HobbyField` as a 3-level form builder (per-hobby, per-subcollection, per-field: name + `HobbyFieldType` + required toggle + order), then lets the user add `HobbyEntry` rows for each sub-collection with one input per field, matched to `fieldType` (image picker for `IMAGE`, date picker for `DATE`/`DATETIME`, 1–5 star input for `RATING`, checkbox for `BOOLEAN`, etc). Every value is stored as a **string** in `HobbyEntryValue.value` regardless of type — the public site parses it back per `fieldType`.
- **Project categories are admin-managed**, not a fixed enum — the admin can create a new `ProjectCategory` at any time and it appears automatically in the public filter bar.
- **Technologies are shared** between the `/about` tech-stack grid and each project's "Technologies Used" chips — one `Technology` table, categorized by `TechCategory`, joined to projects via `ProjectTechnology`.

## 5. Env vars both projects need (identical values where noted)

| Variable | Admin needs it | Public needs it | Notes |
|---|---|---|---|
| `DATABASE_URL` | ✅ | ✅ | **must be identical** |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | ✅ (uploads) | ✅ (read/transform only) | |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | ✅ | |
| `RESEND_API_KEY` | optional (if admin also sends notifications) | ✅ | |
| `CONTACT_TO_EMAIL` | — | ✅ | |
| `BREVO_SMTP_HOST/PORT/USER/PASS` | optional | ✅ | fallback mail |
| `JWT_SECRET` or session secret | ✅ | — | admin auth only; public site has no auth |
| `NEXT_PUBLIC_SITE_URL` | ✅ (for preview links) | ✅ | |

## 6. Seed data already used (keep slugs stable if admin seeds its own copy)

- Project categories: `web`, `android`, `civil-engineering`, `ui-ux`
- Project slugs: `ride-share`, `civil-engineer-working`, `taskflow`, `url-shortener`
- Hobby slugs: `photography`, `book-reading`, `travelling`, `cycling`, `music`, `pc-games`
- Blog slugs: `how-i-built-a-ride-sharing-platform`, `civil-engineering-tools-every-builder-should-know`
- Stat contexts in use: `HOME`, `ABOUT`, `EXPERIENCE`

## 7. What the admin panel owns that the public site never touches

- All writes/uploads/migrations
- Auth (login, sessions/JWT) — public site has zero auth surface
- Reordering, publishing/unpublishing (if you add a `published` boolean, add it to both schemas together)
