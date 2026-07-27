import { prisma } from "@/lib/prisma";
import SettingsEditor from "./SettingsEditor";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return <SettingsEditor initialSettings={settings ? JSON.parse(JSON.stringify(settings)) : null} />;
}
