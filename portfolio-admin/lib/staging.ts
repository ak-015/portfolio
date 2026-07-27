import { prisma } from "@/lib/prisma";
import { applyPendingChange } from "@/lib/applyChange";
import { triggerPublicRevalidate } from "@/lib/revalidate";
import { PendingAction, Prisma } from "@prisma/client";

// Which public routes a given section's confirmed changes can affect.
// Kept intentionally coarse (a few sections just revalidate everything)
// since over-revalidating is harmless and the public site is read-mostly.
//
// projects / technologies / certificates also feed the live-computed stat
// tiles on Home, About, and Experience (see portfolio-public's getStats),
// so those three pages are included even though their own content lives
// elsewhere.
const SECTION_PATHS: Record<string, string[]> = {
  profile: ["/", "/about", "/contact"],
  "social-links": ["/", "/about", "/contact"],
  "quick-links": ["/", "/about", "/projects", "/experience", "/education", "/blogs", "/contact"],
  stats: ["/", "/about", "/experience"],
  services: ["/"],
  technologies: ["/", "/about", "/experience", "/projects"],
  "project-categories": ["/", "/projects"],
  projects: ["/", "/about", "/experience", "/projects"],
  experience: ["/experience"],
  education: ["/education"],
  certificates: ["/", "/about", "/experience", "/education"],
  blog: ["/", "/blogs"],
  // Revalidated with mode "layout" in commitSection — "/" here is just
  // the entry point Next needs; layout mode busts every route under it.
  settings: ["/"],
};

function sectionPaths(section: string): string[] {
  if (SECTION_PATHS[section]) return SECTION_PATHS[section];
  if (section.startsWith("hobby:")) return ["/about"]; // hobby detail pages are under /about/[slug]
  return ["/"];
}

export async function stageChange(opts: {
  adminUserId: string;
  section: string;
  model: string;
  action: PendingAction;
  targetId?: string | null;
  label: string;
  payload?: unknown;
}) {
  return prisma.pendingChange.create({
    data: {
      adminUserId: opts.adminUserId,
      section: opts.section,
      model: opts.model,
      action: opts.action,
      targetId: opts.targetId ?? null,
      label: opts.label,
      payload: (opts.payload ?? undefined) as any,
    },
  });
}

export async function listPendingGroupedBySection() {
  const rows = await prisma.pendingChange.findMany({ orderBy: { createdAt: "asc" } });
  const grouped = new Map<string, typeof rows>();
  for (const row of rows) {
    if (!grouped.has(row.section)) grouped.set(row.section, []);
    grouped.get(row.section)!.push(row);
  }
  return Array.from(grouped.entries()).map(([section, changes]) => ({ section, changes }));
}

export async function listPendingForSection(section: string) {
  return prisma.pendingChange.findMany({ where: { section }, orderBy: { createdAt: "asc" } });
}

export async function discardPendingChange(id: string) {
  return prisma.pendingChange.delete({ where: { id } });
}

// Called only after the section's batch OTP has verified successfully.
export async function commitSection(section: string) {
  const changes = await prisma.pendingChange.findMany({ where: { section }, orderBy: { createdAt: "asc" } });
  if (changes.length === 0) return { applied: 0 };

  // Apply deletes last so that creates/updates referencing the same
  // parent records (e.g. hobbyEntry → hobbySubCollection) don't fail
  // with a foreign-key violation.
  const sorted = [...changes].sort((a, b) => {
    if (a.action === "DELETE" && b.action !== "DELETE") return 1;
    if (a.action !== "DELETE" && b.action === "DELETE") return -1;
    return 0;
  });

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    for (const change of sorted) {
      await applyPendingChange(tx, {
        model: change.model,
        action: change.action,
        targetId: change.targetId,
        payload: change.payload,
      });
    }
    await tx.pendingChange.deleteMany({ where: { section } });
  });

  // "settings" changes (e.g. Experience section visibility) affect the
  // navbar/footer rendered in the root layout on every page — bust the
  // whole site's layout cache rather than trying to enumerate every route.
  await triggerPublicRevalidate(sectionPaths(section), {
    mode: section === "settings" ? "layout" : "page",
  });
  return { applied: changes.length };
}
