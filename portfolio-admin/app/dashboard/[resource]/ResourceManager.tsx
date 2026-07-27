"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/components/apiClient";
import { Button, Card, Input, Textarea, Select, Field, Badge } from "@/components/ui";
import IconPicker from "@/components/IconPicker";
import type { ResourceConfig } from "@/lib/resources";

type Row = Record<string, any>;
type PendingChange = {
  id: string;
  section: string;
  model: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  targetId: string | null;
  label: string;
  payload: Row | null;
};

function emptyForm(config: ResourceConfig): Row {
  const obj: Row = {};
  for (const f of config.fields) {
    if (f.type === "boolean") obj[f.name] = f.name === "visible"; // default visible=true
    else if (f.type === "number") obj[f.name] = f.name === "order" ? 0 : "";
    else obj[f.name] = f.options?.[0]?.value ?? "";
  }
  return obj;
}

function summarize(config: ResourceConfig, values: Row): string {
  const primary = config.fields.find((f) => f.type === "text" && f.required)?.name ?? config.fields[0]?.name;
  return String(values[primary] ?? config.label);
}

function coercePayload(config: ResourceConfig, values: Row): Row {
  const out: Row = {};
  for (const f of config.fields) {
    const raw = values[f.name];
    if (f.type === "number") out[f.name] = raw === "" || raw === null ? 0 : Number(raw);
    else if (f.type === "boolean") out[f.name] = Boolean(raw);
    else out[f.name] = raw;
  }
  return out;
}

export default function ResourceManager({ config, initialRows }: { config: ResourceConfig; initialRows: Row[] }) {
  const [rows] = useState<Row[]>(initialRows);
  const [pending, setPending] = useState<PendingChange[]>([]);
  const [formOpen, setFormOpen] = useState<false | "new" | string>(false);
  const [formValues, setFormValues] = useState<Row>(emptyForm(config));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPending() {
    const data = await apiJson<{ sections: { section: string; changes: PendingChange[] }[] }>("/api/pending");
    const group = data.sections.find((s) => s.section === config.section);
    setPending((group?.changes ?? []).filter((c) => c.model === config.model));
  }

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.key]);

  const pendingByTarget = useMemo(() => {
    const map = new Map<string, PendingChange>();
    for (const p of pending) if (p.targetId) map.set(p.targetId, p);
    return map;
  }, [pending]);

  const pendingCreates = pending.filter((p) => p.action === "CREATE");

  function openNew() {
    setFormValues(emptyForm(config));
    setFormOpen("new");
  }

  function openEdit(row: Row) {
    setFormValues({ ...row });
    setFormOpen(row.id);
  }

  async function submitForm() {
    setBusy(true);
    setError(null);
    try {
      const payload = coercePayload(config, formValues);
      const isNew = formOpen === "new";
      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: config.section,
          model: config.model,
          action: isNew ? "CREATE" : "UPDATE",
          targetId: isNew ? null : formOpen,
          label: `${isNew ? "New" : "Edit"} ${config.label.replace(/s$/, "")}: ${summarize(config, formValues)}`,
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

  async function stageDelete(row: Row) {
    if (!confirm(`Stage deletion of "${summarize(config, row)}"? This won't apply until you confirm with an OTP.`)) return;
    await apiJson("/api/pending", {
      method: "POST",
      body: JSON.stringify({
        section: config.section,
        model: config.model,
        action: "DELETE",
        targetId: row.id,
        label: `Delete ${config.label.replace(/s$/, "")}: ${summarize(config, row)}`,
      }),
    });
    loadPending();
  }

  async function discardPending(id: string) {
    await apiFetch(`/api/pending/${id}`, { method: "DELETE" });
    loadPending();
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{config.label}</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">{config.description}</p>

      <div className="mb-6">
        <Button onClick={openNew}>+ Add {config.label.replace(/s$/, "")}</Button>
      </div>

      <Card className="p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted">
              {config.listColumns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium">
                  {col}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = pendingByTarget.get(row.id);
              return (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  {config.listColumns.map((col) => (
                    <td key={col} className="px-4 py-3 text-white/85">
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    {p ? (
                      <div className="flex items-center justify-end gap-2">
                        <Badge tone={p.action === "DELETE" ? "delete" : "update"}>{p.action} pending</Badge>
                        <button onClick={() => discardPending(p.id)} className="text-xs text-muted hover:text-danger">
                          Discard
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(row)} className="text-xs text-accentBlue hover:underline">
                          Edit
                        </button>
                        <button onClick={() => stageDelete(row)} className="text-xs text-danger hover:underline">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {pendingCreates.map((p) => (
              <tr key={p.id} className="border-b border-border/60 bg-emerald-500/5 last:border-0">
                <td className="px-4 py-3 text-white/85" colSpan={config.listColumns.length}>
                  {p.label}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Badge tone="create">CREATE pending</Badge>
                    <button onClick={() => discardPending(p.id)} className="text-xs text-muted hover:text-danger">
                      Discard
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && pendingCreates.length === 0 ? (
              <tr>
                <td colSpan={config.listColumns.length + 1} className="px-4 py-8 text-center text-muted">
                  Nothing here yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>

      {formOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
          <Card className="w-full max-w-lg">
            <h2 className="mb-4 font-semibold text-white">
              {formOpen === "new" ? "Add" : "Edit"} {config.label.replace(/s$/, "")}
            </h2>
            <div className="space-y-4">
              {config.fields.map((f) => (
                <Field key={f.name} label={f.label} required={f.required} help={f.helpText}>
                  {f.type === "textarea" ? (
                    <Textarea
                      rows={3}
                      value={formValues[f.name] ?? ""}
                      onChange={(e) => setFormValues({ ...formValues, [f.name]: e.target.value })}
                    />
                  ) : f.type === "select" ? (
                    <Select
                      value={formValues[f.name] ?? ""}
                      onChange={(e) => setFormValues({ ...formValues, [f.name]: e.target.value })}
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  ) : f.type === "icon" ? (
                    <IconPicker
                      value={formValues[f.name] ?? ""}
                      onChange={(v) => setFormValues({ ...formValues, [f.name]: v })}
                    />
                  ) : f.type === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(formValues[f.name])}
                      onChange={(e) => setFormValues({ ...formValues, [f.name]: e.target.checked })}
                    />
                  ) : (
                    <Input
                      type={f.type === "number" ? "number" : "text"}
                      value={formValues[f.name] ?? ""}
                      onChange={(e) => setFormValues({ ...formValues, [f.name]: e.target.value })}
                    />
                  )}
                </Field>
              ))}
            </div>

            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button disabled={busy} onClick={submitForm}>
                {busy ? "Staging…" : "Stage change"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
