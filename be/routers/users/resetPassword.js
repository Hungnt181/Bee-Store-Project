// import { Router } from "express";
// import User from "../../models/users/user";
// import bcryptjs from "bcryptjs"; // Thêm bcryptjs để hash mật khẩu

// const router = Router();

// router.put("/:id", async (req, res) => {
//   const { password, confirmPassword } = req.body;
//   const { id } = req.params;

//   if (!password || !confirmPassword) {
//     return res.status(400).json({
//       message: "Mật khẩu mới và xác nhận mật khẩu là bắt buộc",
//     });
//   }

//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
//   }

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "Người dùng không tồn tại" });
//     }

//     // ✅ Hash mật khẩu trước khi lưu
//     const salt = await bcryptjs.genSalt(10);
//     user.password = await bcryptjs.hash(password, salt);

//     // ✅ Xóa resetPasswordToken sau khi đặt lại mật khẩu
//     user.resetPasswordToken = undefined;

//     await user.save();

//     return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
//   } catch (error) {
//     console.error("Lỗi đặt lại mật khẩu:", error);
//     return res
//       .status(500)
//       .json({ message: "Có lỗi xảy ra khi đặt lại mật khẩu" });
//   }
// });

// export default router;
