import Link from "next/link";
import Hero from "@/components/Hero";
import StatStrip from "@/components/StatStrip";
import ProjectFilterGrid from "@/components/ProjectFilterGrid";
import ServicesGrid from "@/components/ServicesGrid";
import BlogCard from "@/components/BlogCard";
import {
  getProfile,
  getSocialLinks,
  getStats,
  getAllProjects,
  getProjectCategories,
  getServices,
  getBlogPosts,
} from "@/lib/data";

export default async function HomePage() {
  const [profile, socials, stats, projects, categories, services, posts] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getStats("HOME"),
    getAllProjects(),
    getProjectCategories(),
    getServices(),
    getBlogPosts(4),
  ]);

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">
        Profile has not been configured yet. Add a Profile record in the admin panel.
      </div>
    );
  }

  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const projectsForGrid = (featured.length > 0 ? featured : projects).slice(0, 4);

  return (
    <>
      <Hero
        name={profile.name}
        roles={profile.roles}
        tagline={profile.tagline}
        profileImageUrl={profile.profileImageUrl}
        resumeUrl={profile.resumeUrl}
        socials={socials}
      />

      <section className="mx-auto -mt-6 max-w-7xl px-6 xl:max-w-full xl:px-14 2xl:px-20">
        <StatStrip stats={stats} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 xl:max-w-full xl:px-14 2xl:px-20 xl:py-20">
        <div className="mb-8 flex items-center justify-between xl:mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white xl:text-3xl">Featured Projects</h2>
            <p className="mt-1 text-sm text-muted">some things I have built</p>
          </div>
          <Link href="/projects" className="text-sm text-accentBlue hover:underline xl:text-base">
            View all →
          </Link>
        </div>
        <ProjectFilterGrid projects={projectsForGrid} categories={categories} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 xl:max-w-full xl:px-14 2xl:px-20 xl:pb-20">
        <ServicesGrid services={services} />
      </section>

      {posts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-20 xl:max-w-full xl:px-14 2xl:px-20 xl:pb-24">
          <div className="mb-8 flex items-center justify-between xl:mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white xl:text-3xl">Latest Blog</h2>
              <p className="mt-1 text-sm text-muted">thoughts and insights</p>
            </div>
            <Link href="/blogs" className="text-sm text-accentBlue hover:underline xl:text-base">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
