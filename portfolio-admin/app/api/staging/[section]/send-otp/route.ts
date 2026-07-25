import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { assertCsrf } from "@/lib/csrf";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { createAndSendOtp } from "@/lib/otp";
import { listPendingForSection } from "@/lib/staging";
import { OtpPurpose } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const csrf = assertCsrf(req);
  if (!csrf.ok) return NextResponse.json({ error: csrf.message }, { status: 403 });

  const { section: rawSection } = await params;
  const limited = rateLimit(clientKey(req, `staging-otp:${rawSection}`), 5, 15 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });

  const section = decodeURIComponent(rawSection);
  const pending = await listPendingForSection(section);
  if (pending.length === 0) {
    return NextResponse.json({ error: "There are no pending changes in this section." }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: auth.adminId } });
  if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 401 });

  await createAndSendOtp({
    adminUserId: admin.id,
    adminEmail: admin.email,
    purpose: OtpPurpose.STAGING,
    section,
    context: `confirm ${pending.length} pending change${pending.length === 1 ? "" : "s"} in "${section}"`,
  });

  return NextResponse.json({ ok: true, pendingCount: pending.length });
}
