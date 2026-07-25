import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { OtpPurpose } from "@prisma/client";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function generateCode() {
  // crypto.randomInt is a CSPRNG — Math.random() is predictable enough
  // that it shouldn't be used for anything auth-adjacent, even a
  // short-lived 6-digit code that's also rate-limited and bcrypt-hashed.
  return String(randomInt(100000, 1000000)); // 6 digits
}

// Never returns or logs the raw code beyond this function's own scope —
// it goes straight into the outbound email and a bcrypt hash in the DB.
export async function createAndSendOtp(opts: {
  adminUserId: string;
  adminEmail: string;
  purpose: OtpPurpose;
  section?: string;
  context: string; // human copy for the email body, e.g. "confirm changes to Projects"
}) {
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Invalidate any previous outstanding OTPs for the same purpose/section
  // so only the most recent code is valid.
  await prisma.otpRequest.updateMany({
    where: {
      adminUserId: opts.adminUserId,
      purpose: opts.purpose,
      section: opts.section ?? null,
      consumedAt: null,
    },
    data: { consumedAt: new Date() },
  });

  const request = await prisma.otpRequest.create({
    data: {
      adminUserId: opts.adminUserId,
      purpose: opts.purpose,
      section: opts.section,
      codeHash,
      expiresAt,
    },
  });

  await sendOtpEmail(opts.adminEmail, code, opts.context);

  return { otpRequestId: request.id, expiresAt };
}

export type OtpVerifyResult =
  | { ok: true; otpRequestId: string }
  | { ok: false; reason: "not_found" | "expired" | "locked" | "wrong_code" | "already_used"; retryAfterMs?: number };

export async function verifyOtp(opts: {
  adminUserId: string;
  purpose: OtpPurpose;
  section?: string;
  code: string;
}): Promise<OtpVerifyResult> {
  const request = await prisma.otpRequest.findFirst({
    where: {
      adminUserId: opts.adminUserId,
      purpose: opts.purpose,
      section: opts.section ?? null,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!request) return { ok: false, reason: "not_found" };

  if (request.lockedUntil && request.lockedUntil.getTime() > Date.now()) {
    return { ok: false, reason: "locked", retryAfterMs: request.lockedUntil.getTime() - Date.now() };
  }

  if (request.expiresAt.getTime() < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  const matches = await bcrypt.compare(opts.code, request.codeHash);

  if (!matches) {
    const attempts = request.attempts + 1;
    const lockedUntil = attempts >= MAX_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) : null;
    await prisma.otpRequest.update({
      where: { id: request.id },
      data: { attempts, lockedUntil },
    });
    return lockedUntil
      ? { ok: false, reason: "locked", retryAfterMs: LOCKOUT_MINUTES * 60 * 1000 }
      : { ok: false, reason: "wrong_code" };
  }

  await prisma.otpRequest.update({ where: { id: request.id }, data: { consumedAt: new Date() } });
  return { ok: true, otpRequestId: request.id };
}
