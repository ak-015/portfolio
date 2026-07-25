"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/lib/icons";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({
  name,
  resumeUrl,
}: {
  name: string;
  resumeUrl?: string | null;
}) {
  const pathname = usePathname();
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-grad-primary text-sm">
            {initials}
          </span>
          {name}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm transition-colors ${
                    active ? "text-white font-medium" : "text-muted hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill bg-grad-primary px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accentPurple/20 transition-transform hover:scale-[1.03]"
          >
            Download Resume
          </a>
        ) : (
          <span className="rounded-pill bg-panel2 px-5 py-2 text-sm text-muted">
            Resume coming soon
          </span>
        )}
      </nav>
    </header>
  );
}
