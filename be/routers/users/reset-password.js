// Tạo route mới: reset-password.js
import { Router } from "express";
import User from "../../models/users/user";
import bcryptjs from "bcryptjs";

const router = Router();

// Kiểm tra tính hợp lệ của token
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Kiểm tra thời gian hết hạn
    });

    if (!user) {
      return res.status(400).json({
        valid: false,
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
      });
    }

    res.status(200).json({
      valid: true,
      message: "Token hợp lệ"
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      message: "Có lỗi xảy ra, vui lòng thử lại"
    });
  }
});

// Reset mật khẩu
router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Tìm người dùng theo token và kiểm tra thời gian hết hạn
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Cập nhật mật khẩu và xóa token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Mật khẩu đã được cập nhật thành công"
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật mật khẩu",
      error: error.message
    });
  }
});

export default router;