import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HobbyManager from "./HobbyManager";

export default async function HobbyDetailPage({
  params,
}: {
  params: Promise<{ hobbyId: string }>;
}) {
  const { hobbyId } = await params;
  const hobby = await prisma.hobby.findUnique({
    where: { id: hobbyId },
    include: {
      subCollections: {
        orderBy: { order: "asc" },
        include: {
          fields: { orderBy: { order: "asc" } },
          entries: { orderBy: { order: "asc" }, include: { values: true } },
        },
      },
    },
  });

  if (!hobby) notFound();

  return <HobbyManager hobby={JSON.parse(JSON.stringify(hobby))} />;
}
