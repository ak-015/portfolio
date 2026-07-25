"use client";

import { useEffect, useState } from "react";
import { apiJson, apiFetch } from "@/components/apiClient";
import { Button, Card, Badge, Input } from "@/components/ui";

type Change = {
  id: string;
  section: string;
  model: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  label: string;
  createdAt: string;
};
type SectionGroup = { section: string; changes: Change[] };

const ACTION_TONE: Record<Change["action"], "create" | "update" | "delete"> = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
};

export default function PendingChangesPage() {
  const [sections, setSections] = useState<SectionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [otpSection, setOtpSection] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ section: string; text: string; error?: boolean } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await apiJson<{ sections: SectionGroup[] }>("/api/pending");
      setSections(data.sections);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function discard(id: string) {
    await apiFetch(`/api/pending/${id}`, { method: "DELETE" });
    load();
  }

  async function sendOtp(section: string) {
    setBusy(true);
    setMessage(null);
    try {
      await apiJson(`/api/staging/${encodeURIComponent(section)}/send-otp`, { method: "POST" });
      setOtpSection(section);
      setCode("");
      setMessage({ section, text: "Code sent — check your email." });
    } catch (err) {
      setMessage({ section, text: err instanceof Error ? err.message : "Failed to send code", error: true });
    } finally {
      setBusy(false);
    }
  }

  async function confirm(section: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await apiJson<{ applied: number }>(`/api/staging/${encodeURIComponent(section)}/verify-otp`, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setMessage({ section, text: `Applied ${res.applied} change(s). Public site will reflect this shortly.` });
      setOtpSection(null);
      setCode("");
      load();
    } catch (err) {
      setMessage({ section, text: err instanceof Error ? err.message : "Verification failed", error: true });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">Pending Changes</h1>
      <p className="mb-8 text-sm text-muted">
        Nothing here is live yet. Each section confirms with its own one-time code sent to your email — the whole
        batch commits together, atomically.
      </p>

      {sections.length === 0 ? (
        <Card>
          <p className="text-muted">No staged changes right now.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sections.map((group) => (
            <Card key={group.section}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-white">{group.section}</h2>
                <span className="text-xs text-muted">{group.changes.length} pending</span>
              </div>

              <ul className="mb-4 space-y-2">
                {group.changes.map((c) => (
                  <li key={c.id} className="flex items-center justify-between rounded-lg bg-panel2 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Badge tone={ACTION_TONE[c.action]}>{c.action}</Badge>
                      <span className="text-sm text-white/90">{c.label}</span>
                    </div>
                    <button onClick={() => discard(c.id)} className="text-xs text-muted hover:text-danger">
                      Discard
                    </button>
                  </li>
                ))}
              </ul>

              {message?.section === group.section ? (
                <p className={`mb-3 text-sm ${message.error ? "text-danger" : "text-emerald-400"}`}>{message.text}</p>
              ) : null}

              {otpSection === group.section ? (
                <div className="flex items-center gap-2">
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="max-w-[160px]"
                  />
                  <Button disabled={busy || code.length !== 6} onClick={() => confirm(group.section)}>
                    Confirm
                  </Button>
                  <Button variant="ghost" onClick={() => setOtpSection(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button disabled={busy} onClick={() => sendOtp(group.section)}>
                  Send OTP to confirm {group.changes.length} change{group.changes.length === 1 ? "" : "s"}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
