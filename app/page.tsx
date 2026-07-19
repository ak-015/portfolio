import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/lib/icons";
import FloatingCubes from "@/components/FloatingCubes";
import StatStrip from "@/components/StatStrip";
import ProjectGrid from "@/components/ProjectGrid";
import ServicesGrid from "@/components/ServicesGrid";
import BlogCard from "@/components/BlogCard";
import SectionHeading from "@/components/SectionHeading";
import {
  getAboutSection,
  getRoleTitles,
  getSocialLinks,
  getStats,
  getFeaturedProjects,
  getServices,
  getLatestBlogPosts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, roles, social, stats, projects, services, posts] = await Promise.all([
    getAboutSection("hero"),
    getRoleTitles(),
    getSocialLinks(),
    getStats(),
    getFeaturedProjects(4),
    getServices(),
    getLatestBlogPosts(4),
  ]);

  const roleLine = roles.map((r) => r.title).join(" | ");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 lg:pt-16">
        <div className="absolute inset-0 bg-gradient-radial-glow" aria-hidden="true" />
        <FloatingCubes />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-lg text-white/80">
              Hello, I&apos;m
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-tight text-white sm:text-6xl">
              {hero?.name?.split(" ")[0] || "Ankit"}{" "}
              <span className="text-gradient">
                {hero?.name?.split(" ").slice(1).join(" ") || "Kumar"}
              </span>
            </h1>
            {roleLine && (
              <p className="mt-4 text-lg font-medium text-white/90">{roleLine}</p>
            )}
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              {hero?.body ||
                "I build beautiful, functional and user-centric digital experiences that solve real-world problems."}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={hero?.resumeUrl || "#"} className="btn-primary">
                Download Resume
              </a>
              <Link href="/projects" className="btn-secondary">
                View Projects
              </Link>
            </div>
            {social?.length > 0 && (
              <div className="mt-8 flex gap-4">
                {social.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-bg-border text-white/80 transition-colors hover:border-accent-purple hover:text-accent-purple"
                  >
                    <Icon name={s.icon || s.platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-gradient-brand opacity-30 blur-3xl" />
            <div className="absolute inset-6 animate-pulseGlow rounded-full border-2 border-accent-blue/70 shadow-glow" />
            <div className="absolute inset-10 overflow-hidden rounded-full border border-white/10">
              {hero?.profileImageUrl ? (
                <Image
                  src={hero.profileImageUrl}
                  alt={hero.name || "Profile photo"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-bg-card text-muted">
                  Profile photo
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-7xl">
          <StatStrip stats={stats} />
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Featured Projects"
            subtitle="Some things I have built"
            align="center"
          />
          <div className="mt-10">
            <ProjectGrid projects={projects} />
          </div>
        </div>
      </section>

      {/* What I Do */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="What I Do" subtitle="Services I offer" align="center" />
          <div className="mt-10">
            <ServicesGrid services={services} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/contact" className="btn-primary">
              Hire Me
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog */}
      {posts.length > 0 && (
        <section className="px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title="Latest Blog" />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
