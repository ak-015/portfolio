import { Icon } from "@/lib/icons";
import type { ServiceItem } from "@prisma/client";

export default function ServicesGrid({ services }: { services: ServiceItem[] }) {
  if (!services?.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {services.map((s) => (
        <div key={s.id} className="card card-hover p-5 text-center sm:text-left">
          <span className="mb-3 inline-grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-accent-purple">
            <Icon name={s.icon} className="h-4 w-4" />
          </span>
          <h4 className="font-display text-sm font-semibold text-white">
            {s.title}
          </h4>
          <p className="mt-1 text-xs text-muted">{s.description}</p>
        </div>
      ))}
    </div>
  );
}
