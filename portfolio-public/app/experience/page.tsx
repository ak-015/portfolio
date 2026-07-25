import ExperienceTimeline from "@/components/ExperienceTimeline";
import { getExperiences, getStats } from "@/lib/data";

export const metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const [experiences, stats] = await Promise.all([getExperiences(), getStats("EXPERIENCE")]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <ExperienceTimeline experiences={experiences} stats={stats} />
    </div>
  );
}
