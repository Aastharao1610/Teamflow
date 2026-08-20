export type CreateNotificationInput = {
  userId: string;
  type:
    | "TASK_ASSIGNED"
    | "TASK_STATUS_CHANGED"
    | "TASK_COMMENT_ADDED"
    | "PROJECT_MEMBER_ADDED"
    | "ORGANIZATION_INVITATION";
  title: string;
  message: string;
  data?: Record<string, string | number | boolean | null>;
};

export type GetNotificationsInput = {
  userId: string;
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
};
