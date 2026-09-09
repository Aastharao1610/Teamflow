import { notificationQueue } from "../../lib/queue";

export const queueOrganizationInvitationEmail = async ({
  to,
  organizationName,
  token,
}: {
  to: string;
  organizationName: string;
  token: string;
}) => {
  await notificationQueue.add(
    "organization-invitation-email",
    {
      to,
      organizationName,
      token,
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
