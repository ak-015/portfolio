import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";

// Every /dashboard/* page reads live data straight from Prisma in a server
// component. Next.js only treats a route as dynamic when it detects a
// dynamic API (cookies(), headers(), etc.) somewhere in its render tree —
// a plain `await prisma.x.findMany()` doesn't count. Without this, Next
// statically renders these pages once and serves that cached HTML/RSC
// payload on every later visit, so edits committed via the OTP flow never
// show up here again until a redeploy (even though they've already landed
// in Postgres and already reached the public site via triggerPublicRevalidate).
// Forcing dynamic rendering here cascades to every nested page under
// /dashboard, so each one re-queries Postgres on every request.
export const dynamic = "force-dynamic";

const NAV_GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  {
    title: "Home & Profile",
    items: [
      { href: "/dashboard/profile", label: "Hero / About / Profile" },
      { href: "/dashboard/contact", label: "Contact Page" },
      { href: "/dashboard/social-links", label: "Social Links" },
      { href: "/dashboard/quick-links", label: "Footer Links" },
      { href: "/dashboard/stats", label: "Stat Strips" },
      { href: "/dashboard/services", label: "Services" },
      { href: "/dashboard/settings", label: "Site Settings" },
    ],
  },
  {
    title: "Projects",
    items: [
      { href: "/dashboard/projects", label: "Projects" },
      { href: "/dashboard/project-categories", label: "Categories" },
      { href: "/dashboard/technologies", label: "Tech Stack" },
    ],
  },
  {
    title: "Experience & Education",
    items: [
      { href: "/dashboard/experience", label: "Experience" },
      { href: "/dashboard/education-entries", label: "Education Timeline" },
      { href: "/dashboard/key-subjects", label: "Key Subjects" },
      { href: "/dashboard/achievements", label: "Achievements" },
      { href: "/dashboard/certificates", label: "Certificates" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/dashboard/blog", label: "Blog Posts" },
      { href: "/dashboard/hobbies", label: "Hobbies" },
    ],
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pendingCount = await prisma.pendingChange.count();

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-panel/50 p-5 md:block">
        <p className="mb-6 font-semibold text-white">Portfolio Admin</p>

        <Link
          href="/dashboard/pending"
          className="mb-6 flex items-center justify-between rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white/90 hover:border-accentBlue/50"
        >
          Pending Changes
          {pendingCount > 0 ? (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-black">
              {pendingCount}
            </span>
          ) : null}
        </Link>

        <nav className="space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{group.title}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block rounded-lg px-3 py-1.5 text-sm text-white/80 hover:bg-panel2 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-8 border-t border-border pt-4">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
