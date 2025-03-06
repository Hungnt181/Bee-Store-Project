import Order from "../../models/orders/Order";
import StatusCodes from "http-status-codes";

import ItemsOrder from "../../models/itemOrder/itemOrder"; //bang itemOrder
import { orderValidator } from "../../utils/validator/order";
class OrderController {
  async createOrder(req, res) {
    try {
      const { error } = orderValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: error.message });
      }
      const { orderItemsOrder } = req.body;

      // Kiểm tra so item order
      const itemsOrders = await ItemsOrder.find({
        _id: { $in: orderItemsOrder },
      });
      if (itemsOrders.length !== itemsOrders.length) {
        return res
          .status(400)
          .json({ message: "Một hoặc nhiều itemOrder không tìm thấy" });
      }
      // có thể ko cần thiết check phần này

      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const { _embed } = req.query;
      let query = Order.findById(id);

      if (_embed) {
        const embeds = _embed.split(",");
        // Nếu itemsOrder được yêu cầu, hãy populate nó kèm nested populate cho id_variant
        if (embeds.includes("itemsOrder")) {
          query = query.populate({
            path: "itemsOrder",
            populate: {
              path: "id_variant",
              populate: [
                { path: "id_color" },
                { path: "id_size" },
                { path: "id_product" },
              ],
            },
            options: { sort: { name: 1 } },
          });
        }
        // Populate các trường khác (tránh populate id_variant riêng lẻ)
        embeds.forEach((embed) => {
          if (embed !== "itemsOrder" && embed !== "id_variant") {
            query = query.populate(embed);
          }
        });
      }

      const order = await query.exec();
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy order" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOrders(req, res) {
    try {
      const { _page = 1, _limit = 10, _embed, status = "" } = req.query;
      const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
        sort: { createdAt: -1 },
      };

      const decodedStatus = decodeURIComponent(status);

      let optionStatus = {};

      if (status) {
        optionStatus.status = decodedStatus;
      }

      let query = Order.find(optionStatus);

      if (_embed) {
        const embeds = _embed.split(",");
        embeds.forEach((embed) => {
          query = query.populate(embed);
        });
      }

      const result = await Order.paginate(query, options);
      const { docs, ...paginationData } = result; // Loại bỏ trường docs

      return res.status(200).json({
        orders: docs,
        ...paginationData,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Update trạng thái đơn hàng :"Chưa xác nhận", "Đã xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"
  // Các trạng thái hợp lệ
  async updateStatusByAdmin(req, res) {
    try {
      const validTransitions = {
        "Chưa xác nhận": ["Đã xác nhận", "Đã hủy"],
        "Đã xác nhận": ["Đang giao", "Đã hủy"],
        "Đang giao": ["Hoàn thành"],
        "Hoàn thành": ["Đã hủy"],
        "Đã hủy": [],
      };

      const { status } = req.body;
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
      }

      // Kiểm tra trạng thái hợp lệ
      if (!validTransitions[order.status].includes(status)) {
        return res.status(400).json({
          message: `Không thể chuyển từ trạng thái "${order.status}" sang "${status}"!`,
        });
      }

      // Cập nhật trạng thái
      order.status = status;
      // Đỏi trạng thái isPaid
      if (status === "Hoàn thành") {
        order.isPaid = true;
        order.completedAt = new Date(); // Lưu thời gian hoàn thành
        console.log(order.completedAt);
      }
      await order.save();

      return res.status(StatusCodes.OK).json({
        message: "Cập nhật trạng thái đươn hàng thành công",
        data: order,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  // Update trạng thái đơn hàng :"Chưa xác nhận", "Hoàn thành", "Đã hủy"
  // Các trạng thái hợp lệ
  async updateStatusByClient(req, res) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!status) {
        return res
          .status(400)
          .json({ message: "Trạng thái không được để trống!" });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
      }

      // Chỉ cho phép khách hàng cập nhật theo quy tắc
      if (order.status === "Chưa xác nhận" && status === "Đã hủy") {
        order.status = "Đã hủy";
      } else if (order.status === "Hoàn thành" && status === "Hoàn đơn") {
        if (!order.isConfirm) {
          return res
            .status(400)
            .json({ message: "Bạn chưa được phép hoàn đơn!" });
        }
        order.status = "Hoàn đơn";
      } else {
        return res.status(400).json({
          message: `Bạn không thể chuyển từ trạng thái "${order.status}" sang "${status}"!`,
        });
      }

      await order.save();

      return res.status(200).json({
        message: "Cập nhật trạng thái đơn hàng thành công",
        data: order,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
export default OrderController;
