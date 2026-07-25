import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "../BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { tags: { orderBy: { order: "asc" } } },
  });
  if (!post) notFound();
  return <BlogForm initialPost={JSON.parse(JSON.stringify(post))} />;
}
