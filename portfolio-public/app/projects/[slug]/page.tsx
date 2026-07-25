import Image from "next/image";
import { notFound } from "next/navigation";
import { FaPlay, FaGithub } from "react-icons/fa";
import { getProjectBySlug, getAllProjects } from "@/lib/data";
import { cldThumb } from "@/lib/cloudinary";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="mb-8 text-3xl font-bold text-white">{project.title}</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-panel2 md:h-full">
          {project.coverImageUrl ? (
            <Image src={cldThumb(project.coverImageUrl, 900)} alt={project.title} fill className="object-cover" />
          ) : null}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-accentBlue">Key Features</h2>
          <ul className="space-y-2 text-sm text-white/85">
            {project.features.map((f) => (
              <li key={f.id}>{f.text}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={project.liveDemoUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-grad-primary px-6 py-3 text-sm font-medium text-white"
        >
          <FaPlay /> Live Demo
        </a>
        <a
          href={project.githubUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-panel2 px-6 py-3 text-sm font-medium text-white/90"
        >
          <FaGithub /> GitHub
        </a>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-accentBlue">Technologies Used</h2>
        <p className="text-sm text-white/85">
          {project.technologies.map((t) => t.technology.name).join(", ")}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-xl font-bold text-accentBlue">Description</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{project.description}</p>
      </div>
    </div>
  );
}
