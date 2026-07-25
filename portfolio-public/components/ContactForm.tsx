"use client";

import { FormEvent, useState } from "react";
import { FaPaperPlane, FaRedo } from "react-icons/fa";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      subject: String(data.get("subject") || ""),
      message: String(data.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Something went wrong");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-panel/60 p-6">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
        Send Me a Message
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Your Name"
          className="rounded-lg border border-border bg-panel2 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accentBlue focus:outline-none"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Your Email"
          className="rounded-lg border border-border bg-panel2 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accentBlue focus:outline-none"
        />
      </div>

      <input
        name="subject"
        required
        placeholder="Subject"
        className="mt-4 w-full rounded-lg border border-border bg-panel2 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accentBlue focus:outline-none"
      />

      <textarea
        name="message"
        required
        rows={5}
        placeholder="Your Message"
        className="mt-4 w-full rounded-lg border border-border bg-panel2 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accentBlue focus:outline-none"
      />

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-grad-primary py-3 text-sm font-medium text-white transition-opacity disabled:opacity-60"
        >
          <FaPaperPlane /> {status === "sending" ? "Sending..." : "Send Message"}
        </button>
        <button
          type="reset"
          onClick={() => setStatus("idle")}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-panel2 px-5 text-sm text-white/80"
        >
          <FaRedo /> Reset
        </button>
      </div>

      {status === "sent" ? (
        <p className="mt-3 text-sm text-emerald-400">
          Thanks — your message has been sent. I&apos;ll get back to you soon.
        </p>
      ) : null}
      {status === "error" ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
