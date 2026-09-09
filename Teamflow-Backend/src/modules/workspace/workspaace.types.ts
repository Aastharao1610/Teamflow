export type CreateWorkspaceInput = {
  name: string;
  description?: string;
  organizationId: string;
  createdById: string;
};
export type UpdateWorkspaceInput = {
  workspaceId: string;
  name?: string;
  description?: string;
  updatedById: string;
};

export type DeleteWorkspaceInput = {
  workspaceId: string;
  deletedById: string;
};

export type AddWorkspaceMemberInput = {
  workspaceId: string;
  userId: string;
  addedById: string;
};

export type RemoveWorkspaceMemberInput = {
  workspaceId: string;
  userId: string;
  removedById: string;
};

export type UpdateWorkspaceMemberRoleInput = {
  workspaceId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  updatedById: string;
};
