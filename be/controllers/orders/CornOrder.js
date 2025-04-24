import cron from "node-cron";
import Order from "../../models/orders/Order";
import Voucher from "../../models/vouchers/Voucher";
import Variant from "../../models/variants/variants";
// Chạy mỗi phút để kiểm tra (chỉ để test, sau đó đổi lại)
cron.schedule("*/1 * * * *", async () => {
  console.log("🔄 [TEST] Đang kiểm tra đơn hàng...");

  const oneMinuteAgo = new Date();
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1); // Lấy thời gian 1 phút trước

  try {
    const result = await Order.updateMany(
      {
        status: "Hoàn thành",
        completedAt: { $lte: oneMinuteAgo },
        isConfirm: false,
      },
      { $set: { isConfirm: true } }
    );

    if (result.modifiedCount > 0) {
      console.log(` [TEST] Đã cập nhật ${result.modifiedCount} đơn hàng.`);
    } else {
      console.log(" [TEST] Không có đơn hàng nào cần cập nhật.");
    }
  } catch (error) {
    console.error(" [TEST] Lỗi khi chạy cron job:", error);
  }
});

// Cron 2: Tự huỷ đơn chưa thanh toán sau 3 phút
cron.schedule("*/1 * * * *", async () => {
  const cutoff = new Date(Date.now() - 1 * 60 * 1000); // 3 phút trước
  try {
    const expiredOrders = await Order.find({
      isPaid: false,
      payment: "67bfcec4db17315614fced70",
      status: "Chưa xác nhận",
      createdAt: { $lte: cutoff },
    }).populate({
      path: "itemsOrder",
      populate: { path: "id_variant" },
    });
    for (const order of expiredOrders) {
      order.status = "Đã hủy";
      order.cancel_reason =
        "Đơn hàng đã huỷ tự động do quá thời gian thanh toán";
      await order.save();

      // Cộng lại số lượng sản phẩm
      for (const item of order.itemsOrder) {
        await Variant.findByIdAndUpdate(item.id_variant, {
          $inc: { quantity: +item.quantity },
        });
      }

      // Cộng lại voucher nếu có
      if (order.voucher) {
        await Voucher.findByIdAndUpdate(order.voucher, {
          $inc: { quantity: +1 },
        });
      }
      console.log(`⛔️ Đã huỷ đơn ${order._id} vì quá hạn.`);
    }
    if (expiredOrders.length === 0) {
      console.log("✅ Không có đơn quá hạn.");
    }
  } catch (error) {
    console.error("❌ Lỗi khi huỷ đơn:", error);
  }
});
