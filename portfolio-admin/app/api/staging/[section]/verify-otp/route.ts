import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/requireAuth";
import { assertCsrf } from "@/lib/csrf";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { verifyOtp } from "@/lib/otp";
import { commitSection } from "@/lib/staging";
import { OtpPurpose } from "@prisma/client";

const schema = z.object({ code: z.string().length(6) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const csrf = assertCsrf(req);
  if (!csrf.ok) return NextResponse.json({ error: csrf.message }, { status: 403 });

  const { section: rawSection } = await params;
  const limited = rateLimit(clientKey(req, `staging-verify:${rawSection}`), 10, 15 * 60 * 1000);
  if (!limited.ok) return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter the 6-digit code" }, { status: 400 });

  const section = decodeURIComponent(rawSection);

  const result = await verifyOtp({
    adminUserId: auth.adminId,
    purpose: OtpPurpose.STAGING,
    section,
    code: parsed.data.code,
  });

  if (!result.ok) {
    const messages: Record<string, string> = {
      not_found: "No active code found for this section. Send a new one.",
      expired: "That code expired. Send a new one.",
      locked: "Too many wrong attempts. Try again later.",
      wrong_code: "That code is incorrect.",
      already_used: "That code was already used.",
    };
    return NextResponse.json({ error: messages[result.reason] }, { status: 401 });
  }

  try {
    const { applied } = await commitSection(section);
    return NextResponse.json({ ok: true, applied });
  } catch (err) {
    console.error(`Failed to commit section "${section}":`, err);
    return NextResponse.json(
      { error: "The code was correct, but committing the changes failed. Nothing was applied — try again." },
      { status: 500 }
    );
  }
}
