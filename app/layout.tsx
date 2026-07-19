import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAboutSection, getSocialLinks } from "@/lib/data";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Ankit Kumar — Full Stack Developer & Civil Engineer",
    template: "%s | Ankit Kumar",
  },
  description:
    "Ankit Kumar is a Full Stack Developer and Civil Engineer building Territory Run and production-grade web applications with analytical, standards-driven engineering rigor.",
  openGraph: {
    title: "Ankit Kumar — Full Stack Developer & Civil Engineer",
    description:
      "Portfolio of Ankit Kumar: full-stack projects, civil engineering background, and Territory Run.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hero, social] = await Promise.all([
    getAboutSection("hero").catch(() => null),
    getSocialLinks().catch(() => []),
  ]);

  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Navbar resumeUrl={hero?.resumeUrl ?? "#"} />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer social={social} />
      </body>
    </html>
  );
}
