export type CreateOrganizationInput = {
  name: string;
  userId: string;
};

export type InviteMemberInput = {
  organizationId: string;
  email: string;
  invitedById: string;
};

export type AcceptInvitationInput = {
  userId: string;
  invitationToken: string;
};
export type LeaveOrganizationInput = {
  organizationId: string;
  userId: string;
};

export type RejectInvitationInput = {
  organizationId: string;
  userId: string;
  inviteToken: string;
};

export type RemoveMemberInput = {
  organizationId: string;
  memberId: string;
  removedById: string;
};

export type TransferOwnershipInput = {
  organizationId: string;
  newOwnerId: string;
  currentOwnerId: string;
};
