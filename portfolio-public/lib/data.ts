import { prisma } from "@/lib/prisma";

// Every function here is a thin, cached read against the shared DB.
// No page component or UI component should import PrismaClient directly —
// they all go through this module, which keeps all query shapes in one
// place and makes it obvious nothing user-facing is hardcoded.

export const getProfile = () => prisma.profile.findFirst();

export const getSocialLinks = () =>
  prisma.socialLink.findMany({ where: { visible: true }, orderBy: { order: "asc" } });

export const getQuickLinks = (section: "quick" | "services") =>
  prisma.quickLink.findMany({ where: { section }, orderBy: { order: "asc" } });

export const getStats = (context: "HOME" | "ABOUT" | "EXPERIENCE") =>
  prisma.stat.findMany({ where: { context }, orderBy: { order: "asc" } });

export const getServices = () => prisma.serviceItem.findMany({ orderBy: { order: "asc" } });

export const getTechnologies = () =>
  prisma.technology.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

export const getProjectCategories = () =>
  prisma.projectCategory.findMany({ orderBy: { order: "asc" } });

export const getFeaturedProjects = (take = 4) =>
  prisma.project.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take,
    include: { category: true, technologies: { include: { technology: true }, orderBy: { order: "asc" } } },
  });

export const getAllProjects = () =>
  prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { category: true, technologies: { include: { technology: true }, orderBy: { order: "asc" } } },
  });

export const getProjectBySlug = (slug: string) =>
  prisma.project.findUnique({
    where: { slug },
    include: {
      category: true,
      features: { orderBy: { order: "asc" } },
      technologies: { include: { technology: true }, orderBy: { order: "asc" } },
    },
  });

export const getExperiences = () =>
  prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: { bullets: { orderBy: { order: "asc" } } },
  });

export const getEducationEntries = () =>
  prisma.educationEntry.findMany({ orderBy: { order: "asc" } });

export const getKeySubjects = () => prisma.keySubject.findMany({ orderBy: { order: "asc" } });

export const getAchievements = () => prisma.achievement.findMany({ orderBy: { order: "asc" } });

export const getCertificates = () => prisma.certificate.findMany({ orderBy: { order: "asc" } });

export const getBlogPosts = (take?: number) =>
  prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take,
    include: { tags: { orderBy: { order: "asc" } } },
  });

export const getBlogPostBySlug = (slug: string) =>
  prisma.blogPost.findUnique({ where: { slug }, include: { tags: { orderBy: { order: "asc" } } } });

export const getHobbies = () => prisma.hobby.findMany({ orderBy: { order: "asc" } });

export const getHobbyBySlug = (slug: string) =>
  prisma.hobby.findUnique({
    where: { slug },
    include: {
      subCollections: {
        orderBy: { order: "asc" },
        include: {
          fields: { orderBy: { order: "asc" } },
          entries: {
            orderBy: { order: "asc" },
            include: { values: true },
          },
        },
      },
    },
  });
