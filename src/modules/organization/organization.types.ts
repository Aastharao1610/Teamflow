export type CreateOrganizationInput = {
  name: string;
  userId: string;

};

export type InviteMemberInput = {
    organizationId: string;
    email :string;
   invitedById : string;
}