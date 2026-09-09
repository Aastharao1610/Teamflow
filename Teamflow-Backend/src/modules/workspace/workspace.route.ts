import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import {
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspacesByOrganization,
  addWorkspaceMember,
  getworkspaceMembers,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from "./workspace.controller";
import {
  createWorkspaceSchema,
  addWorkspaceMemberSchema,
  updateWorkspaceMemberRoleSchema,
} from "./workspace.validation";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createWorkspaceSchema),
  createWorkspace,
);
router.get(
  "/organization/:organizationId",
  authenticate,
  getWorkspacesByOrganization,
);
router.get("/:workspaceId", authenticate, getWorkspaceById);
router.put("/:workspaceId", authenticate, updateWorkspace);
router.delete("/:workspaceId", authenticate, deleteWorkspace);

router.post(
  "/:workspaceId/members",
  authenticate,
  validate(addWorkspaceMemberSchema),
  addWorkspaceMember,
);

router.get("/:workspaceId/members", authenticate, getworkspaceMembers);
router.delete(
  "/:workspaceId/members/:userId",
  authenticate,
  removeWorkspaceMember,
);
router.patch(
  "/:workspaceId/members/:userId",
  authenticate,
  validate(updateWorkspaceMemberRoleSchema),
  updateWorkspaceMemberRole,
);

export default router;
