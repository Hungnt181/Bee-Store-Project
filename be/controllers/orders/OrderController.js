import Order from "../../models/orders/Order";
import StatusCodes from "http-status-codes";

import ItemsOrder from "../../models/itemOrder/itemOrder"; //bang itemOrder
import { orderValidator } from "../../utils/validator/order";
import Variant from "../../models/variants/variants";
import Voucher from "../../models/vouchers/Voucher";
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
      // Kiểm tra tồn kho của biến thể trong itemOrder
      // console.log("req.body", req.body.itemsOrder);
      for (let item of req.body.itemsOrder) {
        const itemOrder = await ItemsOrder.findById(item);
        // console.log("itemOrder", itemOrder);
        const variantQuantity = await Variant.findById(
          itemOrder.id_variant
        ).populate({
          path: "id_color id_size",
        });
        console.log("variantQuantity", variantQuantity);
        //Kiểm tra trạng thái
        if (variantQuantity.status === false) {
          // console.log("Biến thể đã bị ẩn");
          return res.status(400).json({
            message:
              "Biến thể đã bị ẩn tại sản phẩm: " +
              itemOrder.name +
              " - " +
              "Màu: " +
              variantQuantity.id_color.name +
              " - " +
              "Kích cỡ: " +
              variantQuantity.id_size.name,
          });
        }
        //Kiểm tra tồn kho
        if (itemOrder.quantity > variantQuantity.quantity) {
          console.log("Số lượng đặt hàng vượt quá số lượng tồn kho");
          return res.status(400).json({
            message:
              "Số lượng đặt hàng vượt quá số lượng tồn kho tại sản phẩm: " +
              itemOrder.name +
              " - " +
              "Màu: " +
              variantQuantity.id_color.name +
              " - " +
              "Kích cỡ: " +
              variantQuantity.id_size.name,
          });
        }
      }

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

      //  Nếu không quá số lượng tồn kho, tạo order
      const order = await Order.create(req.body);

      // Cập nhật số lượng tồn kho của biến thể
      for (let item of req.body.itemsOrder) {
        const itemOrder = await ItemsOrder.findById(item);
        // console.log("itemOrder", itemOrder);
        const variantQuantity = await Variant.findById(itemOrder.id_variant);
        // console.log("variantQuantity", variantQuantity);
        await Variant.findByIdAndUpdate(itemOrder.id_variant, {
          $inc: { quantity: -itemOrder.quantity },
        });
      }

      // Cập nhật lại số lượng voucher nếu có
      // console.log("voucher", req.body.voucher);
      if (req.body.voucher) {
        await Voucher.findByIdAndUpdate(req.body.voucher, {
          $inc: { quantity: -1 },
        });
      }

      res.status(201).json({
        ok: true,
        data: order,
      });
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

  // Get order by Id_User
  async getOrdersByUser(req, res) {
    try {
      const { id_user } = req.params;
      const { _embed } = req.query;
      const options = {
        page: parseInt(req.query._page, 10) || 1,
        limit: parseInt(req.query._limit, 10) || 10,
        sort: { createdAt: -1 }, // Sắp xếp giảm dần theo ngày tạo
        populate: [],
      };

      if (_embed) {
        const embeds = _embed.split(",");
        if (embeds.includes("itemsOrder")) {
          options.populate.push({
            path: "itemsOrder",
            populate: [
              {
                path: "id_variant",
                populate: ["id_color", "id_size", "id_product"],
              },
            ],
          });
        }
        embeds.forEach((embed) => {
          if (embed !== "itemsOrder" && embed !== "id_variant") {
            options.populate.push(embed);
          }
        });
      }

      // Gọi paginate
      const result = await Order.paginate({ user: id_user }, options);
      const { docs: orders, ...paginationData } = result;

      if (!orders.length) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }

      return res.status(200).json({ orders, ...paginationData });
    } catch (error) {
      res.status(500).json({ message: error.message });
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

      const { status, updatedStatusByAdmin } = req.body;
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
      order.updatedStatusByAdmin = updatedStatusByAdmin || "Admin"; // Lưu tên người cập nhật
      // Đỏi trạng thái isPaid
      if (status === "Hoàn thành") {
        order.isPaid = true;
        order.completedAt = new Date(); // Lưu thời gian hoàn thành
        // console.log(order.completedAt);
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
  async updateStatusByClient(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
      }

      // Tính thời gian 3 phút trước
      const threeMinutesAgo = new Date();
      threeMinutesAgo.setMinutes(threeMinutesAgo.getMinutes() - 3);

      // Nếu đơn hàng đã hoàn thành hơn 3 phút trước, không thể hủy
      if (
        order.status === "Hoàn thành" &&
        order.completedAt <= threeMinutesAgo
      ) {
        return res.status(400).json({
          message:
            "Bạn không thể hoàn đơn hàng đã hoàn thành hơn 3 phút trước! ",
        });
      }

      // Chỉ cho phép khách hàng cập nhật theo quy tắc
      if (order.status === "Chưa xác nhận" || order.status === "Đã xác nhận") {
        order.status = "Đã hủy";
      } else if (order.status === "Hoàn thành" && order.isConfirm) {
        order.status = "Đã hủy";
      } else {
        return res.status(400).json({
          message: `Bạn không thể cập nhật trạng thái khi chưa xác nhận đơn hàng!`,
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
  // Các trạng thái hợp lệ
  async updateIsConnfirmByClient(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
      }

      // Chỉ cho phép khách hàng cập nhật theo quy tắc
      if (order.status === "Hoàn thành" && !order.isConfirm) {
        order.isConfirm = true;
        await order.save();
        return res.status(200).json({
          message: "Cập nhật trạng thái đơn hàng thành công",
          data: order,
        });
      } else {
        return res.status(400).json({
          message: `Bạn không thể chuyển từ trạng thái đã nhận hàng"!`,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Thống kê doanh thu của SHOP

  async getRevenueStatisticsasync(req, res) {
    try {
      const { type, date, month, year, from, to } = req.query;
      let match = {};

      let start, end;
      if (type === "daily") {
        start = new Date(date);
        end = new Date(date);
        end.setDate(end.getDate() + 1);
      } else if (type === "monthly") {
        start = new Date(`${month}-01`);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
      } else if (type === "yearly") {
        start = new Date(`${year}-01-01`);
        end = new Date(`${year}-12-31`);
        end.setDate(end.getDate() + 1);
      } else if (type === "range") {
        start = new Date(from);
        end = new Date(to);
        end.setDate(end.getDate() + 1);
      }

      match.createdAt = { $gte: start, $lt: end };

      // Nhóm theo type
      let groupFormat = "%Y-%m-%d";
      if (type === "monthly") {
        groupFormat = "%Y-%m-%d";
      } else if (type === "yearly") {
        groupFormat = "%Y-%m";
      } else if (type === "range") {
        groupFormat = "%Y-%m-%d";
      }

      const data = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
            totalRevenue: { $sum: "$total" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.json(data); // Trả về danh sách để vẽ biểu đồ
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Thống kê sản phẩm bán chạy nhất
  async getBestSellingProducts(req, res) {
    try {
      const { type2, date, month, year, from, to, limit = 5 } = req.query;
      let match = {};

      let start, end;

      // Xử lý thời gian lọc
      if (type2 === "daily") {
        if (!date)
          return res.status(400).json({ message: "Missing 'date' param" });
        start = new Date(date);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
      } else if (type2 === "monthly") {
        if (!month)
          return res.status(400).json({ message: "Missing 'month' param" });
        start = new Date(`${month}-01`);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
      } else if (type2 === "yearly") {
        if (!year)
          return res.status(400).json({ message: "Missing 'year' param" });
        start = new Date(`${year}-01-01`);
        end = new Date(`${year}-01-01`);
        end.setFullYear(end.getFullYear() + 1);
      } else if (type2 === "range2") {
        if (!from || !to)
          return res
            .status(400)
            .json({ message: "Missing 'from' or 'to' param" });
        start = new Date(from);
        end = new Date(to);
        end.setDate(end.getDate() + 1);
      } else {
        return res.status(400).json({ message: "Invalid 'type' param" });
      }

      match.createdAt = { $gte: start, $lt: end };

      const data = await Order.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "itemorders",
            localField: "itemsOrder",
            foreignField: "_id",
            as: "itemsOrderData",
          },
        },
        { $unwind: "$itemsOrderData" },
        {
          $group: {
            _id: "$itemsOrderData.id_variant",
            totalSold: { $sum: "$itemsOrderData.quantity" },
          },
        },
        {
          $lookup: {
            from: "variants",
            localField: "_id",
            foreignField: "_id",
            as: "variantInfo",
          },
        },
        { $unwind: "$variantInfo" },

        //  JOIN Color
        {
          $lookup: {
            from: "colors",
            localField: "variantInfo.id_color",
            foreignField: "_id",
            as: "colorInfo",
          },
        },
        { $unwind: { path: "$colorInfo", preserveNullAndEmptyArrays: true } },

        //  JOIN Size
        {
          $lookup: {
            from: "sizes",
            localField: "variantInfo.id_size",
            foreignField: "_id",
            as: "sizeInfo",
          },
        },
        { $unwind: { path: "$sizeInfo", preserveNullAndEmptyArrays: true } },

        //  JOIN Product
        {
          $lookup: {
            from: "products",
            localField: "variantInfo.id_product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },

        { $sort: { totalSold: -1 } },
        { $limit: parseInt(limit) },

        // Chỉ lấy các field cần thiết
        {
          $project: {
            _id: 0,
            variantId: "$_id",
            totalSold: 1,
            variantImage: "$variantInfo.image",
            colorName: "$colorInfo.name",
            sizeName: "$sizeInfo.name",
            productName: "$productInfo.name",
            productID: "$productInfo._id",
            productPrice: "$productInfo.price",
            status: "$productInfo.status",
            slug: "$productInfo.slug",
          },
        },
      ]);

      res.json(data);
    } catch (err) {
      console.error("getBestSellingProducts error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
}
export default OrderController;
