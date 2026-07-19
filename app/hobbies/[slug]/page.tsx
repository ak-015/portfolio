import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import HobbyEntryCard from "@/components/HobbyEntryCard";
import { getHobbyCardBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hobby = await getHobbyCardBySlug(slug);
  if (!hobby) return {};
  return { title: hobby.title, description: hobby.description || undefined };
}

export default async function HobbyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hobby = await getHobbyCardBySlug(slug);
  if (!hobby) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <SectionHeading eyebrow="Hobby" title={hobby.title} subtitle={hobby.description || undefined} />

      <div className="mt-10 space-y-14">
        {hobby.subcollections.map((sub) => (
          <div key={sub.id}>
            <h2 className="font-display text-xl font-bold text-white">{sub.title}</h2>
            <div className="mt-2 h-px w-16 bg-gradient-brand" />

            {sub.entries.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sub.entries.map((entry) => (
                  <HobbyEntryCard
                    key={entry.id}
                    fields={sub.fields}
                    values={entry.values.map((v) => ({ fieldId: v.fieldId, value: v.value }))}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Nothing added here yet.</p>
            )}
          </div>
        ))}

        {hobby.subcollections.length === 0 && (
          <p className="text-sm text-muted">
            No sub-collections defined for this hobby yet.
          </p>
        )}
      </div>
    </div>
  );
}
