import { FolderKanban, Plus } from "lucide-react";
import { ProjectCard } from "./project-card";

const projects = [
  {
    id: "teamflow-backend",
    name: "Teamflow Backend",
    description:
      "Express, Prisma, authentication, organizations, workspaces, projects and tasks.",
    color: "bg-zinc-900",
    tasks: 32,
    completed: 21,
    members: ["A", "S", "M"],
    dueDate: "Sep 20",
  },
  {
    id: "teamflow-frontend",
    name: "Teamflow Frontend",
    description:
      "Build the Teamflow web application with Next.js and a polished modern interface.",
    color: "bg-blue-600",
    tasks: 24,
    completed: 8,
    members: ["A", "S", "R"],
    dueDate: "Oct 2",
  },
  {
    id: "marketing",
    name: "Marketing",
    description:
      "Product launch, content planning, campaigns and marketing operations.",
    color: "bg-purple-600",
    tasks: 18,
    completed: 14,
    members: ["J", "A"],
    dueDate: "Sep 28",
  },
  {
    id: "mobile",
    name: "Mobile App",
    description: "Design and development of the Teamflow mobile experience.",
    color: "bg-emerald-600",
    tasks: 16,
    completed: 4,
    members: ["M", "R", "K"],
    dueDate: "Oct 18",
  },
];

export function ProjectList() {
  const hasProjects = projects.length > 0;

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-950">Projects</h2>

          <p className="mt-1 text-xs text-zinc-500">
            Everything your workspace is working on.
          </p>
        </div>

        {hasProjects && (
          <button
            type="button"
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            View all
          </button>
        )}
      </div>

      {/* Projects */}
      {hasProjects ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500">
            <FolderKanban size={25} strokeWidth={1.7} />
          </div>

          {/* Text */}
          <h3 className="mt-5 text-base font-semibold text-zinc-950">
            No projects yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Create your first project to start organizing tasks, collaborating
            with your team, and tracking progress.
          </p>

          {/* Action */}
          <button
            type="button"
            className="mt-6 flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Plus size={16} />
            Create project
          </button>
        </div>
      )}
    </section>
  );
}
