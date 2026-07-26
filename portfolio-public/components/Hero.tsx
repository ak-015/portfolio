import Image from "next/image";
import ParticleNetwork from "./ParticleNetwork";
import FloatingCubes from "./FloatingCubes";
import { Icon } from "@/lib/icons";
import { cldThumb } from "@/lib/cloudinary";

type SocialItem = { id: string; platform: string; url: string; icon: string };

export default function Hero({
  name,
  roles,
  tagline,
  profileImageUrl,
  resumeUrl,
  socials,
}: {
  name: string;
  roles: string[];
  tagline: string;
  profileImageUrl?: string | null;
  resumeUrl?: string | null;
  socials: SocialItem[];
}) {
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <section className="relative overflow-hidden">
      <ParticleNetwork />
      <FloatingCubes />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-10 md:py-28 xl:max-w-full xl:px-14 2xl:px-20 xl:gap-12">
        <div className="xl:max-w-xl">
          <p className="mb-3 text-sm text-muted">Hello, I'm</p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl xl:text-6xl">
            {firstName}{" "}
            <span className="bg-grad-primary bg-clip-text text-transparent">{lastName}</span>
          </h1>

          {roles.length > 0 ? (
            <p className="mt-4 text-lg font-medium text-white/90 xl:text-xl">{roles.join(" | ")}</p>
          ) : null}

          <p className="mt-4 max-w-lg text-muted xl:text-lg">{tagline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill bg-grad-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accentPurple/25 transition-transform hover:scale-[1.03] xl:px-8 xl:py-3.5 xl:text-base"
              >
                Download Resume
              </a>
            ) : null}
            <a
              href="/projects"
              className="rounded-pill border border-border bg-panel2 px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:border-white/30 xl:px-8 xl:py-3.5 xl:text-base"
            >
              View Projects
            </a>
          </div>

          {socials.length > 0 ? (
            <div className="mt-8 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-white/80 transition-colors hover:border-white/40 hover:text-white xl:h-12 xl:w-12"
                >
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] xl:h-[440px] xl:w-[440px]">
          <div className="absolute inset-0 rounded-full bg-grad-primary opacity-40 blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-accentBlue/60 shadow-[0_0_60px_rgba(59,130,246,0.35)]">
            {profileImageUrl ? (
              <Image
                src={cldThumb(profileImageUrl, 760)}
                alt={name}
                fill
                sizes="(max-width: 640px) 320px, (max-width: 1280px) 380px, 440px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-panel2 text-muted">
                No photo set
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
