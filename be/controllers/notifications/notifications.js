import Notification from "../../models/notifications/notifications";
import StatusCodes from "http-status-codes";

class NotificationController {
  // Get all notifications

  async getAllNotifications(req, res) {
    try {
      const { _page = 1, _limit = 10, _filter = "all" } = req.query;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
      };
      let notificationtQuery = Notification.find();
      if (_filter === "unread") {
        notificationtQuery = notificationtQuery.where({ isRead: false });
      }
      notificationtQuery = notificationtQuery.sort({ createdAt: -1 });

      const result = await Notification.paginate(notificationtQuery, options);
      const { docs, ...paginationData } = result;

      return res.status(StatusCodes.OK).json({
        notifications: docs,
        ...paginationData,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // creat notification
  async createNotification(req, res) {
    try {
      const newNotification = await Notification.create(req.body);
      res.status(StatusCodes.CREATED).json(newNotification);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
  // readed notifications
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Thông báo không tồn tại" });
      }

      res.status(StatusCodes.OK).json(notification);
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}

export default NotificationController;
