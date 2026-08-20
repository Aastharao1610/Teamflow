export type CreateTaskInput = {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date;
  projectId: string;
  createdById: string;
};

export type UpdateTaskInput = {
  taskId: string;
  title?: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status?: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  dueDate?: Date;
  updatedById: string;
};

export type DeleteTaskInput = {
  taskId: string;
  deletedById: string;
};

export type AddTaskAssigneeInput = {
  taskId: string;
  userId: string;
  assignedById: string;
};

export type RemoveTaskAssigneeInput = {
  taskId: string;
  userId: string;
  removedById: string;
};

export type CreateTaskCommentInput = {
  taskId: string;
  content: string;
  userId: string;
};

export type UpdateTaskCommentInput = {
  taskId: string;
  commentId: string;
  content: string;
  userId: string;
};

export type DeleteTaskCommentInput = {
  taskId: string;
  commentId: string;
  userId: string;
};

export type GetTasksByProjectInput = {
  projectId: string;
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assigneeId?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "dueDate";
  sortOrder?: "asc" | "desc";
};
