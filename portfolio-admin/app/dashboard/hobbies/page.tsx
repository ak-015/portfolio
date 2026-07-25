import { prisma } from "@/lib/prisma";
import HobbiesList from "./HobbiesList";

export default async function HobbiesPage() {
  const hobbies = await prisma.hobby.findMany({
    orderBy: { order: "asc" },
    include: { subCollections: { include: { _count: { select: { entries: true } } } } },
  });

  return <HobbiesList initialHobbies={JSON.parse(JSON.stringify(hobbies))} />;
}
