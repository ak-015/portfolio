import { Resend } from "resend";
import nodemailer from "nodemailer";

// Shared OTP-sending helper — used for both the login flow and every
// staged-changes batch confirmation. Primary: Resend. Fallback: Brevo SMTP.
export async function sendOtpEmail(to: string, code: string, context: string) {
  const from = process.env.OTP_FROM_EMAIL || "admin@resend.dev";
  const subject = `Your admin verification code: ${code}`;
  const html = `
    <h2>Admin verification code</h2>
    <p>Use this code to ${escapeHtml(context)}:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px;">${code}</p>
    <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({ from, to, subject, html });
      if (!error) return { provider: "resend" as const };
      console.error("Resend failed, falling back to Brevo SMTP:", error);
    } catch (err) {
      console.error("Resend threw, falling back to Brevo SMTP:", err);
    }
  }

  const brevoFrom = process.env.BREVO_FROM_EMAIL;
  if (!brevoFrom) {
    throw new Error(
      "BREVO_FROM_EMAIL is not set. BREVO_SMTP_USER is your SMTP login " +
        "(e.g. aabe06001@smtp-brevo.com) and is NOT a valid From address — " +
        "Brevo rejects sends where From isn't a verified sender. Set " +
        "BREVO_FROM_EMAIL to a sender verified in Brevo under Senders, " +
        "Domains & Dedicated IPs (e.g. your account's auto-issued " +
        "xxxxx@<id>.brevosend.com address, or a custom domain you've verified)."
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.BREVO_SMTP_USER, pass: process.env.BREVO_SMTP_PASS },
  });

  await transporter.sendMail({ from: `"Portfolio Admin" <${brevoFrom}>`, to, subject, html });
  return { provider: "brevo" as const };
}

function escapeHtml(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
