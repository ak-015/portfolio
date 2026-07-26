import ProjectFilterGrid from "@/components/ProjectFilterGrid";
import { getAllProjects, getProjectCategories } from "@/lib/data";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getAllProjects(), getProjectCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 xl:max-w-full xl:px-14 2xl:px-20 xl:py-20">
      <h1 className="text-3xl font-bold text-white xl:text-4xl">Project</h1>
      <p className="mb-10 text-sm text-muted xl:text-base">Some things I've built</p>
      <ProjectFilterGrid projects={projects} categories={categories} />
    </div>
  );
}
