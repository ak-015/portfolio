"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/components/apiClient";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import ImageUploader from "@/components/ImageUploader";

type InitialPost = {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  excerpt: string | null;
  contentHtml: string;
  liveDemoUrl: string | null;
  githubUrl: string | null;
  tags: { label: string }[];
} | null;

export default function BlogForm({ initialPost }: { initialPost: InitialPost }) {
  const router = useRouter();
  const isEdit = Boolean(initialPost);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.coverImageUrl ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(initialPost?.contentHtml ?? "");
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialPost?.liveDemoUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initialPost?.githubUrl ?? "");
  const [tagsText, setTagsText] = useState(initialPost?.tags.map((t) => t.label).join(", ") ?? "");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function slugify(v: string) {
    return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        coverImageUrl: coverImageUrl || null,
        excerpt: excerpt || null,
        contentHtml,
        liveDemoUrl: liveDemoUrl || null,
        githubUrl: githubUrl || null,
        publishedAt: initialPost ? undefined : new Date().toISOString(),
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean).map((label, i) => ({ label, order: i })),
      };

      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "blog",
          model: "blogPost",
          action: isEdit ? "UPDATE" : "CREATE",
          targetId: initialPost?.id ?? null,
          label: `${isEdit ? "Edit" : "New"} post: ${title}`,
          payload,
        }),
      });
      setMessage("Staged. Review and confirm from Pending Changes.");
      setTimeout(() => router.push("/dashboard/blog"), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stage change");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-white">{isEdit ? "Edit Post" : "New Post"}</h1>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Slug" required>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(title) || "auto-generated"} />
          </Field>
        </div>
        <Field label="Cover image">
          <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} folder="blog" />
        </Field>
        <Field label="Excerpt">
          <Textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </Field>
        <Field label="Tags (comma-separated)">
          <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="React, Node.js, PostgreSQL" />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Live demo URL">
            <Input value={liveDemoUrl} onChange={(e) => setLiveDemoUrl(e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          </Field>
        </div>
        <Field label="Body (HTML — Objectives, Challenges, How to Use, etc. as needed)" required>
          <Textarea
            rows={16}
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            className="font-mono text-xs"
            placeholder="<h2>Objectives</h2><p>…</p>"
          />
          <p className="mt-1 text-xs text-muted">
            Plain HTML editor for this deliverable — swap in a WYSIWYG editor (TipTap, Lexical, etc.) writing the same
            `contentHtml` field if you want rich-text authoring.
          </p>
        </Field>
      </Card>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}

      <Button disabled={busy} onClick={submit} className="mt-6">
        {busy ? "Staging…" : "Stage change"}
      </Button>
    </div>
  );
}
