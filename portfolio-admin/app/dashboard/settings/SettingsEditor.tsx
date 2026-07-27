"use client";

import { useState } from "react";
import Link from "next/link";
import { apiJson } from "@/components/apiClient";
import { Button, Card, Field } from "@/components/ui";

type Settings = {
  experienceVisible: boolean;
};

function toForm(s: any): Settings {
  return {
    experienceVisible: s?.experienceVisible ?? true,
  };
}

export default function SettingsEditor({ initialSettings }: { initialSettings: any | null }) {
  const [form, setForm] = useState<Settings>(toForm(initialSettings));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "settings",
          model: "siteSettings",
          action: "UPDATE",
          targetId: "singleton",
          label: form.experienceVisible ? "Show Experience section" : "Hide Experience section",
          payload: form,
        }),
      });
      setMessage("Staged. Review and confirm from Pending Changes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stage change");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">Site-wide toggles that don't belong to any single content section.</p>

      <Card className="space-y-4">
        <Field
          label="Experience section"
          help="When off, the Experience nav link, its footer link, and the /experience page itself (which 404s) are all hidden from visitors."
        >
          <label className="mt-1 flex items-center gap-2 text-sm text-white/90">
            <input
              type="checkbox"
              checked={form.experienceVisible}
              onChange={(e) => setForm({ experienceVisible: e.target.checked })}
            />
            {form.experienceVisible ? "Visible to visitors" : "Hidden from visitors"}
          </label>
        </Field>
      </Card>

      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-emerald-400">{message}</p> : null}

      <Button disabled={busy} onClick={submit} className="mt-4">
        {busy ? "Staging…" : "Stage changes"}
      </Button>
    </div>
  );
}
