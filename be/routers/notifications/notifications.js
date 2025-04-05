import { Router } from "express";
import NotificationController from "../../controllers/notifications/notifications";

const notificationController = new NotificationController();
const notiApiRouter = Router();

notiApiRouter.get("/notifications", notificationController.getAllNotifications);
notiApiRouter.patch("/notifications/:id", notificationController.markAsRead);
notiApiRouter.post("/notifications", notificationController.createNotification);

export default notiApiRouter;
