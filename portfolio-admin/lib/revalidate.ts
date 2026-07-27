// Public and admin are separate deployments, so a write here can't call
// Next.js `revalidatePath` in the *public* process directly. Instead the
// public site exposes a secret-protected webhook
// (public repo: app/api/revalidate/route.ts) that this function calls
// after a batch of PendingChange rows commits. No manual redeploy needed.
export async function triggerPublicRevalidate(paths: string[], opts?: { mode?: "page" | "layout" }) {
  const base = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) {
    console.warn("PUBLIC_SITE_URL/REVALIDATE_SECRET not configured — skipping public revalidation");
    return;
  }

  try {
    const res = await fetch(`${base}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify({ paths, mode: opts?.mode ?? "page" }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Public revalidation webhook failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Public revalidation webhook threw:", err);
  }
}
