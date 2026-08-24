import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { getNotificationsSchema } from "./notification.validation";
import {
  deleteNotification,
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(getNotificationsSchema),
  getMyNotifications,
);

router.get("/unread-count", authenticate, getUnreadNotificationCount);

router.patch("/read-all", authenticate, markAllNotificationsAsRead);

router.patch("/:notificationId/read", authenticate, markNotificationAsRead);

router.delete("/:notificationId", authenticate, deleteNotification);

export default router;
