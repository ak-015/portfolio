import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/requireAuth";
import { assertCsrf } from "@/lib/csrf";
import { stageChange, listPendingGroupedBySection } from "@/lib/staging";

const schema = z.object({
  section: z.string().min(1),
  model: z.string().min(1),
  action: z.enum(["CREATE", "UPDATE", "DELETE"]),
  targetId: z.string().nullable().optional(),
  label: z.string().min(1),
  payload: z.unknown().optional(),
});

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const grouped = await listPendingGroupedBySection();
  return NextResponse.json({ sections: grouped });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const csrf = assertCsrf(req);
  if (!csrf.ok) return NextResponse.json({ error: csrf.message }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid staged change", details: parsed.error.flatten() }, { status: 400 });
  }

  const change = await stageChange({
    adminUserId: auth.adminId,
    section: parsed.data.section,
    model: parsed.data.model,
    action: parsed.data.action,
    targetId: parsed.data.targetId,
    label: parsed.data.label,
    payload: parsed.data.payload,
  });
  return NextResponse.json({ ok: true, change });
}
