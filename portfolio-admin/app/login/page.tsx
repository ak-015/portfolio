"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/components/apiClient";
import { Button, Input, Card } from "@/components/ui";

type Step = "password" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setStep("otp");
      setNotice("We emailed you a 6-digit code.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ code }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch("/api/auth/resend-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not resend code");
      setNotice("A new code has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-6">
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold text-white">Admin Sign In</h1>
        <p className="mb-6 text-sm text-muted">
          {step === "password" ? "Portfolio content management" : "Enter the code we emailed you"}
        </p>

        {step === "password" ? (
          <form onSubmit={submitPassword} className="space-y-4">
            <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Checking…" : "Continue"}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitOtp} className="space-y-4">
            {notice ? <p className="text-sm text-emerald-400">{notice}</p> : null}
            <Input
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy || code.length !== 6} className="w-full">
              {busy ? "Verifying…" : "Verify & Sign In"}
            </Button>
            <button type="button" onClick={resend} disabled={busy} className="w-full text-center text-xs text-muted hover:text-white">
              Resend code
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
