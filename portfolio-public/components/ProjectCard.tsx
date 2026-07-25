import Image from "next/image";
import Link from "next/link";
import { cldThumb } from "@/lib/cloudinary";

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  coverImageUrl?: string | null;
  liveDemoUrl?: string | null;
  githubUrl?: string | null;
  technologies: { technology: { id: string; name: string } }[];
};

export default function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-panel transition-transform hover:-translate-y-1 hover:border-white/20">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative h-40 w-full bg-panel2">
          {project.coverImageUrl ? (
            <Image
              src={cldThumb(project.coverImageUrl, 640)}
              alt={project.title}
              fill
              sizes="320px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted text-sm">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="mb-2 font-semibold text-white">{project.title}</h3>
        </Link>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((t) => (
            <span
              key={t.technology.id}
              className="rounded-md bg-panel2 px-2 py-1 text-xs text-accentBlue"
            >
              {t.technology.name}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <a
            href={project.liveDemoUrl || "#"}
            target={project.liveDemoUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-panel2 py-2 text-center text-xs text-white/80 transition-colors hover:bg-white/10"
          >
            Live Demo
          </a>
          <Link
            href={`/projects/${project.slug}`}
            className="flex-1 rounded-lg bg-panel2 py-2 text-center text-xs text-white/80 transition-colors hover:bg-white/10"
          >
            Read
          </Link>
        </div>
      </div>
    </div>
  );
}
