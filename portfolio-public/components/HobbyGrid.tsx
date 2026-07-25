import Image from "next/image";
import Link from "next/link";
import { cldThumb } from "@/lib/cloudinary";

type Hobby = { id: string; name: string; slug: string; coverImageUrl?: string | null };

export default function HobbyGrid({ hobbies }: { hobbies: Hobby[] }) {
  if (hobbies.length === 0) return null;
  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-white">My Hobbies</h2>
      <p className="mb-6 text-sm text-muted">Things I enjoy</p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {hobbies.map((h) => (
          <Link
            key={h.id}
            href={`/about/${h.slug}`}
            className="group overflow-hidden rounded-2xl border border-border bg-panel transition-transform hover:-translate-y-1 hover:border-white/20"
          >
            <div className="relative h-32 w-full bg-panel2 sm:h-40">
              {h.coverImageUrl ? (
                <Image src={cldThumb(h.coverImageUrl, 500)} alt={h.name} fill className="object-cover" />
              ) : null}
            </div>
            <p className="bg-black/30 p-3 font-medium text-white">{h.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
