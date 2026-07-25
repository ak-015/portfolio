import { prisma } from "@/lib/prisma";
import ContactEditor from "./ContactEditor";

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst();
  return <ContactEditor initialProfile={profile ? JSON.parse(JSON.stringify(profile)) : null} />;
}
