import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern to avoid exhausting DB connections
// in dev with hot-reload. Public app only ever READS from this client —
// it never calls anything that requires migration state.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
