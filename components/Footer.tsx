import Link from "next/link";
import { Icon } from "@/lib/icons";
import type { SocialLink } from "@prisma/client";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SERVICES = [
  "Web Development",
  "UI/UX Design",
  "Backend Development",
  "Database Design",
  "Civil Engineering Solutions",
];

export default function Footer({ social }: { social: SocialLink[] }) {
  return (
    <footer className="border-t border-white/5 bg-bg-panel">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">
              AK
            </span>
            <span className="font-display text-lg font-bold text-white">
              Ankit Kumar
            </span>
          </div>
          <p className="max-w-xs text-sm text-muted">
            Full Stack Developer &amp; Civil Engineer, building Territory Run and
            production-grade software with engineering rigor.
          </p>
          {social?.length > 0 && (
            <div className="mt-5 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-bg-border text-white/70 transition-colors hover:border-accent-purple hover:text-accent-purple"
                >
                  <Icon name={s.icon || s.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold text-white">
            Quick Links
          </h3>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-muted">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="focus-ring rounded hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold text-white">
            Services
          </h3>
          <ul className="space-y-3 text-sm text-muted">
            {SERVICES.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Ankit Kumar. All rights reserved.
      </div>
    </footer>
  );
}
