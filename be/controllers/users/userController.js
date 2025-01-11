import User from "../../models/users/user";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authValidator } from "../../utils/validator/user.js";

class UserController {
    async listUser(req, res) {
        const users = await User.find()
        res.status(200).json({
            'message': 'Danh sach tai khoan',
            'data': users
        })
    }
    async updateUser(req, res) {
        const { error } = authValidator.validate(req.body, { abortEarly: false });
        if (error) { //nếu có lỗi validate -> bắn ra lỗi
            const listErrors = error.details.map((item) => item.message);
            return res.status(400).json({
                'message': listErrors
            })
        }
        const { password, ...updateData } = req.body;
        if (password) {
            updateData.password = await bcryptjs.hash(password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({
            'message': 'Cập nhật thành công',
            'data': updatedUser
        });
    }
    async signup(req, res) {
        const { error } = authValidator.validate(req.body, { abortEarly: false });
        if (error) { //nếu có lỗi validate -> bắn ra lỗi
            const listErrors = error.details.map((item) => item.message);
            return res.status(400).json({
                'message': listErrors
            })
        }
        const { name, email, password, confirmPassword, tel } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({
                'message': 'Xác nhận mật khẩu không khớp'
            });
        }

        const existedEmail = await User.findOne({ email })

        if (existedEmail) {
            return res.status(200).json({
                'message': 'Email da ton tai'
            })
        }

        const hashedPass = await bcryptjs.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            tel
        })

        res.status(200).json({
            'message': 'Dang ky thanh cong',
            'data': user
        })
    }
    async signin(req, res) {
        const { error } = authValidator.validate(req.body, { abortEarly: false });
        if (error) { //nếu có lỗi validate -> bắn ra lỗi
            const listErrors = error.details.map((item) => item.message);
            return res.status(400).json({
                'message': listErrors
            })
        }
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                'message': 'Email khong ton tai'
            })
        }

        const checkPass = await bcryptjs.compare(password, user.password)

        if (!checkPass) {
            return res.status(400).json({
                'message': 'Password khong dung'
            })
        }

        const token = jwt.sign(
            { email: user.email },
            '123456',
            { expiresIn: '1d' }
        )

        res.status(200).json({
            'message': 'Dang nhap thanh cong',
            'data': user,
            token
        })
    }
}

export default UserController