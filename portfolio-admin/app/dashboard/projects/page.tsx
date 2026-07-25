import { prisma } from "@/lib/prisma";
import ProjectsList from "./ProjectsList";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { category: true },
  });

  return <ProjectsList initialProjects={JSON.parse(JSON.stringify(projects))} />;
}
