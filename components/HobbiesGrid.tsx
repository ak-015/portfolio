import Image from "next/image";
import Link from "next/link";
import type { HobbyCard } from "@prisma/client";

export default function HobbiesGrid({ hobbies }: { hobbies: HobbyCard[] }) {
  if (!hobbies?.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {hobbies.map((hobby) => (
        <Link
          key={hobby.id}
          href={`/hobbies/${hobby.slug}`}
          className="card card-hover focus-ring group relative block h-40 overflow-hidden"
        >
          <Image
            src={hobby.coverImageUrl}
            alt={hobby.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">
            {hobby.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
