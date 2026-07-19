import Image from "next/image";
import type { Metadata } from "next";
import { Icon } from "@/lib/icons";
import StatStrip from "@/components/StatStrip";
import HobbiesGrid from "@/components/HobbiesGrid";
import TechStackGrid from "@/components/TechStackGrid";
import SectionHeading from "@/components/SectionHeading";
import Timeline, { TimelineItem } from "@/components/Timeline";
import {
  getAboutSection,
  getStats,
  getHobbyCards,
  getTechStack,
  getEducationEntries,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Civil Engineer by degree, developer by passion — Ankit Kumar's journey.",
};

const INFO_ICONS: Record<string, string> = {
  Name: "users",
  Email: "mail",
  "Phone No.": "phone",
  Education: "book-open",
  Location: "map-pin",
  Languages: "globe",
};

export default async function AboutPage() {
  const [hero, about, stats, hobbies, techStack, education] = await Promise.all([
    getAboutSection("hero"),
    getAboutSection("about_intro"),
    getStats(),
    getHobbyCards(),
    getTechStack(),
    getEducationEntries(),
  ]);

  const info: Record<string, string | null | undefined> = {
    Name: about?.name ?? hero?.name,
    Email: about?.email,
    "Phone No.": about?.phone,
    Education: about?.educationLabel,
    Location: about?.location,
    Languages: about?.languages,
  };

  const journeyItems: TimelineItem[] = education.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.institution,
    startLabel: e.startLabel,
    endLabel: e.endLabel,
    description: e.description,
    coverImageUrl: e.coverImageUrl,
    featured: e.featured,
    icon: "book-open",
    colorToken: "purple",
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <SectionHeading eyebrow="Know more about me" title="About Me" />

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-accent-purple/40">
          {about?.profileImageUrl || hero?.profileImageUrl ? (
            <Image
              src={(about?.profileImageUrl || hero?.profileImageUrl) as string}
              alt={info.Name || "Ankit Kumar"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-bg-card text-muted">
              Profile photo
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Civil Engineer by <span className="text-gradient">degree</span>,<br />
            Developer by <span className="text-gradient">passion</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {about?.body ||
              `I'm a Full Stack Developer and Civil Engineer who brings analytical, standards-driven engineering rigor into building production-grade software — that dual background is what sets my work apart.`}
          </p>

          <dl className="mt-8 divide-y divide-bg-border rounded-xl border border-bg-border">
            {Object.entries(info).map(([label, value]) => (
              <div key={label} className="flex items-center gap-4 px-4 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-accent-purple">
                  <Icon name={INFO_ICONS[label]} className="h-4 w-4" />
                </span>
                <dt className="w-28 shrink-0 text-sm text-white/70">{label}</dt>
                <dd className="text-sm text-white">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-14">
        <StatStrip stats={stats} layout="grid" />
      </div>

      {journeyItems.length > 0 && (
        <div className="mt-16">
          <SectionHeading title="My Journey" subtitle="From civil engineering to code" />
          <div className="mt-8">
            <Timeline items={journeyItems} />
          </div>
        </div>
      )}

      <div className="mt-16">
        <SectionHeading title="My Hobbies" subtitle="Things I enjoy" />
        <div className="mt-8">
          <HobbiesGrid hobbies={hobbies} />
        </div>
      </div>

      <div className="mt-16">
        <TechStackGrid grouped={techStack} />
      </div>
    </div>
  );
}
