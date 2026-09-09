import AppShell from "@/components/layout/app-shell";
import { MembersHeader } from "@/components/members/members-header";
import { MembersStats } from "@/components/members/members-stats";
import { MembersList } from "@/components/members/members-list";

export default function MembersPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:p-8">
        <MembersHeader />
        <MembersStats />
        <MembersList />
      </div>
    </AppShell>
  );
}
