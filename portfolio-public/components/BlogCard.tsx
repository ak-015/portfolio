import Image from "next/image";
import Link from "next/link";
import { cldThumb } from "@/lib/cloudinary";

export type BlogCardData = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl?: string | null;
  publishedAt: Date | string;
  tags: { id: string; label: string }[];
};

function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const days = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export default function BlogCard({ post, layout = "grid" }: { post: BlogCardData; layout?: "grid" | "row" }) {
  const dateLabel = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (layout === "row") {
    return (
      <Link
        href={`/blogs/${post.slug}`}
        className="flex items-center gap-6 rounded-2xl border border-border bg-panel/70 p-4 transition-colors hover:border-white/20"
      >
        <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-xl bg-panel2">
          {post.coverImageUrl ? (
            <Image src={cldThumb(post.coverImageUrl, 400)} alt={post.title} fill className="object-cover" />
          ) : null}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{post.title}</h3>
          {post.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t.id} className="rounded-md bg-panel2 px-2 py-1 text-xs text-accentBlue">
                  {t.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="block overflow-hidden rounded-2xl border border-border bg-panel transition-transform hover:-translate-y-1 hover:border-white/20"
    >
      <div className="relative h-40 w-full bg-panel2">
        {post.coverImageUrl ? (
          <Image src={cldThumb(post.coverImageUrl, 640)} alt={post.title} fill className="object-cover" />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white">{post.title}</h3>
        <p className="mt-2 text-xs text-muted">
          {dateLabel} · {timeAgo(post.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
