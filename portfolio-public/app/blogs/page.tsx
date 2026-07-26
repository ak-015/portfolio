import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/data";

export const metadata = { title: "Blogs" };

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 xl:max-w-full xl:px-14 2xl:px-20 xl:py-20">
      <h1 className="mb-10 text-3xl font-bold text-white xl:text-4xl">Blogs</h1>
      {posts.length === 0 ? (
        <p className="text-muted">No posts published yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
