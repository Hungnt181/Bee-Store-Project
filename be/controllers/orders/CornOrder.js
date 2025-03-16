import cron from "node-cron";
import Order from "../../models/orders/Order";
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
