import { BriefcaseBusiness, Clock3, Users, UserPlus } from "lucide-react";

const stats = [
  {
    label: "Total members",
    value: "14",
    detail: "Across 3 teams",
    icon: Users,
  },
  {
    label: "Active members",
    value: "12",
    detail: "85.7% active",
    icon: BriefcaseBusiness,
  },
  {
    label: "Pending invites",
    value: "2",
    detail: "Awaiting response",
    icon: Clock3,
  },
  {
    label: "Admins",
    value: "3",
    detail: "Workspace admins",
    icon: UserPlus,
  },
];

export function MembersStats() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-500">{stat.label}</p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                <Icon size={17} strokeWidth={1.8} />
              </div>
            </div>

            <p className="mt-3 text-xs text-zinc-400">{stat.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
