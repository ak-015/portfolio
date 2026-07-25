import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, categories, technologies] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { features: { orderBy: { order: "asc" } }, technologies: { include: { technology: true } } },
    }),
    prisma.projectCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.technology.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  return (
    <ProjectForm
      categories={categories}
      technologies={technologies}
      initialProject={JSON.parse(JSON.stringify(project))}
    />
  );
}
