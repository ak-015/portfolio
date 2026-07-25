"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/components/apiClient";
import { Button } from "@/components/ui";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleLogout} className="w-full text-left">
      Sign out
    </Button>
  );
}
