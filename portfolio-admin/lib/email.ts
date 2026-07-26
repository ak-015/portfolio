import { Resend } from "resend";

// Shared OTP-sending helper — used for both the login flow and every
// staged-changes batch confirmation. Primary: Resend. Fallback: Brevo API.
export async function sendOtpEmail(to: string, code: string, context: string) {
  const from = process.env.OTP_FROM_EMAIL || "admin@resend.dev";
  const subject = `Your admin verification code: ${code}`;
  const html = `
    <h2>Admin verification code</h2>
    <p>Use this code to ${escapeHtml(context)}:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px;">${code}</p>
    <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
  `;

  // Primary provider: Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({ from, to, subject, html });
      if (!error) return { provider: "resend" as const };
      console.error("Resend failed, falling back to Brevo API:", error);
    } catch (err) {
      console.error("Resend threw, falling back to Brevo API:", err);
    }
  }

  // Fallback provider: Brevo (Sendinblue) Transactional Email API v3
  // Uses a direct fetch call so we don't need the bulky @sendinblue/client SDK.
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
    console.error(
      "Your BREVO_SMTP_PASS looks like an SMTP key (xsmtpsib-...). " +
      "Brevo API v3 requires an API key that starts with xkeysib-. " +
      "Generate one in Brevo Dashboard → SMTP & API → API Keys → " +
      "Create a new API key, then set it as BREVO_API_KEY in your .env."
    );
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
        sender: { email: brevoFrom, name: "Portfolio Admin" },
        to: [{ email: to }],
        subject,
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

      // Check for the specific "Unauthorized IP" error — shouldn't happen with
      // API keys (that restriction only applies to SMTP), but handle gracefully.
      if (message?.toLowerCase?.().includes("unauthorized ip")) {
        throw new Error(
          `Brevo API rejected the request from this IP address. ` +
          `Go to Brevo Dashboard → SMTP & API → SMTP settings → ` +
          `Authorized IPs and add your server's IP address. Raw error: ${message}`
        );
      }

      throw new Error(`Brevo API responded with ${response.status}: ${message}`);
    }

    const result = await response.json();
    console.log("Brevo email sent successfully. Message ID:", result.messageId);
    return { provider: "brevo" as const };
  } catch (err: any) {
    if (err?.message?.includes("Brevo API responded") || err?.message?.includes("Brevo API rejected")) {
      throw err;
    }
    console.error("Brevo API send failed with full error:", err);
    throw new Error(`Brevo API failed: ${err?.message || String(err)}`);
  }
}

function escapeHtml(input: string) {
  return input.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}