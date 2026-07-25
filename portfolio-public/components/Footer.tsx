import Link from "next/link";
import { Icon } from "@/lib/icons";

type LinkItem = { id: string; label: string; href: string };
type SocialItem = { id: string; platform: string; url: string; icon: string };

export default function Footer({
  name,
  tagline,
  quickLinks,
  serviceLinks,
  socials,
}: {
  name: string;
  tagline?: string | null;
  quickLinks: LinkItem[];
  serviceLinks: LinkItem[];
  socials: SocialItem[];
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <footer className="border-t border-border/60 bg-bg">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-grad-primary text-sm">
              {initials}
            </span>
            {name}
          </div>
          {tagline ? <p className="mt-3 max-w-xs text-sm text-muted">{tagline}</p> : null}
          {socials.length > 0 ? (
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-white"
                >
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted">
            {quickLinks.map((l) => (
              <li key={l.id}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">Services</h3>
          <ul className="space-y-2 text-sm text-muted">
            {serviceLinks.map((l) => (
              <li key={l.id}>. {l.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
