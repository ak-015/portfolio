import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createAndSendOtp } from "@/lib/otp";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { OtpPurpose } from "@prisma/client";

const PENDING_LOGIN_COOKIE = "admin_pending_login";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const limited = rateLimit(clientKey(req, "login"), 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Deliberately identical response whether the email exists or the
  // password is wrong, so login can't be used to enumerate admin emails.
  const genericError = () => NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  if (!admin) return genericError();
  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return genericError();

  await createAndSendOtp({
    adminUserId: admin.id,
    adminEmail: admin.email,
    purpose: OtpPurpose.LOGIN,
    context: "log in to the admin panel",
  });

  // Short-lived signed cookie carries the pending admin id to the OTP step
  // — the client never handles or can tamper with the raw id.
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const pendingToken = await new SignJWT({ sub: admin.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PENDING_LOGIN_COOKIE, pendingToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
