"use client";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (method !== "GET" && method !== "HEAD") {
    const csrf = readCookie("csrf_token");
    if (csrf) headers.set("x-csrf-token", csrf);
    if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(input, { ...init, headers, credentials: "same-origin" });
  return res;
}

export async function apiJson<T = any>(input: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(input, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}
