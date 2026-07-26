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
    <div className="mx-auto max-w-7xl px-6 py-14 xl:max-w-full xl:px-14 2xl:px-20 xl:py-20">
      <h1 className="text-3xl font-bold text-white xl:text-4xl">About Me</h1>
      <p className="mb-10 text-sm text-muted xl:text-base">know more about me</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr] xl:gap-10">
        <div className="relative mx-auto h-[340px] w-[260px] overflow-hidden rounded-2xl border border-accentPurple/40 xl:h-[400px] xl:w-[300px]">
          {profile.profileImageUrl ? (
            <Image src={cldThumb(profile.profileImageUrl, 600)} alt={profile.name} fill className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-panel2 text-muted">No photo</div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            {profile.aboutHeadlinePrefix}
            <span className="bg-grad-primary bg-clip-text text-transparent">{profile.aboutHeadlineWord1}</span>
            {profile.aboutHeadlineMiddle}
            <span className="bg-grad-primary bg-clip-text text-transparent">{profile.aboutHeadlineWord2}</span>
          </h2>
          {profile.aboutIntro ? <p className="mt-4 max-w-2xl text-muted xl:text-lg">{profile.aboutIntro}</p> : null}
          {profile.positioningCopy ? (
            <p className="mt-4 max-w-2xl text-muted xl:text-lg">{profile.positioningCopy}</p>
          ) : null}

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mt-10">
            {infoRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center text-accentBlue shrink-0">{row.icon}</span>
                <dt className="w-28 text-muted shrink-0">{row.label}</dt>
                <dd className="text-white/90">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-12 xl:mt-16">
        <StatStrip stats={stats} />
      </div>

      <div className="mt-14 xl:mt-20">
        <HobbyGrid hobbies={hobbies} />
      </div>

      <div className="mt-14 xl:mt-20">
        <TechStackGrid technologies={technologies} />
      </div>
    </div>
  );
}
