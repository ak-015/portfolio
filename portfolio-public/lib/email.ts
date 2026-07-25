import { Resend } from "resend";
import nodemailer from "nodemailer";

// Primary: Resend. Fallback: Brevo SMTP. Used only by the /contact form —
// messages are relayed by email and are never written to the database.

export async function sendContactEmail(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) throw new Error("CONTACT_TO_EMAIL is not configured");

  const html = `
    <h2>New message from portfolio contact form</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "Portfolio Contact <contact@resend.dev>",
        to,
        reply_to: payload.email,
        subject: `[Portfolio] ${payload.subject}`,
        html,
      });
      if (!error) return { provider: "resend" as const };
      console.error("Resend failed, falling back to Brevo SMTP:", error);
    } catch (err) {
      console.error("Resend threw, falling back to Brevo SMTP:", err);
    }
  }

  const brevoFrom = process.env.BREVO_FROM_EMAIL;
  if (!brevoFrom) {
    throw new Error(
      "BREVO_FROM_EMAIL is not set. BREVO_SMTP_USER is your SMTP login and " +
        "is NOT a valid From address — Brevo rejects sends where From " +
        "isn't a verified sender. Set BREVO_FROM_EMAIL to a sender " +
        "verified in Brevo under Senders, Domains & Dedicated IPs."
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${brevoFrom}>`,
    to,
    replyTo: payload.email,
    subject: `[Portfolio] ${payload.subject}`,
    html,
  });

  return { provider: "brevo" as const };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
