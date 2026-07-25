import { Icon } from "@/lib/icons";
import StatStrip from "./StatStrip";

type Bullet = { id: string; text: string };
type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  color?: string | null;
  icon?: string | null;
  bullets: Bullet[];
};
type StatItem = { id: string; label: string; value: string; icon: string };

export default function ExperienceTimeline({
  experiences,
  stats,
}: {
  experiences: ExperienceItem[];
  stats: StatItem[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel/60 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-white">Experience</h1>
      <p className="mb-8 text-sm text-muted">My professional journey</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
          {stats.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border-b border-border/60 pb-4 last:border-b-0 last:pb-0">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-panel2 text-accentBlue">
                <Icon name={s.icon} />
              </div>
              <div>
                <p className="font-semibold text-white">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative pl-4">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-border" />
          <ul className="space-y-10">
            {experiences.map((exp) => (
              <li key={exp.id} className="relative grid grid-cols-[auto_1fr_auto] items-start gap-4">
                <div className="flex flex-col items-center pt-1">
                  <span className="text-xs font-medium" style={{ color: exp.color || "#60a5fa" }}>
                    {exp.startDate} – {exp.endDate || "Present"}
                  </span>
                  <span
                    className="mt-2 h-3 w-3 rounded-full ring-4"
                    style={{
                      backgroundColor: exp.color || "#60a5fa",
                      boxShadow: `0 0 0 4px ${exp.color || "#60a5fa"}22`,
                    }}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg bg-panel2 text-accentBlue">
                    <Icon name={exp.icon} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{exp.role}</h3>
                    <p className="text-sm" style={{ color: exp.color || "#60a5fa" }}>
                      {exp.company}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                      {exp.bullets.map((b) => (
                        <li key={b.id}>{b.text}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <span
                  className="hidden rounded-lg px-3 py-1 text-xs font-medium md:inline-block"
                  style={{
                    color: exp.color || "#60a5fa",
                    backgroundColor: `${exp.color || "#60a5fa"}1a`,
                  }}
                >
                  {exp.startDate} – {exp.endDate || "Present"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
