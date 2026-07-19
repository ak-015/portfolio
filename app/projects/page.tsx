import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectGrid from "@/components/ProjectGrid";
import { getAllProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Web, Android, and civil engineering projects built by Ankit Kumar.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <SectionHeading eyebrow="Portfolio" title="Projects" subtitle="Some things I've built" />
      <div className="mt-10">
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
