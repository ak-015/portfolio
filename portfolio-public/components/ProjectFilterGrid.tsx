"use client";

import { useMemo, useState } from "react";
import ProjectCard, { ProjectCardData } from "./ProjectCard";

type Category = { id: string; name: string; slug: string };
type ProjectWithCategory = ProjectCardData & { category: Category };

export default function ProjectFilterGrid({
  projects,
  categories,
}: {
  projects: ProjectWithCategory[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category.slug === active);
  }, [projects, active]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive("all")}
          className={`rounded-pill px-4 py-1.5 text-sm transition-colors ${
            active === "all" ? "bg-grad-primary text-white" : "text-muted hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.slug)}
            className={`rounded-pill px-4 py-1.5 text-sm transition-colors ${
              active === c.slug ? "bg-grad-primary text-white" : "text-muted hover:text-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted">No projects in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
