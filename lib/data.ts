import { prisma } from "@/lib/prisma";

// Every function here hits the database directly. Pages that call these are
// marked `export const dynamic = "force-dynamic"` so nothing is baked in at
// build time — the admin portal's edits show up immediately.

export async function getAboutSection(section: string) {
  return prisma.aboutContent.findUnique({ where: { section } });
}

export async function getRoleTitles() {
  return prisma.roleTitle.findMany({ orderBy: { order: "asc" } });
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getStats() {
  return prisma.statItem.findMany({ orderBy: { order: "asc" } });
}

export async function getServices() {
  return prisma.serviceItem.findMany({ orderBy: { order: "asc" } });
}

export async function getTechStack() {
  const items = await prisma.techStackItem.findMany({ orderBy: { order: "asc" } });
  const grouped: Record<string, typeof items> = {};
  for (const item of items) {
    grouped[item.category] = grouped[item.category] || [];
    grouped[item.category].push(item);
  }
  return grouped;
}

export async function getFeaturedProjects(limit = 4) {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: limit,
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({ where: { slug } });
}

export async function getExperienceEntries() {
  return prisma.experienceEntry.findMany({ orderBy: { order: "asc" } });
}

export async function getEducationEntries() {
  return prisma.educationEntry.findMany({ orderBy: { order: "asc" } });
}

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getLatestBlogPosts(limit = 4) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug } });
}

export async function getHobbyCards() {
  return prisma.hobbyCard.findMany({ orderBy: { order: "asc" } });
}

export async function getHobbyCardBySlug(slug: string) {
  return prisma.hobbyCard.findFirst({
    where: { slug },
    include: {
      subcollections: {
        orderBy: { order: "asc" },
        include: {
          fields: { orderBy: { order: "asc" } },
          entries: {
            orderBy: { order: "asc" },
            include: { values: { include: { field: true } } },
          },
        },
      },
    },
  });
}
