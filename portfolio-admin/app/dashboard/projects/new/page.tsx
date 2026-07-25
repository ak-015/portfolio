import { prisma } from "@/lib/prisma";
import ProjectForm from "../ProjectForm";

export default async function NewProjectPage() {
  const [categories, technologies] = await Promise.all([
    prisma.projectCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.technology.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <ProjectForm categories={categories} technologies={technologies} initialProject={null} />;
}
