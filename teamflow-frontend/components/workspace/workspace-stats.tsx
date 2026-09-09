import { CheckCircle2, Clock3, FolderKanban, Users } from "lucide-react";

const stats = [
  {
    label: "Projects",
    value: "8",
    description: "3 active",
    icon: FolderKanban,
  },
  {
    label: "Open tasks",
    value: "42",
    description: "8 due this week",
    icon: Clock3,
  },
  {
    label: "Completed",
    value: "128",
    description: "This month",
    icon: CheckCircle2,
  },
  {
    label: "Members",
    value: "14",
    description: "3 teams",
    icon: Users,
  },
];

export function WorkspaceStats() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>

              <Icon size={17} strokeWidth={1.8} className="text-zinc-400" />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight text-zinc-950">
                {stat.value}
              </p>

              <p className="text-xs text-zinc-400">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
