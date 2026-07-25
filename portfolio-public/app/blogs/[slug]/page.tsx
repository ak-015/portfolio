import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { cldThumb } from "@/lib/cloudinary";
import { sanitizeBlogHtml } from "@/lib/sanitizeHtml";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="mb-6 text-3xl font-bold text-white">{post.title}</h1>

      {post.tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t.id} className="rounded-md bg-panel2 px-2 py-1 text-xs text-accentBlue">
              {t.label}
            </span>
          ))}
        </div>
      ) : null}

      {post.coverImageUrl ? (
        <div className="relative mb-10 h-72 w-full overflow-hidden rounded-2xl bg-panel2">
          <Image src={cldThumb(post.coverImageUrl, 1000)} alt={post.title} fill className="object-cover" />
        </div>
      ) : null}

      {/* contentHtml is authored through the admin panel's rich-text
          editor, but it's still sanitized here (allowlisted tags/attrs
          only) before rendering — cheap insurance against stored XSS if
          that ever changes. */}
      <article
        className="prose prose-invert max-w-none prose-headings:text-accentBlue prose-a:text-accentBlue"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.contentHtml) }}
      />

      {(post.liveDemoUrl || post.githubUrl) ? (
        <div className="mt-10 flex gap-4">
          {post.liveDemoUrl ? (
            <a href={post.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-grad-primary px-6 py-3 text-sm font-medium text-white">
              Live Demo
            </a>
          ) : null}
          {post.githubUrl ? (
            <a href={post.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-panel2 px-6 py-3 text-sm font-medium text-white/90">
              GitHub
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
