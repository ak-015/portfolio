import { Icon } from "@/lib/icons";

type ServiceItem = { id: string; title: string; description: string; icon: string };

export default function ServicesGrid({ services }: { services: ServiceItem[] }) {
  if (services.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-panel/60 p-6">
      <h2 className="text-2xl font-bold text-white">What I Do</h2>
      <p className="mb-6 text-sm text-muted">Services I offer</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-border bg-panel2 p-4 transition-colors hover:border-white/20"
          >
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-bg text-accentBlue">
              <Icon name={s.icon} />
            </div>
            <h3 className="text-sm font-semibold text-white">{s.title}</h3>
            <p className="mt-1 text-xs text-muted">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
