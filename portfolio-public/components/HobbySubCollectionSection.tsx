import Image from "next/image";
import { FaStar, FaRegStar, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";
import { cldThumb } from "@/lib/cloudinary";

type FieldType =
  | "TEXT" | "TEXTAREA" | "IMAGE" | "DATE" | "TIME" | "DATETIME"
  | "NUMBER" | "RATING" | "URL" | "BOOLEAN";

type Field = { id: string; name: string; fieldType: FieldType; required: boolean; order: number };
type Value = { id: string; value: string; fieldId: string };
type Entry = { id: string; order: number; values: Value[] };
type SubCollection = { id: string; name: string; order: number; fields: Field[]; entries: Entry[] };

function fieldValue(entry: Entry, fieldId: string) {
  return entry.values.find((v) => v.fieldId === fieldId)?.value;
}

function RenderValue({ field, raw }: { field: Field; raw?: string }) {
  if (raw === undefined || raw === "") return null;

  switch (field.fieldType) {
    case "IMAGE":
      return (
        <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-panel2">
          <Image src={cldThumb(raw, 640)} alt={field.name} fill className="object-cover" />
        </div>
      );
    case "RATING": {
      const n = Number(raw) || 0;
      return (
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }, (_, i) =>
            i < n ? <FaStar key={i} /> : <FaRegStar key={i} />
          )}
        </div>
      );
    }
    case "URL":
      return (
        <a
          href={raw}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accentBlue hover:underline"
        >
          {field.name} <FaExternalLinkAlt size={11} />
        </a>
      );
    case "BOOLEAN":
      return raw === "true" ? (
        <span className="inline-flex items-center gap-1 text-sm text-emerald-400">
          <FaCheckCircle /> {field.name}
        </span>
      ) : null;
    case "TEXTAREA":
      return <p className="text-sm text-muted">{raw}</p>;
    case "DATE":
    case "TIME":
    case "DATETIME":
      return <p className="text-xs text-muted">{raw}</p>;
    default:
      return <p className="text-sm text-white/90">{raw}</p>;
  }
}

function EntryCard({ fields, entry }: { fields: Field[]; entry: Entry }) {
  const imageField = fields.find((f) => f.fieldType === "IMAGE");
  const otherFields = fields.filter((f) => f.fieldType !== "IMAGE");

  return (
    <div className="rounded-xl border border-border bg-panel2 p-4">
      {imageField ? <RenderValue field={imageField} raw={fieldValue(entry, imageField.id)} /> : null}
      <div className="space-y-1.5">
        {otherFields.map((f) => (
          <RenderValue key={f.id} field={f} raw={fieldValue(entry, f.id)} />
        ))}
      </div>
    </div>
  );
}

export default function HobbySubCollectionSection({ subCollection }: { subCollection: SubCollection }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-white">{subCollection.name}</h2>
      {subCollection.entries.length === 0 ? (
        <p className="text-sm text-muted">Nothing added here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subCollection.entries.map((entry) => (
            <EntryCard key={entry.id} fields={subCollection.fields} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}
