// Minimal in-memory sliding-window rate limiter for login/OTP endpoints.
//
// NOTE: this only works within a single long-lived Node process. If you
// deploy to a multi-instance or serverless platform (Vercel functions,
// etc), swap this for a shared store (Redis / Upstash) — the interface
// below is intentionally tiny so that's a drop-in change.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

// `X-Forwarded-For` is trivially spoofable by any direct client unless a
// reverse proxy in front of this app strips the incoming client-supplied
// header and sets its own. Only read it when TRUST_PROXY_HEADERS=true is
// explicitly set for a deployment that guarantees that (Vercel, an nginx
// config with `proxy_set_header X-Forwarded-For $remote_addr`, etc).
//
// Without that guarantee, trusting the header lets an attacker bypass the
// login/OTP rate limit entirely by sending a fresh `X-Forwarded-For` value
// on every request. Falling back to a single shared bucket per suffix is
// less precise (one aggressive user can throttle others sharing it) but
// fails closed instead of failing open.
export function clientKey(req: Request, suffix: string) {
  const trustProxy = process.env.TRUST_PROXY_HEADERS === "true";
  const ip = trustProxy ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : null;
  return `${ip || "shared"}:${suffix}`;
}
