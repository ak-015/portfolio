import { Icon } from "@/lib/icons";
import type { TechStackItem } from "@prisma/client";

export default function TechStackGrid({
  grouped,
}: {
  grouped: Record<string, TechStackItem[]>;
}) {
  const categories = Object.keys(grouped);
  if (!categories.length) return null;

  return (
    <div className="card p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-white">My Tech Stack</h3>
      <p className="mb-6 text-sm text-muted">Technologies I work with</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <div key={cat} className="rounded-xl border border-bg-border bg-white/[0.02] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              {cat}
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped[cat].map((item) => (
                <span
                  key={item.id}
                  title={item.name}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-bg-border bg-bg-panel text-white/80"
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
