import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/requireAuth";
import { assertCsrf } from "@/lib/csrf";
import { uploadImage, uploadRaw } from "@/lib/cloudinary";

// Cloudinary itself sandboxes folder names reasonably well, but there's
// no reason to accept anything beyond simple path segments here — this
// also keeps the URL's folder namespace predictable.
const FOLDER_RE = /^[a-zA-Z0-9][a-zA-Z0-9/_-]{0,58}[a-zA-Z0-9]$/;

// Block mime types that a browser will happily execute if the resulting
// Cloudinary URL is ever opened directly or embedded somewhere unexpected
// — SVG and HTML can carry inline <script>, which turns "asset upload"
// into stored XSS. Everything else (PDFs, resumes, etc.) is fine for the
// "raw" upload kind.
const BLOCKED_RAW_MIME = /^data:(image\/svg\+xml|text\/html|application\/xhtml\+xml)/i;

// Rough cap on the whole data URL length (base64 inflates size by ~33%),
// mainly to stop an accidentally-huge payload from tying up the request —
// Cloudinary enforces its own per-account limits regardless.
const MAX_DATA_URL_LENGTH = 15 * 1024 * 1024; // ~10MB of original file

const schema = z.object({
  dataUrl: z.string().startsWith("data:").max(MAX_DATA_URL_LENGTH),
  folder: z.string().min(1).max(60).regex(FOLDER_RE, "Invalid folder name"),
  kind: z.enum(["image", "raw"]).default("image"),
});

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const csrf = assertCsrf(req);
  if (!csrf.ok) return NextResponse.json({ error: csrf.message }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });

  if (parsed.data.kind === "raw" && BLOCKED_RAW_MIME.test(parsed.data.dataUrl)) {
    return NextResponse.json({ error: "This file type isn't allowed" }, { status: 400 });
  }

  try {
    const url =
      parsed.data.kind === "raw"
        ? await uploadRaw(parsed.data.dataUrl, parsed.data.folder)
        : await uploadImage(parsed.data.dataUrl, parsed.data.folder);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
