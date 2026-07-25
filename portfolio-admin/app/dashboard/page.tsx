import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";

export default async function DashboardHome() {
  const [projects, hobbies, blogPosts, pending] = await Promise.all([
    prisma.project.count(),
    prisma.hobby.count(),
    prisma.blogPost.count(),
    prisma.pendingChange.count(),
  ]);

  const tiles = [
    { label: "Projects", value: projects, href: "/dashboard/projects" },
    { label: "Hobbies", value: hobbies, href: "/dashboard/hobbies" },
    { label: "Blog Posts", value: blogPosts, href: "/dashboard/blog" },
    { label: "Pending Changes", value: pending, href: "/dashboard/pending" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">Dashboard</h1>
      <p className="mb-8 text-sm text-muted">
        Edits are staged, not applied instantly — review and confirm each section from{" "}
        <Link href="/dashboard/pending" className="text-accentBlue hover:underline">
          Pending Changes
        </Link>{" "}
        with a one-time code sent to your email.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}>
            <Card className="transition-colors hover:border-white/20">
              <p className="text-3xl font-bold text-white">{t.value}</p>
              <p className="mt-1 text-sm text-muted">{t.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
