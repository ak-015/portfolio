import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { createAndSendOtp } from "@/lib/otp";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { OtpPurpose } from "@prisma/client";

const PENDING_LOGIN_COOKIE = "admin_pending_login";

export async function POST(req: NextRequest) {
  const limited = rateLimit(clientKey(req, "resend-otp"), 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

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

  const admin = await prisma.adminUser.findUnique({ where: { id: adminUserId } });
  if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 401 });

  await createAndSendOtp({
    adminUserId: admin.id,
    adminEmail: admin.email,
    purpose: OtpPurpose.LOGIN,
    context: "log in to the admin panel",
  });

  return NextResponse.json({ ok: true });
}
