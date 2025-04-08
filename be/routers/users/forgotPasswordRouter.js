import { Router } from "express";
import User from "../../models/users/user";
import nodemailer from "nodemailer";
import crypto from "crypto"

const router = Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message:
        "Oops! Có vẻ bạn chưa có tài khoản. Vui lòng đăng ký để tiếp tục.",
    });
  }

  // Tạo token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Lưu token và thời gian hết hạn (5 phút)
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  // Cấu hình nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "beestore1802@gmail.com",
      pass: "jqst iupd chwk tnsx",
    },
  });

  const mailOptions = {
    from: "BeeStore",
    to: email,
    subject: "BeeStore - Đặt lại mật khẩu",
    html: `
            <div style="
                font-family:'Segoe UI';
                margin: 0;
                padding: 0;
                width: max-content;
                height: max-content;
                background-color: #f4f4f4;">
            <div class="email" style="max-width: 700px;
                                margin: 20px auto;
                                background-color: #fff;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                overflow: hidden;">

            <div class="content" style="padding: 14px 20px 20px 20px; color: #242424;">
                <div style=" margin: 10px 0 16px 0; font-size: 26px; color: rgb(245, 245, 14); font-weight: bold;">
                    BEESTORE
                </div>

                <div style="font-size: 20px; color: black">
                    Thiết lập lại mật khẩu
                </div>

                <div style="margin-top: 20px; color: black">
                    Click vào nút dưới đây để thiết lập mật khẩu tài khoản của bạn tại BeeStore. 
                    Nếu bạn không có yêu cầu thay đổi mật khẩu, xin hãy xóa email này để bảo mật thông tin.
                </div>

                <div style="margin-top: 16px;;">
                    <button
                        style="padding: 8px 12px; background:yellow; border: 1px solid black;
                 border-radius: 4px; font-weight: 600; color: black; font-size: 16px;cursor: pointer; margin-left:43%;">
                        <a href="http://localhost:5173/reset/${resetToken}" style=" color: black; ">
                            Thiết lập mật khẩu
                        </a>
                    </button>
                </div>

            </div>
        </div>
    </div>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({
        message: "Lỗi khi gửi email",
      });
    }
    res.status(200).json({
      message: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
    });
  });
});

export default router;
