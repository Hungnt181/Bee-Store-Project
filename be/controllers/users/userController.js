import User from "../../models/users/user";
import bcrypt from "bcryptjs";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import {
  authValidator,
  signInValidator,
  signUpAdminValidator,
  signUpUserValidator,
  signUpValidator,
  updateAdminValidator,
  updatePasswordUser,
  updateUserValidator,
} from "../../utils/validator/user.js";
import emailExistence from "email-existence";
import { jwtDecode } from "jwt-decode";

class UserController {
  async listUserAccount(req, res) {
    try {
      const users = await User.find({ role: "user" });
      res.status(200).json({
        message: "Danh sách tài khoản người dùng",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách tài khoản người dùng",
        error: error.message,
      });
    }
  }
  async listAdminAccount(req, res) {
    try {
      const users = await User.find({ role: "admin" });
      res.status(200).json({
        message: "Danh sách tài khoản admin",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy danh sách tài khoản admin",
        error: error.message,
      });
    }
  }
  async getOneUserAccount(req, res) {
    try {
      const { id } = req.params; // Lấy ID từ tham số URL
      const user = await User.findOne({ _id: id, role: "user" }); // Tìm kiếm admin với ID và vai trò

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy tài khoản user",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Thông tin tài khoản user",
        data: user,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi khi lấy thông tin tài khoản user",
        error: error.message,
      });
    }
  }
  async getOneAdminAccount(req, res) {
    try {
      const { id } = req.params; // Lấy ID từ tham số URL
      const user = await User.findOne({ _id: id, role: "admin" }).select(
        "+password"
      ); // Tìm kiếm admin với ID và vai trò, bao gồm cả password

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy tài khoản admin",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Thông tin tài khoản admin",
        data: user,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi khi lấy thông tin tài khoản admin",
        error: error.message,
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
      if (user.role !== "admin") {
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
      const { error } = updateUserValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        //nếu có lỗi validate -> bắn ra lỗi
        const listErrors = error.details.map((item) => item.message);
        return res.status(400).json({
          message: listErrors,
        });
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        message: "Cập nhật thành công",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật tài khoản người dùng",
        error: error.message,
      });
    }
  }
  async updatePasswordUser(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          message: '"oldPassword" và "newPassword" là bắt buộc',
        });
      }

      const user = await User.findById(req.params.id).select("+password");
      if (!user) {
        return res.status(404).json({
          message: "Người dùng không tồn tại",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Mật khẩu hiện tại không đúng",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        message: "Đổi mật khẩu thành công!",
      });
    } catch (error) {
      console.error("Password update error:", error);
      return res.status(500).json({
        message: "Lỗi khi đổi mật khẩu",
        error: error.message,
      });
    }
  }

  async updateAdminAccount(req, res) {
    try {
      const { error } = updateAdminValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        // nếu có lỗi validate -> bắn ra lỗi
        const listErrors = error.details.map((item) => item.message);
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: listErrors,
        });
      }

      const { password, ...updateData } = req.body;

      // Lấy thông tin tài khoản admin hiện có
      const existingAdmin = await User.findById(req.params.id);
      if (!existingAdmin) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy tài khoản admin",
        });
      }

      // Kiểm tra xem mật khẩu có thay đổi không
      if (password && password !== existingAdmin.password) {
        updateData.password = await bcryptjs.hash(password, 10);
      } else {
        delete updateData.password; // Xóa trường password khỏi updateData nếu mật khẩu không thay đổi
      }

      const updatedAdmin = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedAdmin) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Không tìm thấy tài khoản admin",
        });
      }

      res.status(StatusCodes.OK).json({
        message: "Cập nhật thành công",
        data: updatedAdmin,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Lỗi khi cập nhật tài khoản admin",
        error: error.message,
      });
    }
  }
  async signUpAdmin(req, res) {
    const { error } = signUpAdminValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      //nếu có lỗi validate -> bắn ra lỗi
      const listErrors = error.details.map((item) => item.message);
      return res.status(400).json({
        message: listErrors,
      });
    }
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu không khớp",
      });
    }

    const existedEmail = await User.findOne({ email });

    if (existedEmail) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    emailExistence.check(email, async (error, response) => {
      if (error || !response) {
        return res.status(400).json({
          message: "Email không tồn tại",
        });
      }

      const hashedPass = await bcryptjs.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPass,
        role: "admin",
      });

      // Cấu hình nodemailer
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "beestore1802@gmail.com",
          pass: "jqst iupd chwk tnsx",
        },
      });

      const mailOptions = {
        from: "Bee-Store",
        to: email,
        subject: "BeeStore - Xác nhận tài khoản admin",
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
                `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({
            message: "Lỗi khi gửi email",
          });
        }
        res.status(200).json({
          message:
            "Đăng ký tài khoản admin thành công. Vui lòng kiểm tra email của bạn để xác nhận tài khoản.",
          data: user,
        });
      });
    });
  }

  async signupUser(req, res) {
    try {
      const { error } = signUpUserValidator.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const listErrors = error.details.map((item) => item.message);
        return res.status(400).json({ message: listErrors });
      }

      const { name, email, password, confirmPassword, tel } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Mật khẩu không khớp" });
      }

      const existedEmail = await User.findOne({ email });
      if (existedEmail) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      // ✅ Wrap emailExistence check with better logic
      const emailIsValid = await new Promise((resolve, reject) => {
        emailExistence.check(email, (error, response) => {
          if (error || !response) return reject("Email không tồn tại");
          resolve(true);
        });
      });

      const hashedPass = await bcryptjs.hash(password, 12);

      const user = await User.create({
        name,
        email,
        password: hashedPass,
        tel,
        role: "user",
        isVerified: false,
      });

      // ✅ You should store the token for verification
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Optionally save token in DB or map user ID for future reference
      // You could store it temporarily with expiry (e.g. in Redis or DB)
      // For now, we'll just use user._id as token in the URL

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USERNAME || "beestore1802@gmail.com",
          pass: process.env.EMAIL_PASSWORD || "jqst iupd chwk tnsx", // 🔒 Ideally stored in .env
        },
      });

      const mailOptions = {
        from: "Bee-Store <beestore1802@gmail.com>",
        to: email,
        subject: "BeeStore - Xác nhận tài khoản khách hàng",
        html: `
          <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
              <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
              <p style="font-size: 16px; color: #333;">Chào mừng bạn đến với BeeStore!</p>
              <p style="color: #333;">Để kích hoạt tài khoản của bạn, vui lòng nhấn vào nút bên dưới:</p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="http://${req.headers.host}/api/verify-email?token=${user._id}" 
                  style="padding: 10px 20px; background-color: yellow; color: black; 
                  border: none; border-radius: 4px; text-decoration: none; font-weight: bold;">
                  Kích hoạt tài khoản
                </a>
              </div>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Đăng ký thành công. Vui lòng kiểm tra email.",
        data: {
          userId: user._id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
      res
        .status(500)
        .json({ message: "Email không tồn tại. Vui lòng kiểm tra lại." });
    }
  }

  async signinAdmin(req, res) {
    const { error } = signInValidator.validate(req.body, { abortEarly: false });
    if (error) {
      //nếu có lỗi validate -> bắn ra lỗi
      const listErrors = error.details.map((item) => item.message);
      return res.status(400).json({
        message: listErrors,
      });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email khong ton tai",
      });
    }

    const checkPass = await bcryptjs.compare(password, user.password);

    if (!checkPass) {
      return res.status(400).json({
        message: "Password khong dung",
      });
    }

    if (!user.status) {
      return res.status(400).json({
        message: "Tài khoản đã ngừng hoạt động",
      });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, "123456", {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Dang nhap thanh cong",
      data: user,
      token,
    });
  }

  async loginGoogle(req, res) {
    try {
      const { tokenGoogle } = req.body;

      if (!tokenGoogle) {
        return res.status(400).json({ message: "Token không được cung cấp" });
      }

      const dataUser = jwtDecode(tokenGoogle);
      // console.log("User data:", dataUser);

      // Kiểm tra xem email đã tồn tại trong database chưa
      const existedUser = await User.findOne({ email: dataUser.email });

      let user;

      if (!existedUser) {
        // Nếu email chưa tồn tại, tạo user mới

        const randomPassword = Math.random().toString(36).slice(-10);
        const hashedPass = await bcryptjs.hash(randomPassword, 10);

        user = await User.create({
          name: dataUser.name,
          email: dataUser.email,
          password: hashedPass,
          role: "user",
          isVerified: true,
          status: true,
        });

        // console.log("Đã tạo user mới:", user);
      } else {
        // Nếu email đã tồn tại, sử dụng thông tin user đã có
        user = existedUser;
        // console.log("User đã tồn tại:", user);
      }

      if (!user.status) {
        return res.status(400).json({
          message: "Tài khoản đã ngừng hoạt động",
        });
      }

      // Tạo JWT token để đăng nhập
      // const token = jwt.sign(
      //     { id: user._id, role: user.role },
      //     process.env.JWT_SECRET || "mysecret",
      //     { expiresIn: "1d" }
      // );

      // Trả về phản hồi với thông tin user và token
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tel: user.tel,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("Login Google error:", error);
      return res.status(500).json({
        success: false,
        message: "Đăng nhập thất bại: " + error.message,
      });
    }
  }

  async signinUser(req, res) {
    try {
      const { error } = signInValidator.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const listErrors = error.details.map((item) => item.message);
        return res.status(400).json({ message: listErrors });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({ message: "Email không tồn tại" });
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Sai mật khẩu" });
      }

      if (!user.isVerified) {
        return res.status(400).json({
          message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra Email",
        });
      }

      if (user.status === false) {
        return res
          .status(400)
          .json({ message: "Tài khoản đã ngừng hoạt động" });
      }

      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "default_secret", // 🔒 Secure token secret
        { expiresIn: "1d" }
      );

      const { _id, name, tel, address, role: userRole } = user;

      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: { _id, name, email, tel, address, role: userRole },
        token,
      });
    } catch (err) {
      console.error("Signin error:", err);
      return res
        .status(500)
        .json({ message: "Đã xảy ra lỗi trong quá trình đăng nhập" });
    }
  }
}

export default UserController;
