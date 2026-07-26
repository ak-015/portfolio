import { Icon } from "@/lib/icons";

type Tech = { id: string; name: string; icon: string; category: string };

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGES: "Languages",
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  TOOLS: "Tools",
  MOBILE: "Mobile",
  OTHER: "Other",
};

export default function TechStackGrid({ technologies }: { technologies: Tech[] }) {
  const grouped = technologies.reduce<Record<string, Tech[]>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  const categories = Object.keys(grouped);
  if (categories.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-panel/60 p-6">
      <h2 className="text-2xl font-bold text-white">My Tech Stack</h2>
      <p className="mb-6 text-sm text-muted">Technologies I work with</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-4">
        {categories.map((cat) => (
          <div key={cat} className="rounded-xl border border-border bg-panel2 p-4">
            <p className="mb-3 text-sm font-medium text-white/90">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="flex flex-wrap gap-3 text-2xl">
              {grouped[cat].map((t) => (
                <span key={t.id} title={t.name}>
                  <Icon name={t.icon} />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
