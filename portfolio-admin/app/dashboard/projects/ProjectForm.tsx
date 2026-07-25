"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/components/apiClient";
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui";
import ImageUploader from "@/components/ImageUploader";

type Category = { id: string; name: string };
type Technology = { id: string; name: string };
type Feature = { text: string; order: number };

type InitialProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImageUrl: string | null;
  liveDemoUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
  categoryId: string;
  features: { text: string; order: number }[];
  technologies: { technology: { id: string } }[];
} | null;

export default function ProjectForm({
  categories,
  technologies,
  initialProject,
}: {
  categories: Category[];
  technologies: Technology[];
  initialProject: InitialProject;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialProject);

  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [slug, setSlug] = useState(initialProject?.slug ?? "");
  const [summary, setSummary] = useState(initialProject?.summary ?? "");
  const [description, setDescription] = useState(initialProject?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialProject?.coverImageUrl ?? "");
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialProject?.liveDemoUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initialProject?.githubUrl ?? "");
  const [featured, setFeatured] = useState(initialProject?.featured ?? false);
  const [order, setOrder] = useState(initialProject?.order ?? 0);
  const [categoryId, setCategoryId] = useState(initialProject?.categoryId ?? categories[0]?.id ?? "");
  const [features, setFeatures] = useState<Feature[]>(
    initialProject?.features?.length ? initialProject.features.map((f) => ({ text: f.text, order: f.order })) : [{ text: "", order: 0 }]
  );
  const [techIds, setTechIds] = useState<string[]>(initialProject?.technologies?.map((t) => t.technology.id) ?? []);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function slugify(v: string) {
    return v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function updateFeature(i: number, text: string) {
    setFeatures((f) => f.map((item, idx) => (idx === i ? { ...item, text } : item)));
  }
  function addFeature() {
    setFeatures((f) => [...f, { text: "", order: f.length }]);
  }
  function removeFeature(i: number) {
    setFeatures((f) => f.filter((_, idx) => idx !== i));
  }

  function toggleTech(id: string) {
    setTechIds((ids) => (ids.includes(id) ? ids.filter((t) => t !== id) : [...ids, id]));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        summary,
        description,
        coverImageUrl: coverImageUrl || null,
        liveDemoUrl: liveDemoUrl || null,
        githubUrl: githubUrl || null,
        featured,
        order: Number(order),
        categoryId,
        features: features.filter((f) => f.text.trim()).map((f, i) => ({ text: f.text.trim(), order: i })),
        technologyIds: techIds,
      };

      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "projects",
          model: "project",
          action: isEdit ? "UPDATE" : "CREATE",
          targetId: initialProject?.id ?? null,
          label: `${isEdit ? "Edit" : "New"} project: ${title}`,
          payload,
        }),
      });

      setMessage("Staged. Review and confirm from Pending Changes.");
      setTimeout(() => router.push("/dashboard/projects"), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stage change");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-white">{isEdit ? "Edit Project" : "New Project"}</h1>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Slug" required>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(title) || "auto-generated"} />
          </Field>
        </div>

        <Field label="Summary (card blurb)" required>
          <Textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </Field>

        <Field label="Description (detail page)" required>
          <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <Field label="Cover image">
          <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} folder="projects" />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Live demo URL">
            <Input value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} placeholder="# if none yet" />
          </Field>
          <Field label="GitHub URL">
            <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="# if none yet" />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Category" required>
            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Order">
            <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
          </Field>
          <Field label="Featured on home page">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="mt-2 h-4 w-4" />
          </Field>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-3 font-semibold text-white">Key Features</h2>
        <div className="space-y-2">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input value={f.text} onChange={(e) => updateFeature(i, e.target.value)} placeholder="Feature bullet…" />
              <Button type="button" variant="ghost" onClick={() => removeFeature(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" className="mt-3" onClick={addFeature}>
          + Add feature
        </Button>
      </Card>

      <Card className="mt-6">
        <h2 className="mb-3 font-semibold text-white">Technologies Used</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTech(t.id)}
              className={`rounded-pill px-3 py-1.5 text-xs ${
                techIds.includes(t.id) ? "bg-accent text-white" : "bg-panel2 text-white/70 hover:text-white"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </Card>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}

      <Button disabled={busy} onClick={submit} className="mt-6">
        {busy ? "Staging…" : "Stage change"}
      </Button>
    </div>
  );
}
