"use client";

import { useState } from "react";
import Link from "next/link";
import { apiJson } from "@/components/apiClient";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import ImageUploader from "@/components/ImageUploader";

type ProfileForm = {
  name: string;
  rolesText: string; // comma-separated in the UI, split to an array on submit
  tagline: string;
  profileImageUrl: string;
  resumeUrl: string;
  email: string;
  phone: string;
  education: string;
  location: string;
  languages: string;
  footerTagline: string;
  aboutHeadlinePrefix: string;
  aboutHeadlineWord1: string;
  aboutHeadlineMiddle: string;
  aboutHeadlineWord2: string;
  aboutIntro: string;
  positioningCopy: string;
};

function toForm(p: any): ProfileForm {
  return {
    name: p?.name ?? "",
    rolesText: (p?.roles ?? []).join(", "),
    tagline: p?.tagline ?? "",
    profileImageUrl: p?.profileImageUrl ?? "",
    resumeUrl: p?.resumeUrl ?? "",
    email: p?.email ?? "",
    phone: p?.phone ?? "",
    education: p?.education ?? "",
    location: p?.location ?? "",
    languages: p?.languages ?? "",
    footerTagline: p?.footerTagline ?? "",
    aboutHeadlinePrefix: p?.aboutHeadlinePrefix ?? "",
    aboutHeadlineWord1: p?.aboutHeadlineWord1 ?? "",
    aboutHeadlineMiddle: p?.aboutHeadlineMiddle ?? "",
    aboutHeadlineWord2: p?.aboutHeadlineWord2 ?? "",
    aboutIntro: p?.aboutIntro ?? "",
    positioningCopy: p?.positioningCopy ?? "",
  };
}

export default function ProfileEditor({ initialProfile }: { initialProfile: any | null }) {
  const [form, setForm] = useState<ProfileForm>(toForm(initialProfile));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const { rolesText, ...rest } = form;
      const payload = {
        ...rest,
        roles: rolesText
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      };

      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "profile",
          model: "profile",
          action: "UPDATE",
          targetId: initialProfile?.id ?? null,
          label: `Update profile: ${form.name || "hero / about content"}`,
          payload,
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
    <div className="max-w-3xl">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Hero / About / Profile</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">
        Every field here — including the name — is what the public site's Hero and About sections render. Nothing
        is hardcoded on the public side.
      </p>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 font-semibold text-white">Hero</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" required>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Role titles (comma-separated)" required>
              <Input
                value={form.rolesText}
                onChange={(e) => set("rolesText", e.target.value)}
                placeholder="Full Stack Developer, Android Developer, Civil Engineer"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Tagline" required>
              <Textarea rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Profile Photo">
              <ImageUploader value={form.profileImageUrl} onChange={(url) => set("profileImageUrl", url)} folder="profile" />
            </Field>
            <Field label="Resume URL">
              <Input
                value={form.resumeUrl}
                onChange={(e) => set("resumeUrl", e.target.value)}
                placeholder="https://res.cloudinary.com/.../resume.pdf"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-white">About / Info Table</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email" required>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field label="Phone" required>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="Education" required>
              <Input value={form.education} onChange={(e) => set("education", e.target.value)} />
            </Field>
            <Field label="Location" required>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <Field label="Languages" required>
              <Input value={form.languages} onChange={(e) => set("languages", e.target.value)} />
            </Field>
            <Field label="Footer tagline">
              <Input value={form.footerTagline} onChange={(e) => set("footerTagline", e.target.value)} />
            </Field>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-medium text-muted">
              About headline — renders as: &ldquo;{form.aboutHeadlinePrefix}
              <span className="text-accentBlue">{form.aboutHeadlineWord1}</span>
              {form.aboutHeadlineMiddle}
              <span className="text-accentBlue">{form.aboutHeadlineWord2}</span>&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Input placeholder="Prefix" value={form.aboutHeadlinePrefix} onChange={(e) => set("aboutHeadlinePrefix", e.target.value)} />
              <Input placeholder="Word 1 (accent)" value={form.aboutHeadlineWord1} onChange={(e) => set("aboutHeadlineWord1", e.target.value)} />
              <Input placeholder="Middle" value={form.aboutHeadlineMiddle} onChange={(e) => set("aboutHeadlineMiddle", e.target.value)} />
              <Input placeholder="Word 2 (accent)" value={form.aboutHeadlineWord2} onChange={(e) => set("aboutHeadlineWord2", e.target.value)} />
            </div>
          </div>

          <div className="mt-4">
            <Field label="About intro paragraph">
              <Textarea rows={3} value={form.aboutIntro} onChange={(e) => set("aboutIntro", e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Positioning copy (engineer-turned-developer narrative)">
              <Textarea rows={4} value={form.positioningCopy} onChange={(e) => set("positioningCopy", e.target.value)} />
            </Field>
          </div>
        </Card>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <Button disabled={busy} onClick={submit}>
          {busy ? "Staging…" : "Stage changes"}
        </Button>
      </div>
    </div>
  );
}
