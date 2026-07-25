"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/components/apiClient";
import { Button, Card, Field, Input, Select, Textarea, Badge } from "@/components/ui";
import ImageUploader from "@/components/ImageUploader";

type FieldType = "TEXT" | "TEXTAREA" | "IMAGE" | "DATE" | "TIME" | "DATETIME" | "NUMBER" | "RATING" | "URL" | "BOOLEAN";

type HField = { id: string; name: string; fieldType: FieldType; required: boolean; order: number };
type HValue = { id: string; value: string; fieldId: string };
type HEntry = { id: string; order: number; values: HValue[] };
type HSub = { id: string; name: string; order: number; fields: HField[]; entries: HEntry[] };
type Hobby = { id: string; name: string; slug: string; coverImageUrl: string | null; subCollections: HSub[] };

type PendingChange = {
  id: string;
  model: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  targetId: string | null;
  label: string;
  payload: any;
};

const FIELD_TYPES: FieldType[] = ["TEXT", "TEXTAREA", "IMAGE", "DATE", "TIME", "DATETIME", "NUMBER", "RATING", "URL", "BOOLEAN"];

export default function HobbyManager({ hobby }: { hobby: Hobby }) {
  const section = `hobby:${hobby.id}`;
  const [pending, setPending] = useState<PendingChange[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hobby rename
  const [name, setName] = useState(hobby.name);
  const [coverImageUrl, setCoverImageUrl] = useState(hobby.coverImageUrl ?? "");

  // new sub-collection
  const [newSubName, setNewSubName] = useState("");

  // new field, per sub-collection id
  const [newField, setNewField] = useState<Record<string, { name: string; fieldType: FieldType; required: boolean }>>({});

  // new entry, per sub-collection id: fieldId -> raw string value
  const [newEntry, setNewEntry] = useState<Record<string, Record<string, string>>>({});
  const [entryFormOpen, setEntryFormOpen] = useState<string | null>(null);

  async function loadPending() {
    const data = await apiJson<{ sections: { section: string; changes: PendingChange[] }[] }>("/api/pending");
    const group = data.sections.find((s) => s.section === section);
    setPending(group?.changes ?? []);
  }

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function stage(model: string, action: "CREATE" | "UPDATE" | "DELETE", targetId: string | null, label: string, payload?: unknown) {
    setBusy(true);
    setError(null);
    try {
      await apiJson("/api/pending", { method: "POST", body: JSON.stringify({ section, model, action, targetId, label, payload }) });
      await loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stage change");
    } finally {
      setBusy(false);
    }
  }

  async function discard(id: string) {
    await apiFetch(`/api/pending/${id}`, { method: "DELETE" });
    loadPending();
  }

  const hobbyRenamePending = pending.find((p) => p.model === "hobby" && p.targetId === hobby.id);
  const subCreates = pending.filter((p) => p.model === "hobbySubCollection" && p.action === "CREATE");

  function fieldBelongsTo(p: PendingChange, subId: string, h: Hobby) {
    if (p.action !== "DELETE" || !p.targetId) return false;
    return h.subCollections.some((s) => s.id === subId && s.fields.some((f) => f.id === p.targetId));
  }
  function entryBelongsTo(p: PendingChange, subId: string, h: Hobby) {
    if (p.action !== "DELETE" || !p.targetId) return false;
    return h.subCollections.some((s) => s.id === subId && s.entries.some((e) => e.id === p.targetId));
  }

  const fieldChangesFor = (subId: string) =>
    pending.filter((p) => p.model === "hobbyField" && (p.payload?.subCollectionId === subId || fieldBelongsTo(p, subId, hobby)));
  const entryChangesFor = (subId: string) =>
    pending.filter((p) => p.model === "hobbyEntry" && (p.payload?.subCollectionId === subId || entryBelongsTo(p, subId, hobby)));

  function renderValueInput(field: HField, subId: string) {
    const current = newEntry[subId]?.[field.id] ?? "";
    const set = (v: string) => setNewEntry((s) => ({ ...s, [subId]: { ...s[subId], [field.id]: v } }));

    if (field.fieldType === "IMAGE") {
      return <ImageUploader value={current} onChange={set} folder={`hobbies/${hobby.slug}`} />;
    }
    if (field.fieldType === "TEXTAREA") {
      return <Textarea rows={3} value={current} onChange={(e) => set(e.target.value)} />;
    }
    if (field.fieldType === "BOOLEAN") {
      return <input type="checkbox" checked={current === "true"} onChange={(e) => set(String(e.target.checked))} />;
    }
    if (field.fieldType === "RATING") {
      return (
        <Select value={current} onChange={(e) => set(e.target.value)}>
          <option value="">–</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 ? "s" : ""}
            </option>
          ))}
        </Select>
      );
    }
    if (field.fieldType === "DATE") return <Input type="date" value={current} onChange={(e) => set(e.target.value)} />;
    if (field.fieldType === "TIME") return <Input type="time" value={current} onChange={(e) => set(e.target.value)} />;
    if (field.fieldType === "DATETIME") return <Input type="datetime-local" value={current} onChange={(e) => set(e.target.value)} />;
    if (field.fieldType === "NUMBER") return <Input type="number" value={current} onChange={(e) => set(e.target.value)} />;
    if (field.fieldType === "URL") return <Input type="url" value={current} onChange={(e) => set(e.target.value)} />;
    return <Input value={current} onChange={(e) => set(e.target.value)} />;
  }

  async function submitEntry(sub: HSub) {
    const values = sub.fields
      .map((f) => ({ fieldId: f.id, value: newEntry[sub.id]?.[f.id] ?? "" }))
      .filter((v) => v.value !== "");
    const missing = sub.fields.filter((f) => f.required && !newEntry[sub.id]?.[f.id]);
    if (missing.length) {
      setError(`Missing required field(s): ${missing.map((f) => f.name).join(", ")}`);
      return;
    }
    await stage("hobbyEntry", "CREATE", null, `New entry in ${sub.name}`, {
      subCollectionId: sub.id,
      order: sub.entries.length,
      values,
    });
    setNewEntry((s) => ({ ...s, [sub.id]: {} }));
    setEntryFormOpen(null);
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/hobbies" className="text-xs text-muted hover:text-white">
            ← Hobbies
          </Link>
          <h1 className="text-2xl font-bold text-white">{hobby.name}</h1>
        </div>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">
        All edits below — renaming, sub-collections, fields, and entries — are staged together under{" "}
        <code className="text-white/70">{section}</code> and confirmed with a single OTP.
      </p>

      {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}

      <Card className="mb-6">
        <h2 className="mb-3 font-semibold text-white">Hobby Card</h2>
        {hobbyRenamePending ? (
          <div className="flex items-center gap-2">
            <Badge tone="update">UPDATE pending</Badge>
            <button onClick={() => discard(hobbyRenamePending.id)} className="text-xs text-muted hover:text-danger">
              Discard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Cover image">
              <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} folder="hobbies" />
            </Field>
            {(name !== hobby.name || coverImageUrl !== (hobby.coverImageUrl ?? "")) && (
              <Button
                disabled={busy}
                onClick={() =>
                  stage("hobby", "UPDATE", hobby.id, `Rename hobby to "${name}"`, {
                    name,
                    slug: hobby.slug,
                    coverImageUrl: coverImageUrl || null,
                    order: 0,
                  })
                }
              >
                Stage rename
              </Button>
            )}
          </div>
        )}
      </Card>

      {hobby.subCollections.map((sub) => (
        <Card key={sub.id} className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">{sub.name}</h2>
            <span className="text-xs text-muted">{sub.entries.length} entries</span>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Fields</p>
            <ul className="mb-3 space-y-1">
              {sub.fields.map((f) => {
                const del = pending.find((p) => p.model === "hobbyField" && p.action === "DELETE" && p.targetId === f.id);
                return (
                  <li key={f.id} className="flex items-center justify-between rounded-lg bg-panel2 px-3 py-1.5 text-sm">
                    <span className="text-white/85">
                      {f.name} <span className="text-muted">— {f.fieldType}{f.required ? ", required" : ""}</span>
                    </span>
                    {del ? (
                      <button onClick={() => discard(del.id)} className="text-xs text-muted hover:text-white">
                        Undo delete
                      </button>
                    ) : (
                      <button
                        onClick={() => stage("hobbyField", "DELETE", f.id, `Delete field "${f.name}" from ${sub.name}`)}
                        className="text-xs text-danger hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                );
              })}
              {fieldChangesFor(sub.id)
                .filter((p) => p.action === "CREATE")
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm">
                    <span className="text-white/85">{p.label}</span>
                    <button onClick={() => discard(p.id)} className="text-xs text-muted hover:text-danger">
                      Discard
                    </button>
                  </li>
                ))}
            </ul>

            <div className="flex flex-wrap items-end gap-2">
              <Input
                placeholder="Field name"
                className="max-w-[180px]"
                value={newField[sub.id]?.name ?? ""}
                onChange={(e) =>
                  setNewField((s) => ({
                    ...s,
                    [sub.id]: { name: e.target.value, fieldType: s[sub.id]?.fieldType ?? "TEXT", required: s[sub.id]?.required ?? false },
                  }))
                }
              />
              <Select
                className="max-w-[150px]"
                value={newField[sub.id]?.fieldType ?? "TEXT"}
                onChange={(e) =>
                  setNewField((s) => ({
                    ...s,
                    [sub.id]: { name: s[sub.id]?.name ?? "", fieldType: e.target.value as FieldType, required: s[sub.id]?.required ?? false },
                  }))
                }
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
              <label className="flex items-center gap-1 text-xs text-muted">
                <input
                  type="checkbox"
                  checked={newField[sub.id]?.required ?? false}
                  onChange={(e) =>
                    setNewField((s) => ({
                      ...s,
                      [sub.id]: { name: s[sub.id]?.name ?? "", fieldType: s[sub.id]?.fieldType ?? "TEXT", required: e.target.checked },
                    }))
                  }
                />
                required
              </label>
              <Button
                variant="secondary"
                disabled={busy || !newField[sub.id]?.name}
                onClick={() => {
                  const f = newField[sub.id];
                  stage("hobbyField", "CREATE", null, `Add field "${f.name}" to ${sub.name}`, {
                    name: f.name,
                    fieldType: f.fieldType,
                    required: f.required,
                    order: sub.fields.length,
                    subCollectionId: sub.id,
                  });
                  setNewField((s) => ({ ...s, [sub.id]: { name: "", fieldType: "TEXT", required: false } }));
                }}
              >
                + Add field
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Entries</p>
            <ul className="mb-3 space-y-1">
              {sub.entries.map((entry) => {
                const del = pending.find((p) => p.model === "hobbyEntry" && p.action === "DELETE" && p.targetId === entry.id);
                const summary = sub.fields
                  .slice(0, 2)
                  .map((f) => entry.values.find((v) => v.fieldId === f.id)?.value)
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={entry.id} className="flex items-center justify-between rounded-lg bg-panel2 px-3 py-1.5 text-sm">
                    <span className="text-white/85">{summary || "(entry)"}</span>
                    {del ? (
                      <button onClick={() => discard(del.id)} className="text-xs text-muted hover:text-white">
                        Undo delete
                      </button>
                    ) : (
                      <button
                        onClick={() => stage("hobbyEntry", "DELETE", entry.id, `Delete entry from ${sub.name}`)}
                        className="text-xs text-danger hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                );
              })}
              {entryChangesFor(sub.id)
                .filter((p) => p.action === "CREATE")
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm">
                    <span className="text-white/85">{p.label}</span>
                    <button onClick={() => discard(p.id)} className="text-xs text-muted hover:text-danger">
                      Discard
                    </button>
                  </li>
                ))}
            </ul>

            {sub.fields.length === 0 ? (
              <p className="text-xs text-muted">Add at least one field above before adding entries.</p>
            ) : entryFormOpen === sub.id ? (
              <Card className="bg-panel2">
                <div className="space-y-3">
                  {sub.fields.map((f) => (
                    <Field key={f.id} label={f.name} required={f.required}>
                      {renderValueInput(f, sub.id)}
                    </Field>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button disabled={busy} onClick={() => submitEntry(sub)}>
                    Stage entry
                  </Button>
                  <Button variant="ghost" onClick={() => setEntryFormOpen(null)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            ) : (
              <Button variant="secondary" onClick={() => setEntryFormOpen(sub.id)}>
                + Add entry
              </Button>
            )}
          </div>
        </Card>
      ))}

      {subCreates.map((p) => (
        <Card key={p.id} className="mb-6 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <p className="text-white/85">{p.label}</p>
            <div className="flex items-center gap-2">
              <Badge tone="create">CREATE pending</Badge>
              <button onClick={() => discard(p.id)} className="text-xs text-muted hover:text-danger">
                Discard
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            Confirm this section first (Pending Changes) — fields and entries can be added once this sub-collection is
            saved and this page reloads.
          </p>
        </Card>
      ))}

      <Card>
        <h2 className="mb-3 font-semibold text-white">Add Sub-collection</h2>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Gallery, Currently Reading, Future Reading"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
          />
          <Button
            disabled={busy || !newSubName}
            onClick={() => {
              stage("hobbySubCollection", "CREATE", null, `Add sub-collection "${newSubName}" to ${hobby.name}`, {
                name: newSubName,
                order: hobby.subCollections.length,
                hobbyId: hobby.id,
              });
              setNewSubName("");
            }}
          >
            + Add
          </Button>
        </div>
      </Card>
    </div>
  );
}
