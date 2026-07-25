"use client";

import { ICON_KEYS, Icon } from "@/lib/icons";

export default function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-panel2 text-lg text-white">
        <Icon name={value} />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-white focus:border-accentBlue focus:outline-none"
      >
        <option value="">Select an icon…</option>
        {ICON_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </div>
  );
}
