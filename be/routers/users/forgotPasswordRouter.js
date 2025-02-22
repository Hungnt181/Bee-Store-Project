import { Router } from 'express';
import User from '../../models/users/user';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({
            'message': 'Email không tồn tại'
        });
    }

    // Tạo token và thời gian hết hạn
    const resetToken = user._id; // Sử dụng user ID làm token (có thể thay bằng token ngẫu nhiên)
    const resetTokenExpiry = Date.now() + 3600000; // Token có hiệu lực trong 1 giờ

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Cấu hình nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'thinh07122002@gmail.com',
            pass: 'jzrx aimw jdki cxqj'
        }
    });

    const mailOptions = {
        from: 'Bee-Store',
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <h2>Xin chào ${user.name},</h2>
                <p>Vui lòng đặt lại mật khẩu của bạn bằng cách nhấp vào nút dưới đây:</p>
                <a href="http://${req.headers.host}/api/reset-password?token=${resetToken}" style="text-decoration: none;">
                    <button style="padding: 10px 20px; color: black; background-color: yellow; border-radius: 5px;">
                        Đặt Lại Mật Khẩu
                    </button>
                </a>
                <p>Cảm ơn bạn!</p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({
                'message': 'Lỗi khi gửi email'
            });
        }
        res.status(200).json({
            'message': 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.'
        });
    });
});

export default router;
