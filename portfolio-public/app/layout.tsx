import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProfile, getSocialLinks, getQuickLinks, getSiteSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name ?? "Portfolio";
  return {
    title: { default: name, template: `%s | ${name}` },
    description: profile?.tagline ?? "Full stack developer portfolio",
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    icons: {
      icon: "/logo.svg",
      shortcut: "/logo.svg",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, socials, quickLinks, serviceLinks, settings] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getQuickLinks("quick"),
    getQuickLinks("services"),
    getSiteSettings(),
  ]);

  const name = profile?.name ?? "Portfolio";

  // Admin-controlled Experience section toggle (Dashboard → Settings):
  // strip the footer's Experience quick link too so the two never
  // disagree — the /experience route itself 404s independently.
  const visibleQuickLinks = settings.experienceVisible
    ? quickLinks
    : quickLinks.filter((l) => l.href !== "/experience");

  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar name={name} resumeUrl={profile?.resumeUrl} hideExperience={!settings.experienceVisible} />
        <main>{children}</main>
        <Footer
          name={name}
          tagline={profile?.footerTagline}
          quickLinks={visibleQuickLinks}
          serviceLinks={serviceLinks}
          socials={socials}
        />
      </body>
    </html>
  );
}
