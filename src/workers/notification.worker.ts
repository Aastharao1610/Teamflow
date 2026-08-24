import { Worker } from "bullmq";
import { redisConnection } from "../lib/queue";
import { createNotification } from "../modules/notification/notification.service";
import { sendMail } from "../lib/mail";

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    switch (job.name) {
      case "create-notification": {
        await createNotification(job.data);

        console.log(`Notification ${job.id} created`);

        break;
      }

      case "organization-invitation-email": {
        const { to, organizationName, token } = job.data;

        await sendMail({
          to,
          subject: "Organization Invitation",
          html: `
            <h2>You've been invited!</h2>

            <p>
              You've been invited to join ${organizationName}.
            </p>

            <p>
              Click below to join the organization.
            </p>

            <a href="${process.env.FRONTEND_URL}/invitations/${token}">
              Accept Invitation
            </a>
          `,
        });

        console.log(`Invitation email sent to ${to}`);

        break;
      }

      default:
        throw new Error(`Unknown notification job: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
  },
);

notificationWorker.on("completed", (job) => {
  console.log(`Job ${job.id} (${job.name}) completed`);
});

notificationWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} (${job?.name}) failed:`, error);
});

console.log("Notification worker started");
