import { queueNotification } from "../src/modules/notification/notification.queue";

const userId = process.argv[2];

if (!userId) {
  throw new Error("Usage: npm run queue:test <USER_ID>");
}

await queueNotification({
  userId,
  type: "PROJECT_MEMBER_ADDED",
  title: "Queue test",
  message: "This notification was processed by BullMQ",
  data: {
    test: true,
  },
});

console.log("Notification job added successfully");
process.exit(0);
