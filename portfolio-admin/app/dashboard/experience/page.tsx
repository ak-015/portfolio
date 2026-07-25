import { prisma } from "@/lib/prisma";
import ExperienceManager from "./ExperienceManager";

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: { bullets: { orderBy: { order: "asc" } } },
  });

  return <ExperienceManager initialExperiences={JSON.parse(JSON.stringify(experiences))} />;
}
