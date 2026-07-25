import { Icon } from "@/lib/icons";

type StatItem = { id: string; label: string; value: string; icon: string };

export default function StatStrip({ stats }: { stats: StatItem[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-panel/60 p-5 sm:grid-cols-3 md:grid-cols-6">
      {stats.map((s) => (
        <div key={s.id} className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-panel2 text-lg text-accentBlue">
            <Icon name={s.icon} />
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
