import { NextResponse } from "next/server";
import { getSessionAdminId } from "@/lib/auth";

export async function requireAuth() {
  const adminId = await getSessionAdminId();
  if (!adminId) {
    return { ok: false as const, response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }
  return { ok: true as const, adminId };
}
