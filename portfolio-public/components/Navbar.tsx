"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/lib/icons";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

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
  hideExperience = false,
}: {
  name: string;
  resumeUrl?: string | null;
  hideExperience?: boolean;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = hideExperience ? NAV_ITEMS.filter((item) => item.href !== "/experience") : NAV_ITEMS;
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 xl:max-w-full xl:px-14 2xl:px-20">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-grad-primary text-sm">
            {initials}
          </span>
          {name}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive(item.href) ? "text-white font-medium" : "text-muted hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop resume button + mobile hamburger */}
        <div className="flex items-center gap-3">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-pill bg-grad-primary px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accentPurple/20 transition-transform hover:scale-[1.03] md:inline-block"
            >
              Download Resume
            </a>
          ) : (
            <span className="hidden rounded-pill bg-panel2 px-5 py-2 text-sm text-muted md:inline-block">
              Resume coming soon
            </span>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-white/80 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-border/60 bg-bg/95 backdrop-blur md:hidden">
          <ul className="space-y-1 px-6 py-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-grad-primary text-white font-medium"
                      : "text-muted hover:bg-panel2 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {resumeUrl ? (
              <li className="pt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg bg-grad-primary px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Download Resume
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </header>
  );
}