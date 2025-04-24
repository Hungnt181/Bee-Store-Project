import { Router } from "express";
import { sendPasswordResetEmail } from "../../service/emailService";

const router = Router();

router.post("/", async (req, res) => {
  const { email } = req.body;

  const resetToken = await sendPasswordResetEmail(email);

  if (!resetToken) {
    return res.status(400).json({
      message: "Oops! Có vẻ bạn chưa có tài khoản. Vui lòng đăng ký để tiếp tục."
    });
  }

  res.status(200).json({
    message: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu."
  });
});

export default router;
