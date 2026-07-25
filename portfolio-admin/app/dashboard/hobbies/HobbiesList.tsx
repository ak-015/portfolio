"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/components/apiClient";
import { Button, Card, Field, Input, Badge } from "@/components/ui";
import ImageUploader from "@/components/ImageUploader";

type Hobby = {
  id: string;
  name: string;
  slug: string;
  coverImageUrl: string | null;
  subCollections: { _count: { entries: number } }[];
};
type PendingChange = { id: string; targetId: string | null; action: "CREATE" | "UPDATE" | "DELETE"; label: string; model: string };

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function HobbiesList({ initialHobbies }: { initialHobbies: Hobby[] }) {
  const [pending, setPending] = useState<PendingChange[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPending() {
    const data = await apiJson<{ sections: { section: string; changes: PendingChange[] }[] }>("/api/pending");
    const group = data.sections.find((s) => s.section === "hobbies");
    setPending((group?.changes ?? []).filter((c) => c.model === "hobby"));
  }

  useEffect(() => {
    loadPending();
  }, []);

  const pendingByTarget = new Map(pending.filter((p) => p.targetId).map((p) => [p.targetId as string, p]));
  const pendingCreates = pending.filter((p) => p.action === "CREATE");

  async function discard(id: string) {
    await apiFetch(`/api/pending/${id}`, { method: "DELETE" });
    loadPending();
  }

  async function stageDelete(hobby: Hobby) {
    if (!confirm(`Stage deletion of "${hobby.name}"? This removes all its sub-collections, fields, and entries too.`)) return;
    await apiJson("/api/pending", {
      method: "POST",
      body: JSON.stringify({ section: "hobbies", model: "hobby", action: "DELETE", targetId: hobby.id, label: `Delete hobby: ${hobby.name}` }),
    });
    loadPending();
  }

  async function submitNew() {
    setBusy(true);
    setError(null);
    try {
      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "hobbies",
          model: "hobby",
          action: "CREATE",
          targetId: null,
          label: `New hobby: ${name}`,
          payload: { name, slug: slug || slugify(name), coverImageUrl: coverImageUrl || null, order: initialHobbies.length },
        }),
      });
      setFormOpen(false);
      setName("");
      setSlug("");
      setCoverImageUrl("");
      loadPending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stage change");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Hobbies</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">
        Each hobby card links to a fully dynamic sub-collection + field builder — open a hobby to manage its content.
      </p>

      <Button onClick={() => setFormOpen(true)} className="mb-6">
        + Add Hobby
      </Button>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialHobbies.map((h) => {
          const change = pendingByTarget.get(h.id);
          const entryCount = h.subCollections.reduce((sum, s) => sum + s._count.entries, 0);
          return (
            <Card key={h.id}>
              <p className="font-medium text-white">{h.name}</p>
              <p className="mb-3 text-xs text-muted">
                {h.subCollections.length} sub-collection(s) · {entryCount} entries
              </p>
              {change ? (
                <div className="flex items-center gap-2">
                  <Badge tone={change.action === "DELETE" ? "delete" : "update"}>{change.action} pending</Badge>
                  <button onClick={() => discard(change.id)} className="text-xs text-muted hover:text-danger">
                    Discard
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href={`/dashboard/hobbies/${h.id}`} className="text-xs text-accentBlue hover:underline">
                    Manage
                  </Link>
                  <button onClick={() => stageDelete(h)} className="text-xs text-danger hover:underline">
                    Delete
                  </button>
                </div>
              )}
            </Card>
          );
        })}
        {pendingCreates.map((p) => (
          <Card key={p.id} className="bg-emerald-500/5">
            <p className="mb-3 text-white/85">{p.label}</p>
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
          <Card className="w-full max-w-md">
            <h2 className="mb-4 font-semibold text-white">Add Hobby</h2>
            <div className="space-y-4">
              <Field label="Name" required>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Slug">
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name) || "auto-generated"} />
              </Field>
              <Field label="Cover image">
                <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} folder="hobbies" />
              </Field>
            </div>
            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button disabled={busy || !name} onClick={submitNew}>
                {busy ? "Staging…" : "Stage change"}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
