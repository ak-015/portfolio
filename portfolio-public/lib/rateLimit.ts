// Minimal in-memory sliding-window rate limiter for the contact form.
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

// Same trust model as the admin project's copy of this function: only
// read X-Forwarded-For when a reverse proxy in front of this deployment
// is known to overwrite (not append to) it. Otherwise a spoofed header
// would let anyone bypass the contact-form throttle for free.
export function clientKey(req: Request, suffix: string) {
  const trustProxy = process.env.TRUST_PROXY_HEADERS === "true";
  const ip = trustProxy ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : null;
  return `${ip || "shared"}:${suffix}`;
}
