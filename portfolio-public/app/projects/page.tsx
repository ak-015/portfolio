import ProjectFilterGrid from "@/components/ProjectFilterGrid";
import { getAllProjects, getProjectCategories } from "@/lib/data";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getAllProjects(), getProjectCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">Project</h1>
      <p className="mb-10 text-sm text-muted">Some things I&apos;ve built</p>
      <ProjectFilterGrid projects={projects} categories={categories} />
    </div>
  );
}
