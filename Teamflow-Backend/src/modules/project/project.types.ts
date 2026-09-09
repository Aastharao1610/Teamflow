export type CreateProjectInput = {
  name: string;
  description?: string;
  workspaceId: string;
  createdById: string;
};

export type UpdateProjectInput = {
  projectId: string;
  name?: string;
  description?: string;
  updatedById: string;
};

export type DeleteProjectInput = {
  projectId: string;
  deletedById: string;
};

export type AddProjectMemberInput = {
  projectId: string;
  userId: string;
  addedById: string;
};

export type RemoveProjectMemberInput = {
  projectId: string;
  userId: string;
  removedById: string;
};
export type UpdateProjectMemberRoleInput = {
  projectId: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  updatedById: string;
};
