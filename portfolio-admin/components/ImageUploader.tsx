"use client";

import { useRef, useState } from "react";
import { apiJson } from "@/components/apiClient";
import { Button } from "@/components/ui";

export default function ImageUploader({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const { url } = await apiJson<{ url: string }>("/api/upload", {
        method: "POST",
        body: JSON.stringify({ dataUrl, folder, kind: "image" }),
      });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-lg bg-panel2 text-xs text-muted">None</div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <Button type="button" variant="secondary" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </Button>
          {value ? (
            <Button type="button" variant="ghost" className="ml-2" onClick={() => onChange("")}>
              Remove
            </Button>
          ) : null}
          {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
