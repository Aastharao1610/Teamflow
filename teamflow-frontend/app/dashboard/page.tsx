import AppShell from "@/components/layout/app-shell";
import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Clock3,
  FolderKanban,
} from "lucide-react";

const stats = [
  {
    label: "My Tasks",
    value: "12",
    description: "3 due today",
    icon: CheckCircle2,
  },
  {
    label: "In Progress",
    value: "5",
    description: "2 updated today",
    icon: Clock3,
  },
  {
    label: "Projects",
    value: "8",
    description: "3 active",
    icon: FolderKanban,
  },
  {
    label: "Completed",
    value: "24",
    description: "This month",
    icon: Circle,
  },
];

const tasks = [
  {
    title: "Design dashboard interface",
    project: "Teamflow",
    priority: "HIGH",
    status: "In Progress",
  },
  {
    title: "Implement authentication",
    project: "Backend",
    priority: "URGENT",
    status: "In Progress",
  },
  {
    title: "Create project API integration",
    project: "Teamflow",
    priority: "MEDIUM",
    status: "Todo",
  },
  {
    title: "Write documentation",
    project: "Teamflow",
    priority: "LOW",
    status: "Todo",
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm text-zinc-500">Wednesday, September 9</p>

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Good morning 👋
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Here&apos;s what&apos;s happening across your workspace.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50">
            View activity
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-500">
                    {stat.label}
                  </p>

                  <Icon size={17} className="text-zinc-400" />
                </div>

                <p className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-zinc-500">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Tasks */}
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white xl:col-span-2">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  My Tasks
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Tasks assigned to you
                </p>
              </div>

              <button className="text-xs font-medium text-zinc-500 hover:text-zinc-950">
                View all
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-zinc-50"
                >
                  <button className="text-zinc-300 transition hover:text-zinc-600">
                    <Circle size={18} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">{task.project}</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      task.priority === "URGENT"
                        ? "bg-red-50 text-red-700"
                        : task.priority === "HIGH"
                          ? "bg-orange-50 text-orange-700"
                          : task.priority === "MEDIUM"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span className="hidden w-24 text-xs text-zinc-500 sm:block">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Activity */}
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-950">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Latest workspace activity
              </p>
            </div>

            <div className="space-y-5 p-5">
              <Activity
                title="Task created"
                description="Design dashboard interface"
                time="10 min ago"
              />

              <Activity
                title="Task updated"
                description="Implement authentication"
                time="32 min ago"
              />

              <Activity
                title="Project created"
                description="Teamflow frontend"
                time="1 hour ago"
              />

              <Activity
                title="Task completed"
                description="Setup backend API"
                time="2 hours ago"
              />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Activity({
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-300" />

      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-900">{title}</p>

        <p className="mt-1 truncate text-xs text-zinc-500">{description}</p>

        <p className="mt-1 text-[11px] text-zinc-400">{time}</p>
      </div>
    </div>
  );
}
