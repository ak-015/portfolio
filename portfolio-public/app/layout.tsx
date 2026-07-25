import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProfile, getSocialLinks, getQuickLinks } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.name ?? "Portfolio";
  return {
    title: { default: name, template: `%s | ${name}` },
    description: profile?.tagline ?? "Full stack developer portfolio",
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [profile, socials, quickLinks, serviceLinks] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getQuickLinks("quick"),
    getQuickLinks("services"),
  ]);

  const name = profile?.name ?? "Portfolio";

  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar name={name} resumeUrl={profile?.resumeUrl} />
        <main>{children}</main>
        <Footer
          name={name}
          tagline={profile?.footerTagline}
          quickLinks={quickLinks}
          serviceLinks={serviceLinks}
          socials={socials}
        />
      </body>
    </html>
  );
}
