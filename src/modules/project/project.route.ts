import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjectsByWorkspace,
  updateProject,
  getProjectMembers,
  removeProjectMember,
  updateProjectMemberRole,
} from "./project.controller";
import {
  addProjectMemberSchema,
  createProjectSchema,
  updateProjectMemberRoleSchema,
  updateProjectSchema,
} from "./project.validation";

const router = Router();

router.post("/", authenticate, validate(createProjectSchema), createProject);
router.get("/workspace/:workspaceId", authenticate, getProjectsByWorkspace);
router.get("/:projectId", authenticate, getProjectById);
router.patch(
  "/:projectId",
  authenticate,
  validate(updateProjectSchema),
  updateProject,
);
router.delete("/:projectId", authenticate, deleteProject);
router.post(
  "/:projectId/members",
  authenticate,
  validate(addProjectMemberSchema),
  addProjectMember,
);
router.get("/:projectId/members", authenticate, getProjectMembers);
router.delete("/:projectId/members/:userId", authenticate, removeProjectMember);
router.patch(
  "/:projectId/members/:userId/role",
  authenticate,
  validate(updateProjectMemberRoleSchema),
  updateProjectMemberRole,
);

export default router;
