import User from "../../models/users/user";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes';
import nodemailer from 'nodemailer';
import { authValidator, signInValidator, signUpAdminValidator, signUpUserValidator, signUpValidator, updateAdminValidator, updatePasswordUser, updateUserValidator } from "../../utils/validator/user.js";
import emailExistence from 'email-existence';


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
            const { error } = updateUserValidator.validate(req.body, { abortEarly: false });
            if (error) { //nếu có lỗi validate -> bắn ra lỗi
                const listErrors = error.details.map((item) => item.message);
                return res.status(400).json({
                    'message': listErrors
                })
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    async updatePasswordUser(req, res) {
        try {
            const { error } = updatePasswordUser.validate(req.body, { abortEarly: false });
            if (error) { // nếu có lỗi validate -> bắn ra lỗi
                const listErrors = error.details.map((item) => item.message);
                return res.status(400).json({
                    'message': listErrors
                });
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
                'message': 'Lỗi khi cập nhật mật khẩu người dùng',
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
    async signUpAdmin(req, res) {
        const { error } = signUpAdminValidator.validate(req.body, { abortEarly: false });
        if (error) { //nếu có lỗi validate -> bắn ra lỗi
            const listErrors = error.details.map((item) => item.message);
            return res.status(400).json({
                'message': listErrors
            });
        }
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                'message': 'Mật khẩu không khớp'
            });
        }

        const existedEmail = await User.findOne({ email });

        if (existedEmail) {
            return res.status(400).json({
                'message': 'Email đã tồn tại'
            });
        }

        emailExistence.check(email, async (error, response) => {
            if (error || !response) {
                return res.status(400).json({
                    'message': 'Email không tồn tại'
                });
            }

            const hashedPass = await bcryptjs.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPass,
                role: 'admin',
            });

            // Cấu hình nodemailer
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'beestore1802@gmail.com',
                    pass: 'jqst iupd chwk tnsx'
                }
            });

            const mailOptions = {
                from: 'Bee-Store',
                to: email,
                subject: 'BeeStore - Xác nhận tài khoản admin',
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
                    Chào mừng bạn đến với BeeStore
                </div>

                <div style="margin-top: 20px; color: black">
                    Để kích hoạt tài khoản của mình, vui lòng click vào nút bên dưới.
                </div>

                <div style="margin-top: 16px;;">
                    <button
                        style="padding: 8px 12px; background:yellow; border: 1px solid black;
                 border-radius: 4px; font-weight: 600; color: black; font-size: 16px;cursor: pointer; margin-left:43%;">
                        <a href="http://${req.headers.host}/api/verify-email?token=${user._id}" style=" color: black; ">
                            Kích hoạt
                        </a>
                    </button>
                </div>

            </div>
        </div>
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
                    'message': 'Đăng ký tài khoản admin thành công. Vui lòng kiểm tra email của bạn để xác nhận tài khoản.',
                    'data': user
                });
            });
        });
    }


    async signupUser(req, res) {
        const { error } = signUpUserValidator.validate(req.body, { abortEarly: false });
        if (error) { //nếu có lỗi validate -> bắn ra lỗi
            const listErrors = error.details.map((item) => item.message);
            return res.status(400).json({
                'message': listErrors
            });
        }
        const { name, email, password, confirmPassword, tel } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                'message': 'Mật khẩu không khớp'
            });
        }

        const existedEmail = await User.findOne({ email });
        console.log(existedEmail)
        if (existedEmail) {
            return res.status(400).json({
                'message': 'Email đã tồn tại'
            });
        }

        emailExistence.check(email, async (error, response) => {
            if (error || !response) {
                return res.status(400).json({
                    'message': 'Email không tồn tại'
                });
            }

            const hashedPass = await bcryptjs.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPass,
                tel,
                role: 'user',
            });

            // Cấu hình nodemailer
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'beestore1802@gmail.com',
                    pass: 'jqst iupd chwk tnsx'
                }
            });

            const mailOptions = {
                from: 'Bee-Store',
                to: email,
                subject: 'BeeStore - Xác nhận tài khoản khách hàng',
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
                    Chào mừng bạn đến với BeeStore
                </div>

                <div style="margin-top: 20px; color: black">
                    Để kích hoạt tài khoản của mình, vui lòng click vào nút bên dưới.
                    Lần mua hàng tiếp theo, hãy đăng nhập để việc thanh toán thuận tiện hơn
                </div>

                <div style="margin-top: 16px;;">
                    <button
                        style="padding: 8px 12px; background:yellow; border: 1px solid black;
                 border-radius: 4px; font-weight: 600; color: black; font-size: 16px;cursor: pointer; margin-left:43%;">
                        <a href="http://${req.headers.host}/api/verify-email?token=${user._id}" style=" color: black; ">
                            Kích hoạt
                        </a>
                    </button>
                </div>

            </div>
        </div>
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
                    'message': 'Đăng ký tài khoản user thành công. Vui lòng kiểm tra email của bạn để xác nhận tài khoản.',
                    'data': user
                });
            });
        });
    }
    async signinAdmin(req, res) {
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

    async signinUser(req, res) {
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
                'message': 'Sai mật khẩu'
            })
        }

        if (!user.isVerified) {
            return res.status(400).json({
                'message': 'Tài khoản chưa được xác thực'
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
            'message': 'Đăng nhập thành công',
            'data': user,
            token
        })
    }
}

export default UserController