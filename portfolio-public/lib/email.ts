import { Resend } from "resend";

// Primary: Resend. Fallback: Brevo API. Used only by the /contact form —
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
        replyTo: payload.email,
        subject: `[Portfolio] ${payload.subject}`,
        html,
      });
      if (!error) return { provider: "resend" as const };
      console.error("Resend failed, falling back to Brevo API:", error);
    } catch (err) {
      console.error("Resend threw, falling back to Brevo API:", err);
    }
  }

  // Fallback: Brevo (Sendinblue) Transactional Email API v3
  const brevoFrom = process.env.BREVO_FROM_EMAIL;
  if (!brevoFrom) {
    throw new Error(
      "BREVO_FROM_EMAIL is not set. This must be a sender email verified " +
      "in your Brevo account (Senders, Domains & Dedicated IPs → Senders)."
    );
  }
  const brevoApiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS;
  if (!brevoApiKey) {
    throw new Error(
      "Neither BREVO_API_KEY nor BREVO_SMTP_PASS is set. Set BREVO_API_KEY " +
      "to your Brevo API v3 key (starts with xkeysib-)."
    );
  }

  // If using the old SMTP key (xsmtpsib- prefix), warn the user they need an
  // API v3 key (xkeysib- prefix) generated from the Brevo dashboard.
  if (brevoApiKey.startsWith("xsmtpsib-")) {
    throw new Error(
      "SMTP key (xsmtpsib-) cannot be used with the Brevo API. " +
      "Generate a Brevo API v3 key (xkeysib-) from " +
      "https://app.brevo.com/settings/keys/api and set it as BREVO_API_KEY in your .env."
    );
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: brevoFrom, name: "Portfolio Contact" },
        to: [{ email: to }],
        replyTo: { email: payload.email },
        subject: `[Portfolio] ${payload.subject}`,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let parsed: any;
      try {
        parsed = JSON.parse(errorBody);
      } catch {
        parsed = { message: errorBody };
      }
      const message = parsed?.message || parsed?.code || response.statusText;
      console.error("Brevo API error response:", parsed);
      throw new Error("Brevo API responded with " + response.status + ": " + message);
    }

    const result = await response.json();
    console.log("Brevo email sent successfully. Message ID:", result.messageId);
    return { provider: "brevo" as const };
  } catch (err: any) {
    if (err?.message?.includes("Brevo API responded")) {
      throw err;
    }
    console.error("Brevo API send failed with full error:", err);
    throw new Error("Brevo API failed: " + (err?.message || String(err)));
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&#34;");
}
