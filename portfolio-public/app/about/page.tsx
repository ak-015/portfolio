import Image from "next/image";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaGlobe, FaGraduationCap } from "react-icons/fa";
import StatStrip from "@/components/StatStrip";
import HobbyGrid from "@/components/HobbyGrid";
import TechStackGrid from "@/components/TechStackGrid";
import { getProfile, getStats, getHobbies, getTechnologies } from "@/lib/data";
import { cldThumb } from "@/lib/cloudinary";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const [profile, stats, hobbies, technologies] = await Promise.all([
    getProfile(),
    getStats("ABOUT"),
    getHobbies(),
    getTechnologies(),
  ]);

  if (!profile) {
    return <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">Profile not configured yet.</div>;
  }

  const infoRows = [
    { icon: null, label: "Name", value: profile.name },
    { icon: <FaEnvelope />, label: "Email", value: profile.email },
    { icon: <FaPhoneAlt />, label: "Phone No.", value: profile.phone },
    { icon: <FaGraduationCap />, label: "Education", value: profile.education },
    { icon: <FaMapMarkerAlt />, label: "Location", value: profile.location },
    { icon: <FaGlobe />, label: "Languages", value: profile.languages },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-3xl font-bold text-white">About Me</h1>
      <p className="mb-10 text-sm text-muted">know more about me</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
        <div className="relative mx-auto h-[340px] w-[260px] overflow-hidden rounded-2xl border border-accentPurple/40">
          {profile.profileImageUrl ? (
            <Image src={cldThumb(profile.profileImageUrl, 600)} alt={profile.name} fill className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-panel2 text-muted">No photo</div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            {profile.aboutHeadlinePrefix}
            <span className="bg-grad-primary bg-clip-text text-transparent">{profile.aboutHeadlineWord1}</span>
            {profile.aboutHeadlineMiddle}
            <span className="bg-grad-primary bg-clip-text text-transparent">{profile.aboutHeadlineWord2}</span>
          </h2>
          {profile.aboutIntro ? <p className="mt-4 max-w-xl text-muted">{profile.aboutIntro}</p> : null}
          {profile.positioningCopy ? (
            <p className="mt-4 max-w-xl text-muted">{profile.positioningCopy}</p>
          ) : null}

          <dl className="mt-8 space-y-4">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center text-accentBlue">{row.icon}</span>
                <dt className="w-28 text-muted">{row.label}</dt>
                <dd className="text-white/90">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-12">
        <StatStrip stats={stats} />
      </div>

      <div className="mt-14">
        <HobbyGrid hobbies={hobbies} />
      </div>

      <div className="mt-14">
        <TechStackGrid technologies={technologies} />
      </div>
    </div>
  );
}
