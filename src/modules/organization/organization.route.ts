import { Router } from "express";

import { createOrganization ,getMyOrganizations ,getOrganizationBySlug ,updateOrganization ,getorganizationById ,deleteOrganization} from "./organization.controller";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";

import { createOrganizationSchema } from "./organization.validation";
import { inviteMember  } from "./organization.controller";
import { inviteMemberSchema } from "./organization.validation";


const router = Router();

router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
  createOrganization
);
router.get("/", authenticate, getMyOrganizations)
router.get("/slug/:slug", authenticate, getOrganizationBySlug);

router.get("/:id", authenticate, getorganizationById)
router.put("/:slug", authenticate, updateOrganization)
router.delete("/:id", authenticate, deleteOrganization)
router.post("/:id/invite",authenticate,validate(inviteMemberSchema),inviteMember);

export default router;