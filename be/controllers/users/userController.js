import User from "../../models/users/user";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes';
import { authValidator, signInValidator, signUpAdminValidator, signUpUserValidator, signUpValidator, updateAdminValidator } from "../../utils/validator/user.js";

class UserController {
    async listUserAccount(req, res) {
        try {
            const users = await User.find({ role: 'user' });
            res.status(200).json({
                'message': 'Danh sách tài khoản người dùng',
                'data': users
            });
        } catch (error) {
            res.status(500).json({
                'message': 'Lỗi khi lấy danh sách tài khoản người dùng',
                'error': error.message
            });
        }
    }
    async listAdminAccount(req, res) {
        try {
            const users = await User.find({ role: 'admin' });
            res.status(200).json({
                'message': 'Danh sách tài khoản admin',
                'data': users
            });
        } catch (error) {
            res.status(500).json({
                'message': 'Lỗi khi lấy danh sách tài khoản admin',
                'error': error.message
            });
        }
    }
    async getOneUserAccount(req, res) {
        try {
            const { id } = req.params; // Lấy ID từ tham số URL
            const user = await User.findOne({ _id: id, role: 'user' }); // Tìm kiếm admin với ID và vai trò

            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    'message': 'Không tìm thấy tài khoản user'
                });
            }

            res.status(StatusCodes.OK).json({
                'message': 'Thông tin tài khoản user',
                'data': user
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                'message': 'Lỗi khi lấy thông tin tài khoản user',
                'error': error.message
            });
        }
    }
    async getOneAdminAccount(req, res) {
        try {
            const { id } = req.params; // Lấy ID từ tham số URL
            const user = await User.findOne({ _id: id, role: 'admin' }).select('+password'); // Tìm kiếm admin với ID và vai trò, bao gồm cả password

            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    'message': 'Không tìm thấy tài khoản admin'
                });
            }

            res.status(StatusCodes.OK).json({
                'message': 'Thông tin tài khoản admin',
                'data': user
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                'message': 'Lỗi khi lấy thông tin tài khoản admin',
                'error': error.message
            });
        }
    }
    async updateStatusAdminAccount(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Không tìm thấy tài khoản admin",
                });
            }
            if (user.role !== 'admin') {
                return res.status(StatusCodes.FORBIDDEN).json({
                    message: "Chỉ có thể cập nhật trạng thái tài khoản admin",
                });
            }

            user.status = !user.status;
            await user.save();

            return res.status(StatusCodes.OK).json({
                message: "Cập nhật trạng thái tài khoản admin thành công",
                data: user,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
            });
        }
    }

    async updateStatusUserAccount(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "Không tìm thấy tài khoản người dùng",
                });
            }

            // Không cần kiểm tra vai trò của người dùng
            user.status = !user.status;
            await user.save();

            return res.status(StatusCodes.OK).json({
                message: "Cập nhật trạng thái tài khoản người dùng thành công",
                data: user,
            });
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
            });
        }
    }
    async updateUserAccount(req, res) {
        try {
            const { error } = signUpUserValidator.validate(req.body, { abortEarly: false });
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
        } catch (error) {
            res.status(500).json({
                'message': 'Lỗi khi cập nhật tài khoản người dùng',
                'error': error.message
            });
        }
    }
    async updateAdminAccount(req, res) {
        try {
            const { error } = updateAdminValidator.validate(req.body, { abortEarly: false });
            if (error) { // nếu có lỗi validate -> bắn ra lỗi
                const listErrors = error.details.map((item) => item.message);
                return res.status(StatusCodes.BAD_REQUEST).json({
                    'message': listErrors
                });
            }

            const { password, ...updateData } = req.body;

            // Lấy thông tin tài khoản admin hiện có
            const existingAdmin = await User.findById(req.params.id);
            if (!existingAdmin) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    'message': 'Không tìm thấy tài khoản admin'
                });
            }

            // Kiểm tra xem mật khẩu có thay đổi không
            if (password && password !== existingAdmin.password) {
                updateData.password = await bcryptjs.hash(password, 10);
            } else {
                delete updateData.password; // Xóa trường password khỏi updateData nếu mật khẩu không thay đổi
            }

            const updatedAdmin = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!updatedAdmin) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    'message': 'Không tìm thấy tài khoản admin'
                });
            }

            res.status(StatusCodes.OK).json({
                'message': 'Cập nhật thành công',
                'data': updatedAdmin
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                'message': 'Lỗi khi cập nhật tài khoản admin',
                'error': error.message
            });
        }
    }
    async signupAdmin(req, res) {
        const { error } = signUpAdminValidator.validate(req.body, { abortEarly: false });
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
            tel,
            role: 'admin'
        })

        res.status(200).json({
            'message': 'Dang ky tai khoan admin thanh cong',
            'data': user
        })
    }
    async signupUser(req, res) {
        const { error } = signUpUserValidator.validate(req.body, { abortEarly: false });
        if (error) { //nếu có lỗi validate -> bắn ra lỗi
            const listErrors = error.details.map((item) => item.message);
            return res.status(400).json({
                'message': listErrors
            })
        }
        const { name, email, password, confirmPassword, tel } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({
                'message': 'Mật khẩu không khớp'
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
            tel,
            role: 'user'
        })

        res.status(200).json({
            'message': 'Dang ky tai khoan user thanh cong',
            'data': user
        })
    }
    async signin(req, res) {
        const { error } = signInValidator.validate(req.body, { abortEarly: false });
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

        if (!user.status) {
            return res.status(400).json({
                'message': 'Tài khoản đã ngừng hoạt động'
            })
        }

        const token = jwt.sign(
            { email: user.email, role: user.role },
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