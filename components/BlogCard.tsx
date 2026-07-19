import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@prisma/client";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="card card-hover focus-ring group block overflow-hidden"
    >
      <div className="relative h-40 w-full overflow-hidden bg-white/5">
        <Image
          src={post.coverImageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-white transition-colors group-hover:text-accent-purple">
          {post.title}
        </h3>
        <p className="mt-3 text-xs text-muted">
          {date} · {post.readTimeLabel || "5 min read"}
        </p>
      </div>
    </Link>
  );
}
