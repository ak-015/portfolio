import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { jwtVerify } from "jose";
import { verifyOtp } from "@/lib/otp";
import { issueSession } from "@/lib/auth";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { OtpPurpose } from "@prisma/client";

const PENDING_LOGIN_COOKIE = "admin_pending_login";
const schema = z.object({ code: z.string().length(6) });

export async function POST(req: NextRequest) {
  const limited = rateLimit(clientKey(req, "verify-otp"), 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter the 6-digit code" }, { status: 400 });

  const pendingToken = req.cookies.get(PENDING_LOGIN_COOKIE)?.value;
  if (!pendingToken) {
    return NextResponse.json({ error: "Your login attempt expired. Please log in again." }, { status: 401 });
  }

  let adminUserId: string;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(pendingToken, secret);
    adminUserId = String(payload.sub);
  } catch {
    return NextResponse.json({ error: "Your login attempt expired. Please log in again." }, { status: 401 });
  }

  const result = await verifyOtp({ adminUserId, purpose: OtpPurpose.LOGIN, code: parsed.data.code });

  if (!result.ok) {
    const messages: Record<string, string> = {
      not_found: "No active code found. Request a new one.",
      expired: "That code expired. Request a new one.",
      locked: "Too many wrong attempts. Try again later.",
      wrong_code: "That code is incorrect.",
      already_used: "That code was already used.",
    };
    return NextResponse.json({ error: messages[result.reason] }, { status: 401 });
  }

  await issueSession(adminUserId);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PENDING_LOGIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
