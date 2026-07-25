"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/components/apiClient";
import { Button, Card, Badge } from "@/components/ui";

type Project = { id: string; title: string; slug: string; featured: boolean; order: number; category: { name: string } };
type PendingChange = { id: string; targetId: string | null; action: "CREATE" | "UPDATE" | "DELETE"; label: string; model: string };

export default function ProjectsList({ initialProjects }: { initialProjects: Project[] }) {
  const [pending, setPending] = useState<PendingChange[]>([]);

  async function loadPending() {
    const data = await apiJson<{ sections: { section: string; changes: PendingChange[] }[] }>("/api/pending");
    const group = data.sections.find((s) => s.section === "projects");
    setPending((group?.changes ?? []).filter((c) => c.model === "project"));
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

  async function stageDelete(project: Project) {
    if (!confirm(`Stage deletion of "${project.title}"?`)) return;
    await apiJson("/api/pending", {
      method: "POST",
      body: JSON.stringify({
        section: "projects",
        model: "project",
        action: "DELETE",
        targetId: project.id,
        label: `Delete project: ${project.title}`,
      }),
    });
    loadPending();
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <Link href="/dashboard/pending" className="text-xs text-accentBlue hover:underline">
          Review pending changes →
        </Link>
      </div>
      <p className="mb-6 text-sm text-muted">CRUD for the public /projects grid and each detail page.</p>

      <div className="mb-6">
        <Link href="/dashboard/projects/new">
          <Button>+ Add Project</Button>
        </Link>
      </div>

      <Card className="p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {initialProjects.map((p) => {
              const change = pendingByTarget.get(p.id);
              return (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-white/85">{p.title}</td>
                  <td className="px-4 py-3 text-white/85">{p.category?.name}</td>
                  <td className="px-4 py-3 text-white/85">{p.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    {change ? (
                      <div className="flex items-center justify-end gap-2">
                        <Badge tone={change.action === "DELETE" ? "delete" : "update"}>{change.action} pending</Badge>
                        <button onClick={() => discard(change.id)} className="text-xs text-muted hover:text-danger">
                          Discard
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/dashboard/projects/${p.id}`} className="text-xs text-accentBlue hover:underline">
                          Edit
                        </Link>
                        <button onClick={() => stageDelete(p)} className="text-xs text-danger hover:underline">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {pendingCreates.map((p) => (
              <tr key={p.id} className="border-b border-border/60 bg-emerald-500/5 last:border-0">
                <td className="px-4 py-3 text-white/85" colSpan={3}>
                  {p.label}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Badge tone="create">CREATE pending</Badge>
                    <button onClick={() => discard(p.id)} className="text-xs text-muted hover:text-danger">
                      Discard
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
