import { prisma } from "@/lib/prisma";
import ProfileEditor from "./ProfileEditor";

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst();
  return <ProfileEditor initialProfile={profile ? JSON.parse(JSON.stringify(profile)) : null} />;
}
