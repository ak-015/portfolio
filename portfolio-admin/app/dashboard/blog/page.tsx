import { prisma } from "@/lib/prisma";
import BlogList from "./BlogList";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
  return <BlogList initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
