import { notFound } from "next/navigation";
import { getHobbyBySlug, getHobbies } from "@/lib/data";
import HobbySubCollectionSection from "@/components/HobbySubCollectionSection";

export async function generateStaticParams() {
  const hobbies = await getHobbies();
  return hobbies.map((h) => ({ hobby: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ hobby: string }> }) {
  const { hobby: hobbySlug } = await params;
  const hobby = await getHobbyBySlug(hobbySlug);
  return { title: hobby?.name ?? "Hobby" };
}

export default async function HobbyDetailPage({ params }: { params: Promise<{ hobby: string }> }) {
  const { hobby: hobbySlug } = await params;
  const hobby = await getHobbyBySlug(hobbySlug);
  if (!hobby) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 xl:px-8 xl:py-20">
      <h1 className="mb-10 text-3xl font-bold text-white">{hobby.name}</h1>

      {hobby.subCollections.length === 0 ? (
        <p className="text-muted">No content configured for this hobby yet.</p>
      ) : (
        hobby.subCollections.map((sub) => (
          <HobbySubCollectionSection key={sub.id} subCollection={sub} />
        ))
      )}
    </div>
  );
}
