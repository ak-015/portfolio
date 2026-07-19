import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles by Ankit Kumar on web development, civil engineering, and more.",
};

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <SectionHeading eyebrow="Writing" title="Blog" />
      <div className="mt-10">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No posts published yet — check back soon.</p>
        )}
      </div>
    </div>
  );
}
