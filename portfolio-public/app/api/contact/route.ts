import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, clientKey } from "@/lib/rateLimit";

// Strips CR/LF so a field can never inject extra headers (subject/reply-to)
// into the outbound email — see lib/email.ts.
function stripCrlf(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  const limited = rateLimit(clientKey(req, "contact"), 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many messages sent. Please try again shortly." }, { status: 429 });
  }

  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
  }
  if (name.length > 200 || subject.length > 300 || message.length > 5000) {
    return NextResponse.json({ error: "One of the fields is too long" }, { status: 400 });
  }

  const safeName = stripCrlf(name);
  const safeSubject = stripCrlf(subject);
  // message legitimately contains newlines (paragraphs) — only strip CR
  // and collapse any raw \r so downstream header handling can't be
  // confused by a stray \r\n sequence; \n is preserved for line breaks.
  const safeMessage = message.replace(/\r\n?/g, "\n");

  try {
    // Intentionally not persisted to the database — relayed by email only,
    // per the shared foundations spec.
    await sendContactEmail({ name: safeName, email, subject: safeSubject, message: safeMessage });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json({ error: "Could not send your message right now. Please try again shortly." }, { status: 502 });
  }
}
