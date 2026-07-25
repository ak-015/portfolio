import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import ContactForm from "@/components/ContactForm";
import { Icon } from "@/lib/icons";
import { getProfile, getSocialLinks } from "@/lib/data";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [profile, socials] = await Promise.all([getProfile(), getSocialLinks()]);

  if (!profile) {
    return <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">Profile not configured yet.</div>;
  }

  const mapEmbedSrc =
    profile.mapLatitude && profile.mapLongitude
      ? `https://maps.google.com/maps?q=${profile.mapLatitude},${profile.mapLongitude}&z=13&output=embed`
      : null;
  const mapsLink =
    profile.mapLatitude && profile.mapLongitude
      ? `https://www.google.com/maps?q=${profile.mapLatitude},${profile.mapLongitude}`
      : "#";

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-white">Contact Me</h1>
          <p className="mb-6 text-sm text-muted">Let&apos;s work together</p>
          <p className="mb-6 text-sm text-muted">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>

          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">Get In Touch</h2>
          <div className="space-y-3">
            <InfoCard icon={<FaEnvelope />} label="Email" value={profile.email} color="text-accentPurple" />
            <InfoCard icon={<FaPhoneAlt />} label="Phone" value={profile.phone} color="text-accentBlue" />
            <InfoCard icon={<FaMapMarkerAlt />} label="Location" value={profile.location} color="text-emerald-400" />
            {profile.availabilityStatus ? (
              <InfoCard icon={<FaClock />} label="Availability" value={profile.availabilityStatus} color="text-amber-400" />
            ) : null}
          </div>

          {profile.bookingLink ? (
            <a
              href={profile.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-between rounded-xl border border-border bg-gradient-to-r from-accentPurple/20 to-accentBlue/20 p-4"
            >
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-accentPurple" />
                <div>
                  <p className="text-sm font-medium text-white">Schedule a Call</p>
                  <p className="text-xs text-muted">Book a 30 mins call to discuss your project</p>
                </div>
              </div>
              <span className="rounded-lg bg-black/40 px-3 py-1.5 text-xs text-white">Book Now →</span>
            </a>
          ) : null}
        </div>

        <div className="space-y-6">
          <ContactForm />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-panel/60 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <FaMapMarkerAlt /> Find Me Here
              </h3>
              <div className="relative h-40 w-full overflow-hidden rounded-lg bg-panel2">
                {mapEmbedSrc ? (
                  <iframe
                    src={mapEmbedSrc}
                    className="h-full w-full border-0"
                    loading="lazy"
                    title="Location map"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-muted">
                    Location not set
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>{profile.mapLocationText}</span>
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accentBlue">
                  View on Maps <FaExternalLinkAlt size={10} />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-panel/60 p-4">
              <h3 className="mb-3 font-semibold text-white">Connect With Me</h3>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="grid h-10 w-10 place-items-center rounded-lg bg-panel2 text-white/80 hover:text-white"
                  >
                    <Icon name={s.icon} />
                  </a>
                ))}
              </div>
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block rounded-lg bg-panel2 py-2 text-center text-sm text-white/90"
                >
                  ↓ Download Resume
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-panel2 p-3">
      <span className={`grid h-9 w-9 place-items-center rounded-lg bg-bg ${color}`}>{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm text-white/90">{value}</p>
      </div>
    </div>
  );
}
