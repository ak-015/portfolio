import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { assertCsrf } from "@/lib/csrf";
import { discardPendingChange } from "@/lib/staging";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const csrf = assertCsrf(req);
  if (!csrf.ok) return NextResponse.json({ error: csrf.message }, { status: 403 });

  const { id } = await params;
  await discardPendingChange(id).catch(() => null);
  return NextResponse.json({ ok: true });
}
