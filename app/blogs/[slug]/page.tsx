import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [post.coverImageUrl] },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <p className="section-eyebrow mb-3">
        {date} · {post.readTimeLabel || "5 min read"}
      </p>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {post.title}
      </h1>

      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-bg-border bg-white/5">
        <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" priority />
      </div>

      <div
        className="prose prose-invert mt-10 max-w-none text-sm leading-relaxed text-muted prose-headings:font-display prose-headings:text-white prose-a:text-accent-cyan"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
