"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/components/apiClient";
import { Button, Card, Field, Input, Badge } from "@/components/ui";
import IconPicker from "@/components/IconPicker";

type Bullet = { text: string };
type Experience = {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null;
  color: string | null;
  icon: string | null;
  order: number;
  bullets: Bullet[];
};
type PendingChange = { id: string; targetId: string | null; action: "CREATE" | "UPDATE" | "DELETE"; label: string; model: string };

function emptyForm() {
  return { role: "", company: "", startDate: "", endDate: "", color: "#60a5fa", icon: "FaBriefcase", order: 0, bullets: [""] };
}

export default function ExperienceManager({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [pending, setPending] = useState<PendingChange[]>([]);
  const [formOpen, setFormOpen] = useState<false | "new" | string>(false);
  const [form, setForm] = useState(emptyForm());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPending() {
    const data = await apiJson<{ sections: { section: string; changes: PendingChange[] }[] }>("/api/pending");
    const group = data.sections.find((s) => s.section === "experience");
    setPending((group?.changes ?? []).filter((c) => c.model === "experience"));
  }

  useEffect(() => {
    loadPending();
  }, []);

  const pendingByTarget = new Map(pending.filter((p) => p.targetId).map((p) => [p.targetId as string, p]));
  const pendingCreates = pending.filter((p) => p.action === "CREATE");

  function openNew() {
    setForm(emptyForm());
    setFormOpen("new");
  }
  function openEdit(exp: Experience) {
    setForm({
      role: exp.role,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate ?? "",
      color: exp.color ?? "#60a5fa",
      icon: exp.icon ?? "FaBriefcase",
      order: exp.order,
      bullets: exp.bullets.length ? exp.bullets.map((b) => b.text) : [""],
    });
    setFormOpen(exp.id);
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const isNew = formOpen === "new";
      const payload = {
        role: form.role,
        company: form.company,
        startDate: form.startDate,
        endDate: form.endDate || null,
        color: form.color,
        icon: form.icon,
        order: Number(form.order),
        bullets: form.bullets.filter((b) => b.trim()).map((text, i) => ({ text: text.trim(), order: i })),
      };
      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "experience",
          model: "experience",
          action: isNew ? "CREATE" : "UPDATE",
          targetId: isNew ? null : formOpen,
          label: `${isNew ? "New" : "Edit"} experience: ${form.role} @ ${form.company}`,
          payload,
        }),
      });
      setFormOpen(false);
      loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stage change");
    } finally {
      setBusy(false);
    }
  }

  async function stageDelete(exp: Experience) {
    if (!confirm(`Stage deletion of "${exp.role} @ ${exp.company}"?`)) return;
    await apiJson("/api/pending", {
      method: "POST",
      body: JSON.stringify({
        section: "experience",
        model: "experience",
        action: "DELETE",
        targetId: exp.id,
        label: `Delete experience: ${exp.role} @ ${exp.company}`,
      }),
    });
    loadPending();
  }

  async function discard(id: string) {
    await apiFetch(`/api/pending/${id}`, { method: "DELETE" });
    loadPending();
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Experience</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">Powers the /experience vertical timeline.</p>

      <Button onClick={openNew} className="mb-6">
        + Add Experience
      </Button>

      <div className="space-y-3">
        {initialExperiences.map((exp) => {
          const change = pendingByTarget.get(exp.id);
          return (
            <Card key={exp.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">
                  {exp.role} <span className="text-muted">@ {exp.company}</span>
                </p>
                <p className="text-xs text-muted">
                  {exp.startDate} – {exp.endDate || "Present"} · {exp.bullets.length} bullet(s)
                </p>
              </div>
              {change ? (
                <div className="flex items-center gap-2">
                  <Badge tone={change.action === "DELETE" ? "delete" : "update"}>{change.action} pending</Badge>
                  <button onClick={() => discard(change.id)} className="text-xs text-muted hover:text-danger">
                    Discard
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => openEdit(exp)} className="text-xs text-accentBlue hover:underline">
                    Edit
                  </button>
                  <button onClick={() => stageDelete(exp)} className="text-xs text-danger hover:underline">
                    Delete
                  </button>
                </div>
              )}
            </Card>
          );
        })}
        {pendingCreates.map((p) => (
          <Card key={p.id} className="flex items-center justify-between bg-emerald-500/5">
            <p className="text-white/85">{p.label}</p>
            <div className="flex items-center gap-2">
              <Badge tone="create">CREATE pending</Badge>
              <button onClick={() => discard(p.id)} className="text-xs text-muted hover:text-danger">
                Discard
              </button>
            </div>
          </Card>
        ))}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
          <Card className="w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <h2 className="mb-4 font-semibold text-white">{formOpen === "new" ? "Add" : "Edit"} Experience</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Role" required>
                  <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </Field>
                <Field label="Company" required>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Start" required>
                  <Input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="2026" />
                </Field>
                <Field label="End (blank = Present)">
                  <Input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Accent color">
                  <Input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                </Field>
                <Field label="Icon">
                  <IconPicker value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
                </Field>
              </div>
              <Field label="Bullet points">
                <div className="space-y-2">
                  {form.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={b}
                        onChange={(e) =>
                          setForm({ ...form, bullets: form.bullets.map((x, idx) => (idx === i ? e.target.value : x)) })
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setForm({ ...form, bullets: form.bullets.filter((_, idx) => idx !== i) })}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={() => setForm({ ...form, bullets: [...form.bullets, ""] })}>
                    + Add bullet
                  </Button>
                </div>
              </Field>
            </div>

            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button disabled={busy} onClick={submit}>
                {busy ? "Staging…" : "Stage change"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
