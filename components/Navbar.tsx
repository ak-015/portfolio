"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/education", label: "Education" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ resumeUrl }: { resumeUrl: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-bg/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-md">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">
            AK
          </span>
          <span className="font-display text-lg font-bold text-white">
            Ankit Kumar
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`focus-ring rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-accent-purple"
                    : "text-white/70 hover:text-white"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={resumeUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !px-5 !py-2.5 !text-xs"
          >
            Download Resume
          </a>
        </div>

        <button
          className="focus-ring rounded-md p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-bg px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium ${
                    isActive(link.href) ? "text-accent-purple" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={resumeUrl || "#"} className="btn-primary w-full !text-xs">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
