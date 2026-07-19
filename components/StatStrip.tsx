import { Icon } from "@/lib/icons";
import type { StatItem } from "@prisma/client";

export default function StatStrip({
  stats,
  layout = "row",
}: {
  stats: StatItem[];
  layout?: "row" | "grid";
}) {
  if (!stats?.length) return null;

  return (
    <div
      className={
        layout === "row"
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          : "grid grid-cols-2 gap-4"
      }
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="card card-hover flex items-center gap-3 px-4 py-4"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-accent-purple">
            <Icon name={stat.icon} className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-white truncate">
              {stat.value}
            </p>
            <p className="text-xs text-muted truncate">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
