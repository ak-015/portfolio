import Image from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <Link href={`/projects/${project.slug}`} className="focus-ring block">
        <div className="relative h-44 w-full overflow-hidden bg-white/5">
          <Image
            src={project.coverImageUrl}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/projects/${project.slug}`} className="focus-ring rounded">
          <h3 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-accent-purple">
            {project.title}
          </h3>
        </Link>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-3 pt-2">
          <a
            href={project.liveUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 !py-2 !text-xs"
          >
            Live Demo
          </a>
          <Link
            href={`/projects/${project.slug}`}
            className="btn-secondary flex-1 !py-2 !text-xs"
          >
            Read
          </Link>
        </div>
      </div>
    </div>
  );
}
