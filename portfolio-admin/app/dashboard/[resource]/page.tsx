import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RESOURCES } from "@/lib/resources";
import ResourceManager from "./ResourceManager";

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = RESOURCES[resource];
  if (!config) notFound();

  const delegate = (prisma as unknown as Record<string, any>)[config.model];
  const rows = await delegate.findMany({ orderBy: { order: "asc" } }).catch(() => delegate.findMany());

  return <ResourceManager config={config} initialRows={JSON.parse(JSON.stringify(rows))} />;
}
