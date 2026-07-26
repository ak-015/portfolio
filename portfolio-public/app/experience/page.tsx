import ExperienceTimeline from "@/components/ExperienceTimeline";
import { getExperiences, getStats } from "@/lib/data";

export const metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const [experiences, stats] = await Promise.all([getExperiences(), getStats("EXPERIENCE")]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 xl:max-w-full xl:px-14 2xl:px-20 xl:py-20">
      <ExperienceTimeline experiences={experiences} stats={stats} />
    </div>
  );
}
