import Image from "next/image";
import { FiStar } from "react-icons/fi";
import type { FieldInputType } from "@prisma/client";

export interface RenderField {
  id: string;
  key: string;
  label: string;
  inputType: FieldInputType;
  required: boolean;
}

export interface RenderValue {
  fieldId: string;
  value: string | null;
}

export default function HobbyEntryCard({
  fields,
  values,
}: {
  fields: RenderField[];
  values: RenderValue[];
}) {
  const valueFor = (fieldId: string) =>
    values.find((v) => v.fieldId === fieldId)?.value ?? null;

  // An entry "leads" with the first IMAGE field (if any) as a cover, then
  // renders every other field generically — no assumptions about which
  // hobby this belongs to.
  const imageField = fields.find((f) => f.inputType === "IMAGE");
  const otherFields = fields.filter((f) => f.id !== imageField?.id);
  const coverUrl = imageField ? valueFor(imageField.id) : null;

  // Prefer a short text/title-like field as the card heading if present.
  const titleField = otherFields.find(
    (f) => f.inputType === "TEXT" && /title|name/i.test(f.key)
  );

  return (
    <div className="card card-hover overflow-hidden">
      {coverUrl && (
        <div className="relative h-44 w-full bg-white/5">
          <Image
            src={coverUrl}
            alt={titleField ? valueFor(titleField.id) || "" : "Hobby entry"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="space-y-2 p-5">
        {titleField && (
          <h3 className="font-display text-base font-semibold text-white">
            {valueFor(titleField.id)}
          </h3>
        )}
        {otherFields
          .filter((f) => f.id !== titleField?.id)
          .map((field) => {
            const v = valueFor(field.id);
            if (!v) return null;
            if (field.inputType === "RATING") {
              const n = Number(v) || 0;
              return (
                <div key={field.id} className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < n ? "fill-accent-purple text-accent-purple" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
              );
            }
            if (field.inputType === "URL") {
              return (
                <a
                  key={field.id}
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs font-medium text-accent-cyan hover:underline"
                >
                  {field.label}
                </a>
              );
            }
            return (
              <p key={field.id} className="text-xs text-muted">
                <span className="text-white/50">{field.label}: </span>
                {v}
              </p>
            );
          })}
      </div>
    </div>
  );
}
