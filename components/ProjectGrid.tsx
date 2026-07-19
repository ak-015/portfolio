"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@prisma/client";
import ProjectCard from "./ProjectCard";

const FILTERS: { label: string; value: ProjectCategory | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Web", value: "WEB" },
  { label: "Android", value: "ANDROID" },
  { label: "Civil Engineering", value: "CIVIL_ENGINEERING" },
  { label: "UI/UX", value: "UI_UX" },
];

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectCategory | "ALL">("ALL");

  const filtered = useMemo(
    () =>
      active === "ALL" ? projects : projects.filter((p) => p.category === active),
    [active, projects]
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="mb-8 flex flex-wrap justify-center gap-2 rounded-pill border border-bg-border bg-bg-card p-1.5 sm:inline-flex"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={active === f.value}
            onClick={() => setActive(f.value)}
            className={`focus-ring rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
              active === f.value
                ? "bg-gradient-brand text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted">
          No projects in this category yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
