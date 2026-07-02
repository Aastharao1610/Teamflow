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
  token: string;
  userId: string;
};
export type RejectInvitationInput = {
  token: string;
};
export type LeaveOrganizationInput = {
  organizationId: string;
  userId: string;
};
export type RemoveMemberInput = {
  organizationId: string;
  memberId: string;
  userId: string;
};
export type TransferOwnershipInput = {
  organizationId: string;
  currentOwnerId: string;
  newOwnerId: string;
};
