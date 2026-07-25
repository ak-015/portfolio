import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Receives the secret-protected webhook fired by the admin project's
// lib/revalidate.ts after a batch of PendingChange rows commits.
// Without this route, admin-confirmed edits never reach the live site —
// see portfolio-admin/lib/revalidate.ts and README "Schema Sync" notes.

const schema = z.object({
  paths: z.array(z.string().min(1)).min(1).max(50),
});

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    console.error("REVALIDATE_SECRET is not configured on the public deployment");
    return NextResponse.json({ error: "Revalidation is not configured" }, { status: 500 });
  }

  const provided = req.headers.get("x-revalidate-secret");
  // Constant-time-ish comparison isn't critical here (this isn't a login
  // credential check against a per-user secret), but we still avoid a
  // naive early-exit compare by checking length first.
  if (!provided || provided.length !== expected.length || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const revalidated: string[] = [];
  for (const path of parsed.data.paths) {
    // Only ever revalidate same-site, absolute paths — never an
    // attacker-controlled external URL.
    if (!path.startsWith("/")) continue;
    try {
      revalidatePath(path);
      revalidated.push(path);
    } catch (err) {
      console.error(`Failed to revalidate path "${path}":`, err);
    }
  }

  return NextResponse.json({ ok: true, revalidated });
}
