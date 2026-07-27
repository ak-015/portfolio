import { Prisma, PrismaClient } from "@prisma/client";
import { RESOURCES } from "@/lib/resources";

type Tx = Prisma.TransactionClient;

// Flat models: generic create/update/delete straight through to the
// matching Prisma delegate, keyed by ResourceConfig.model.
const FLAT_MODELS = new Set(Object.values(RESOURCES).map((r) => r.model));

function flatDelegate(tx: Tx, model: string) {
  const delegate = (tx as unknown as Record<string, any>)[model];
  if (!delegate) throw new Error(`Unknown flat model "${model}"`);
  return delegate;
}

export async function applyPendingChange(
  tx: Tx,
  change: { model: string; action: "CREATE" | "UPDATE" | "DELETE"; targetId: string | null; payload: unknown }
) {
  const { model, action, targetId, payload } = change;

  if (FLAT_MODELS.has(model)) {
    const delegate = flatDelegate(tx, model);
    if (action === "CREATE") return delegate.create({ data: payload });
    if (action === "UPDATE") return delegate.update({ where: { id: targetId! }, data: payload });
    if (action === "DELETE") return delegate.delete({ where: { id: targetId! } });
  }

  switch (model) {
    case "profile":
      return applyProfile(tx, action, payload);
    case "project":
      return applyProject(tx, action, targetId, payload);
    case "experience":
      return applyExperience(tx, action, targetId, payload);
    case "blogPost":
      return applyBlogPost(tx, action, targetId, payload);
    case "hobby":
      return applyHobby(tx, action, targetId, payload);
    case "hobbySubCollection":
      return applyHobbySubCollection(tx, action, targetId, payload);
    case "hobbyField":
      return applyHobbyField(tx, action, targetId, payload);
    case "hobbyEntry":
      return applyHobbyEntry(tx, action, targetId, payload);
    case "siteSettings":
      return applySiteSettings(tx, payload);
    default:
      throw new Error(`No apply handler registered for model "${model}"`);
  }
}

// ── Profile (singleton) ────────────────────────────────────────────
async function applyProfile(tx: Tx, action: string, payload: any) {
  if (action === "DELETE") throw new Error("Profile cannot be deleted");
  const existing = await tx.profile.findFirst();
  if (existing) return tx.profile.update({ where: { id: existing.id }, data: payload });
  return tx.profile.create({ data: payload });
}

// ── Site settings (singleton, fixed id) ──────────────────────────
async function applySiteSettings(tx: Tx, payload: any) {
  return tx.siteSettings.upsert({
    where: { id: "singleton" },
    update: payload,
    create: { id: "singleton", ...payload },
  });
}

// ── Project (+ features, + technology links) ─────────────────────
async function applyProject(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "DELETE") return tx.project.delete({ where: { id: targetId! } });

  const { features = [], technologyIds = [], ...fields } = payload;

  if (action === "CREATE") {
    return tx.project.create({
      data: {
        ...fields,
        features: { create: features.map((f: any, i: number) => ({ text: f.text, order: f.order ?? i })) },
        technologies: {
          create: technologyIds.map((technologyId: string, i: number) => ({ technologyId, order: i })),
        },
      },
    });
  }

  // UPDATE — replace the nested collections wholesale for simplicity/correctness
  await tx.projectFeature.deleteMany({ where: { projectId: targetId! } });
  await tx.projectTechnology.deleteMany({ where: { projectId: targetId! } });
  return tx.project.update({
    where: { id: targetId! },
    data: {
      ...fields,
      features: { create: features.map((f: any, i: number) => ({ text: f.text, order: f.order ?? i })) },
      technologies: {
        create: technologyIds.map((technologyId: string, i: number) => ({ technologyId, order: i })),
      },
    },
  });
}

// ── Experience (+ bullets) ──────────────────────────────────────
async function applyExperience(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "DELETE") return tx.experience.delete({ where: { id: targetId! } });

  const { bullets = [], ...fields } = payload;

  if (action === "CREATE") {
    return tx.experience.create({
      data: { ...fields, bullets: { create: bullets.map((b: any, i: number) => ({ text: b.text, order: b.order ?? i })) } },
    });
  }

  await tx.experienceBullet.deleteMany({ where: { experienceId: targetId! } });
  return tx.experience.update({
    where: { id: targetId! },
    data: { ...fields, bullets: { create: bullets.map((b: any, i: number) => ({ text: b.text, order: b.order ?? i })) } },
  });
}

// ── BlogPost (+ tags) ────────────────────────────────────────────
async function applyBlogPost(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "DELETE") return tx.blogPost.delete({ where: { id: targetId! } });

  const { tags = [], ...fields } = payload;

  if (action === "CREATE") {
    return tx.blogPost.create({
      data: { ...fields, tags: { create: tags.map((t: any, i: number) => ({ label: t.label, order: t.order ?? i })) } },
    });
  }

  await tx.blogPostTag.deleteMany({ where: { blogPostId: targetId! } });
  return tx.blogPost.update({
    where: { id: targetId! },
    data: { ...fields, tags: { create: tags.map((t: any, i: number) => ({ label: t.label, order: t.order ?? i })) } },
  });
}

// ── Hobby tree (Hobby itself is flat; sub-tree below is bespoke) ──
async function applyHobby(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "CREATE") return tx.hobby.create({ data: payload });
  if (action === "UPDATE") return tx.hobby.update({ where: { id: targetId! }, data: payload });
  return tx.hobby.delete({ where: { id: targetId! } }); // cascades sub-collections/fields/entries
}

async function applyHobbySubCollection(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "CREATE") return tx.hobbySubCollection.create({ data: payload });
  if (action === "UPDATE") return tx.hobbySubCollection.update({ where: { id: targetId! }, data: payload });
  return tx.hobbySubCollection.delete({ where: { id: targetId! } });
}

async function applyHobbyField(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "CREATE") return tx.hobbyField.create({ data: payload });
  if (action === "UPDATE") return tx.hobbyField.update({ where: { id: targetId! }, data: payload });
  return tx.hobbyField.delete({ where: { id: targetId! } });
}

// entry payload: { subCollectionId, order, values: [{ fieldId, value }] }
async function applyHobbyEntry(tx: Tx, action: string, targetId: string | null, payload: any) {
  if (action === "DELETE") return tx.hobbyEntry.delete({ where: { id: targetId! } });

  const { values = [], ...fields } = payload;

  if (action === "CREATE") {
    return tx.hobbyEntry.create({
      data: { ...fields, values: { create: values.map((v: any) => ({ fieldId: v.fieldId, value: String(v.value) })) } },
    });
  }

  await tx.hobbyEntryValue.deleteMany({ where: { entryId: targetId! } });
  return tx.hobbyEntry.update({
    where: { id: targetId! },
    data: { ...fields, values: { create: values.map((v: any) => ({ fieldId: v.fieldId, value: String(v.value) })) } },
  });
}
