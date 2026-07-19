import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FiExternalLink, FiGithub, FiCheckCircle } from "react-icons/fi";
import { getProjectBySlug } from "@/lib/data";
import { iconMap } from "@/lib/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [project.coverImageUrl] },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const paragraphs = project.description.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="font-display text-4xl font-bold text-white">{project.title}</h1>

      {/* Top section: image+buttons | key features + technologies */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left: cover image + action buttons */}
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-bg-border bg-white/5">
            <Image src={project.coverImageUrl} alt={project.title} fill className="object-cover" priority />
          </div>
          <div className="mt-6 flex gap-4">
            <a href={project.liveUrl || "#"} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
              <FiExternalLink className="h-4 w-4" /> Live Demo
            </a>
            <a href={project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1">
              <FiGithub className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>

        {/* Right: key features + technologies stacked */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-display text-xl font-bold text-accent-cyan">Key Features</h2>
            <ul className="mt-4 space-y-2">
              {project.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-accent-cyan">Technologies</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {project.technologies.map((t) => {
                const aliases: Record<string, string> = {
                  "next.js": "nextjs", "nextjs": "nextjs",
                  "node.js": "nodejs", "nodejs": "nodejs",
                  "socket.io": "socketio", "socketio": "socketio",
                  "tailwind css": "tailwindcss", "tailwindcss": "tailwindcss", "tailwind": "tailwindcss",
                  "typescript": "typescript", "javascript": "javascript",
                  "react": "react", "react.js": "react",
                  "express": "express", "express.js": "express",
                  "postgresql": "postgresql", "postgres": "postgresql",
                  "mongodb": "mongodb", "mongoose": "mongoose",
                  "prisma": "prisma", "python": "python",
                  "git": "git", "postman": "postman",
                  "arcgis": "arcgis", "vite": "vite",
                  "jwt": "jwt", "json web tokens": "jwt",
                  "resend": "resend",
                };
                const iconKey = aliases[t.toLowerCase()] ?? t.toLowerCase().replace(/[^a-z0-9]/g, "");
                const IconCmp = iconMap[iconKey] ?? null;
                return (
                  <div key={t} className="flex flex-col items-center gap-1" title={t}>
                    {IconCmp ? (
                      <>
                        <IconCmp className="h-7 w-7 text-white/70" />
                        <span className="text-[10px] text-muted">{t}</span>
                      </>
                    ) : (
                      <span className="chip text-xs">{t}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Description full-width below */}
      <div className="mt-12">
        <h2 className="font-display text-xl font-bold text-accent-cyan">Description</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
