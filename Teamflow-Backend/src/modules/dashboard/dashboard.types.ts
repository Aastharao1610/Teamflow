export type DashboardTaskStats = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  cancelled: number;
  overdue: number;
};

export type DashboardData = {
  organizations: unknown[];
  workspaceCount: number;
  projectCount: number;
  taskStats: DashboardTaskStats;
  myTasks: unknown[];
  recentActivity: unknown[];
  unreadNotifications: number;
};
