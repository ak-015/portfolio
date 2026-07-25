"use client";

import { useState } from "react";
import Link from "next/link";
import { apiJson } from "@/components/apiClient";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";

type Form = {
  email: string;
  phone: string;
  location: string;
  availabilityStatus: string;
  bookingLink: string;
  mapLatitude: string;
  mapLongitude: string;
  mapLocationText: string;
  resumeUrl: string;
};

function toForm(p: any): Form {
  return {
    email: p?.email ?? "",
    phone: p?.phone ?? "",
    location: p?.location ?? "",
    availabilityStatus: p?.availabilityStatus ?? "",
    bookingLink: p?.bookingLink ?? "",
    mapLatitude: p?.mapLatitude != null ? String(p.mapLatitude) : "",
    mapLongitude: p?.mapLongitude != null ? String(p.mapLongitude) : "",
    mapLocationText: p?.mapLocationText ?? "",
    resumeUrl: p?.resumeUrl ?? "",
  };
}

export default function ContactEditor({ initialProfile }: { initialProfile: any | null }) {
  const [form, setForm] = useState<Form>(toForm(initialProfile));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        ...form,
        mapLatitude: form.mapLatitude === "" ? null : Number(form.mapLatitude),
        mapLongitude: form.mapLongitude === "" ? null : Number(form.mapLongitude),
      };
      await apiJson("/api/pending", {
        method: "POST",
        body: JSON.stringify({
          section: "profile",
          model: "profile",
          action: "UPDATE",
          targetId: initialProfile?.id ?? null,
          label: "Update contact page content",
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
    <div className="max-w-2xl">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Contact Page</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">
        Social icons on this page are managed under{" "}
        <Link href="/dashboard/social-links" className="text-accentBlue hover:underline">
          Social Links
        </Link>
        .
      </p>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" required>
            <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone" required>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
        </div>
        <Field label="Location (short label)" required>
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Availability status text">
          <Input
            value={form.availabilityStatus}
            onChange={(e) => set("availabilityStatus", e.target.value)}
            placeholder="Open for Freelance & Full-time Opportunities"
          />
        </Field>
        <Field label="Schedule-a-call booking link">
          <Input value={form.bookingLink} onChange={(e) => set("bookingLink", e.target.value)} placeholder="https://calendly.com/…" />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Map latitude">
            <Input value={form.mapLatitude} onChange={(e) => set("mapLatitude", e.target.value)} />
          </Field>
          <Field label="Map longitude">
            <Input value={form.mapLongitude} onChange={(e) => set("mapLongitude", e.target.value)} />
          </Field>
        </div>
        <Field label="Map location caption">
          <Textarea rows={2} value={form.mapLocationText} onChange={(e) => set("mapLocationText", e.target.value)} />
        </Field>
        <Field label="Resume URL">
          <Input value={form.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} />
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
