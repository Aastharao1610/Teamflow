import { Router } from "express";

import {
  createOrganization,
  getMyOrganizations,
  getOrganizationBySlug,
  updateOrganization,
  getorganizationById,
  deleteOrganization,
  acceptInvitation,
  rejectInvitation,
  leaveOrganization,
  removeMember,
  transferOwnership,
} from "./organization.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import {
  acceptInvitationSchema,
  createOrganizationSchema,
  rejectInvitationSchema,
  transferOwnershipSchema,
} from "./organization.validation";
import { inviteMember } from "./organization.controller";
import { inviteMemberSchema } from "./organization.validation";
import { authorizeOrganization } from "../../middlewares/organization.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
  createOrganization,
);
router.get("/", authenticate, getMyOrganizations);
router.get("/slug/:slug", authenticate, getOrganizationBySlug);

router.get("/:id", authenticate, getorganizationById);
router.put("/:slug", authenticate, updateOrganization);

router.delete(
  "/:id",
  authenticate,
  authorizeOrganization(["OWNER"]),
  deleteOrganization,
);
router.post(
  "/:id/invite",
  authenticate,
  authorizeOrganization(["OWNER"]),
  validate(inviteMemberSchema),
  inviteMember,
);
router.post(
  "/invitations/accept",
  authenticate,
  validate(acceptInvitationSchema),
  acceptInvitation,
);
router.post(
  "/invitations/reject",
  validate(rejectInvitationSchema),
  rejectInvitation,
);
router.post("/:id/leave", authenticate, leaveOrganization);

router.delete(
  "/:id/members/:memberId",
  authorizeOrganization(["OWNER"]),
  authenticate,
  removeMember,
);

router.post(
  "/:id/transfer-ownership",
  authenticate,
  authorizeOrganization(["OWNER"]),
  validate(transferOwnershipSchema),
  transferOwnership,
);
export default router;
