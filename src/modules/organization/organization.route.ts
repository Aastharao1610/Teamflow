import { Router } from "express";

import {
  createOrganization,
  getMyOrganizations,
  getOrganizationBySlug,
  updateOrganization,
  getorganizationById,
  deleteOrganization,
  inviteMember,
  acceptInvitation,
  rejectInvitation,
  removeMember,
  leaveOrganization,
  transferOwnership,
} from "./organization.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import {
  acceptInvitationSchema,
  createOrganizationSchema,
  rejectInvitationSchema,
  transferOwnershipSchema,
  inviteMemberSchema,
} from "./organization.validation";

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
router.delete("/:id", authenticate, deleteOrganization);
router.post(
  "/:id/invite",
  authenticate,
  validate(inviteMemberSchema),
  inviteMember,
);
router.post(
  "/accept-invitation",
  authenticate,
  validate(acceptInvitationSchema),
  acceptInvitation,
);
router.post(
  "/reject-invitation",
  authenticate,
  validate(rejectInvitationSchema),
  rejectInvitation,
);

router.delete("/:id/members/:memberId", authenticate, removeMember);

router.post("/:id/leave", authenticate, leaveOrganization);

router.post(
  "/:id/transfer-ownership",
  authenticate,
  validate(transferOwnershipSchema),
  transferOwnership,
);

export default router;
