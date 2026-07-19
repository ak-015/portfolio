import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Timeline, { TimelineItem } from "@/components/Timeline";
import { getEducationEntries } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Education",
  description: "Ankit Kumar's academic background — B.Tech Civil Engineering, NIT Kurukshetra.",
};

export default async function EducationPage() {
  const entries = await getEducationEntries();

  const items: TimelineItem[] = entries.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.institution,
    startLabel: e.startLabel,
    endLabel: e.endLabel,
    description: e.description,
    coverImageUrl: e.coverImageUrl,
    featured: e.featured,
    icon: "book-open",
    colorToken: "blue",
  }));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <SectionHeading eyebrow="Academic background" title="Education" />
      <div className="mt-10">
        {items.length > 0 ? (
          <Timeline items={items} />
        ) : (
          <p className="text-sm text-muted">Education entries coming soon.</p>
        )}
      </div>
    </div>
  );
}
