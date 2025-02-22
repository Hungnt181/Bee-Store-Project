import { Router } from 'express';
import User from '../../models/users/user';
import bcryptjs from 'bcryptjs';

const router = Router();

router.post('/', async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            'message': 'Mật khẩu không khớp'
        });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                'message': 'Token không hợp lệ hoặc đã hết hạn'
            });
        }

        const hashedPass = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPass;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.status(200).json({
            'message': 'Đặt lại mật khẩu thành công'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'message': 'Lỗi server'
        });
    }
});

export default router;
