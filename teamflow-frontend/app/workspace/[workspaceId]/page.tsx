import AppShell from "@/components/layout/app-shell";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceStats } from "@/components/workspace/workspace-stats";
import { ProjectList } from "@/components/workspace/project-list";

export default function WorkspacePage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
        <WorkspaceHeader />

        <WorkspaceStats />

        <ProjectList />
      </div>
    </AppShell>
  );
}
