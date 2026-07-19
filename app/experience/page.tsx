import type { Metadata } from "next";
import StatStrip from "@/components/StatStrip";
import Timeline, { TimelineItem } from "@/components/Timeline";
import { getExperienceEntries, getStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Ankit Kumar's professional journey across development and engineering roles.",
};

export default async function ExperiencePage() {
  const [entries, stats] = await Promise.all([getExperienceEntries(), getStats()]);

  const items: TimelineItem[] = entries.map((e) => ({
    id: e.id,
    title: e.role,
    subtitle: e.company,
    startLabel: e.startLabel,
    endLabel: e.endLabel,
    bullets: e.bullets,
    icon: e.icon,
    colorToken: e.colorToken,
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="font-display text-3xl font-bold text-white">Experience</h1>
          <p className="mt-1 text-sm text-muted">My professional journey</p>
          <div className="mt-8">
            <StatStrip stats={stats} layout="grid" />
          </div>
        </aside>
        <div>
          {items.length > 0 ? (
            <Timeline items={items} />
          ) : (
            <p className="text-sm text-muted">
              Roles will appear here once added via the admin portal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
