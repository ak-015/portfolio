import { NextRequest } from "next/server";
import { CSRF_COOKIE_NAME } from "@/lib/auth";

// Double-submit cookie check: every mutating request from the dashboard UI
// must echo the readable csrf_token cookie back as an `x-csrf-token`
// header (see components/apiClient.ts). A cross-site form/script can send
// the cookie automatically but can't read it to set the header, so this
// blocks CSRF even though the session cookie is sameSite=lax.
export function assertCsrf(req: NextRequest): { ok: true } | { ok: false; message: string } {
  const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = req.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return { ok: false, message: "CSRF check failed" };
  }
  return { ok: true };
}
