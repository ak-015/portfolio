import EducationSection from "@/components/EducationSection";
import CertificateGrid from "@/components/CertificateGrid";
import { getEducationEntries, getKeySubjects, getAchievements, getCertificates } from "@/lib/data";

export const metadata = { title: "Education" };

export default async function EducationPage() {
  const [entries, keySubjects, achievements, certificates] = await Promise.all([
    getEducationEntries(),
    getKeySubjects(),
    getAchievements(),
    getCertificates(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <EducationSection entries={entries} keySubjects={keySubjects} achievements={achievements} />
      <div className="mt-14">
        <CertificateGrid certificates={certificates} />
      </div>
    </div>
  );
}
