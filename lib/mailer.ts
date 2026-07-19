import { Resend } from "resend";
import nodemailer from "nodemailer";

interface SendArgs {
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends transactional email via Resend. If Resend fails or is not
 * configured, falls back to Brevo SMTP. Used by the contact form here and
 * by the admin portal for OTP delivery.
 */
export async function sendMail({ subject, html, replyTo }: SendArgs) {
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!to) {
    throw new Error("CONTACT_TO_EMAIL is not configured");
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        replyTo,
      });
      if (!error) return { provider: "resend" as const };
      console.error("Resend error, falling back to Brevo SMTP:", error);
    } catch (err) {
      console.error("Resend threw, falling back to Brevo SMTP:", err);
    }
  }

  if (process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
      port: Number(process.env.BREVO_SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });
    await transporter.sendMail({ from, to, subject, html, replyTo });
    return { provider: "brevo" as const };
  }

  throw new Error(
    "No email provider configured: set RESEND_API_KEY or BREVO_SMTP_USER/PASS"
  );
}
