import Image from "next/image";
import { Icon } from "@/lib/icons";

export interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string | null;
  startLabel: string;
  endLabel: string;
  bullets?: string[];
  description?: string | null;
  icon?: string | null;
  colorToken?: string | null;
  coverImageUrl?: string | null;
  featured?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  purple: "border-accent-purple text-accent-purple bg-accent-purple/15",
  blue: "border-accent-blue text-accent-blue bg-accent-blue/15",
  cyan: "border-accent-cyan text-accent-cyan bg-accent-cyan/15",
  pink: "border-pink-400 text-pink-400 bg-pink-400/15",
};

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative border-l border-bg-border pl-8 sm:pl-10">
      {items.map((item, i) => {
        const color = COLOR_MAP[item.colorToken || "purple"] || COLOR_MAP.purple;
        return (
          <li key={item.id} className="mb-10 last:mb-0">
            <span
              className={`absolute -left-[9px] mt-1.5 grid h-4 w-4 place-items-center rounded-full border-2 ${color} ring-4 ring-bg`}
            />
            <div className="mb-1 flex flex-wrap items-center gap-3">
              <span className={`chip !border-current ${color}`}>
                {item.startLabel} – {item.endLabel}
              </span>
              {item.featured && (
                <span className="chip bg-gradient-brand !border-transparent text-white">
                  Featured
                </span>
              )}
            </div>
            <div className="card p-5">
              <div className="flex items-start gap-4">
                {item.icon && (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/5 text-accent-purple">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-white break-words">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-sm font-medium text-accent-purple">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-2 text-sm text-muted">{item.description}</p>
                  )}
                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-muted break-words">
                      {item.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {item.coverImageUrl && (
                    <div className="relative mt-4 h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
