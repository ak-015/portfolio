import type { Metadata } from "next";
import { Icon } from "@/lib/icons";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { getAboutSection, getSocialLinks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Ankit Kumar for freelance work or collaboration.",
};

export default async function ContactPage() {
  const [about, social] = await Promise.all([
    getAboutSection("about_intro"),
    getSocialLinks(),
  ]);

  const contactLines = [
    about?.email && { label: about.email, icon: "mail", href: `mailto:${about.email}` },
    about?.phone && { label: about.phone, icon: "phone", href: `tel:${about.phone}` },
    about?.location && { label: about.location, icon: "map-pin", href: undefined },
  ].filter(Boolean) as { label: string; icon: string; href?: string }[];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <SectionHeading eyebrow="Let's talk" title="Contact" subtitle="I'd love to hear from you" />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-8">
          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-white">
              Direct contact
            </h3>
            <ul className="mt-4 space-y-3">
              {contactLines.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm text-muted">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-accent-purple">
                    <Icon name={c.icon} className="h-4 w-4" />
                  </span>
                  {c.href ? (
                    <a href={c.href} className="hover:text-white">
                      {c.label}
                    </a>
                  ) : (
                    c.label
                  )}
                </li>
              ))}
              {contactLines.length === 0 && (
                <li className="text-sm text-muted">Contact details coming soon.</li>
              )}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-lg font-semibold text-white">
              Find me online
            </h3>
            <div className="mt-4 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-bg-border text-white/70 transition-colors hover:border-accent-purple hover:text-accent-purple"
                >
                  <Icon name={s.icon || s.platform} className="h-4 w-4" />
                </a>
              ))}
              {social.length === 0 && (
                <p className="text-sm text-muted">Social links coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
