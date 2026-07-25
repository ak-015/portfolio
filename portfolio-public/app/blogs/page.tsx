import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/data";

export const metadata = { title: "Blogs" };

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="mb-10 text-3xl font-bold text-white">Blogs</h1>
      {posts.length === 0 ? (
        <p className="text-muted">No posts published yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} layout="row" />
          ))}
        </div>
      )}
    </div>
  );
}
