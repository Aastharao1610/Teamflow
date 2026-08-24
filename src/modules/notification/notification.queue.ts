import { notificationQueue } from "../../lib/queue";

export const queueNotification = async ({
  userId,
  type,
  title,
  message,
  data,
}: {
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
}) => {
  await notificationQueue.add(
    "create-notification",
    {
      userId,
      type,
      title,
      message,
      data,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  );
};
