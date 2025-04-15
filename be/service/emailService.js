// emailService.js
import nodemailer from "nodemailer";
import User from "../models/users/user";
import crypto from "crypto";

// Tạo transporter chung để tái sử dụng
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME || "beestore1802@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "jqst iupd chwk tnsx",
  },
});

/**
 * Gửi email xác nhận đơn hàng
 * @param {Object} order - Thông tin đơn hàng đã được populate
 */
export async function sendOrderConfirmationEmail(order) {
  try {
    // Lấy thông tin người nhận và email
    const receiverInfo = order.receiverInfo;
    let userEmail = receiverInfo.email;

    // Nếu đơn hàng có user ID, lấy email từ tài khoản user
    if (order.user) {
      const user = await User.findById(order.user);
      if (user && user.email) {
        userEmail = user.email;
      }
    }

    if (!userEmail) {
      console.error("Không tìm thấy email để gửi xác nhận đơn hàng");
      return;
    }

    // Tạo nội dung chi tiết sản phẩm
    const orderItems = order.itemsOrder.map(item => {
      const product = item.id_variant?.id_product?.name || item.name || 'Không xác định';
      const color = item.id_variant?.id_color?.name || '';
      const size = item.id_variant?.id_size?.name || '';

      // Lấy giá từ biến thể hoặc sử dụng giá mặc định
      const variantPrice = item.id_variant?.id_product?.price || 0;
      const quantity = item.quantity || 0;

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${product}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${color}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${size}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${variantPrice.toLocaleString('vi-VN')}đ</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${(variantPrice * quantity).toLocaleString('vi-VN')}đ</td>
        </tr>
      `;
    }).join('');

    // Tính toán giảm giá nếu có voucher
    let discountInfo = '';
    if (order.voucher && order.voucher.discount !== undefined) {
      discountInfo = `
        <tr>
          <td colspan="5" style="text-align: right; padding: 10px;"><strong>Giảm giá:</strong></td>
          <td style="padding: 10px;">${order.voucher.discount.toLocaleString('vi-VN')}đ</td>
        </tr>
      `;
    }

    // Đảm bảo có giá trị mặc định cho shipping fee và total
    const shippingFee = order.shippingFee || 0;
    const total = order.total || 0;

    const mailOptions = {
      from: "Bee-Store <beestore1802@gmail.com>",
      to: userEmail,
      subject: "BeeStore - Xác nhận đơn hàng #" + order._id,
      html: `
        <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
            <p style="font-size: 18px; text-align: center; font-weight: bold;">Xác nhận đơn hàng</p>

            <p style="font-size: 16px; color: #333;">Chào ${receiverInfo.name},</p>
            <p style="color: #333;">Cảm ơn bạn đã đặt hàng tại BeeStore. Đơn hàng của bạn đã được xác nhận thành công!.
             Bạn sẽ nhận được hàng trong 1 đến 2 ngày. Bạn có thể theo đơn hàng của mình tại Lịch sử đơn hàng trong tài khoản của mình </p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${order._id}</p>
              <p style="margin: 5px 0;"><strong>Ngày đặt hàng:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Phương thức thanh toán:</strong> ${order.payment?.name || 'Chưa có thông tin'}</p>
              <p style="margin: 5px 0;"><strong>Trạng thái thanh toán:</strong> ${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>

            <h3 style="color: #333;">Thông tin người nhận</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>Họ tên:</strong> ${receiverInfo.name}</p>
              <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${receiverInfo.address}</p>
              <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${receiverInfo.phone}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
            </div>

            <h3 style="color: #333;">Chi tiết đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                  <th style="padding: 10px; text-align: left;">Màu sắc</th>
                  <th style="padding: 10px; text-align: left;">Kích thước</th>
                  <th style="padding: 10px; text-align: left;">Số lượng</th>
                  <th style="padding: 10px; text-align: left;">Đơn giá</th>
                  <th style="padding: 10px; text-align: left;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems}
              </tbody>
              <tfoot>
                ${discountInfo}
                <tr>
                  <td colspan="5" style="text-align: right; padding: 10px;"><strong>Phí vận chuyển:</strong></td>
                  <td style="padding: 10px;">${shippingFee.toLocaleString('vi-VN')}đ</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                  <td colspan="5" style="text-align: right; padding: 10px;"><strong>Tổng thanh toán:</strong></td>
                  <td style="padding: 10px; font-weight: bold;">${total.toLocaleString('vi-VN')}đ</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666;">Đơn hàng của bạn sẽ được xử lý và giao đến trong thời gian sớm nhất.</p>
              <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:beestore1802@gmail.com">beestore1802@gmail.com</a></p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px;">© 2025 BeeStore. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email xác nhận đơn hàng đã được gửi đến:", userEmail);

  } catch (error) {
    console.error("Lỗi khi gửi email xác nhận đơn hàng:", error);
  }
}

/**
 * Gửi email đăng ký tài khoản
 * @param {Object} user - Thông tin người dùng đăng ký
 * @param {string} host - Host của server
 */
export async function sendSignupVerificationEmail(user, host) {
  try {
    const mailOptions = {
      from: "Bee-Store <beestore1802@gmail.com>",
      to: user.email,
      subject: "BeeStore - Xác nhận tài khoản khách hàng",
      html: `
        <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
            <p style="font-size: 16px; color: #333;">Chào mừng bạn đến với BeeStore!</p>
            <p style="color: #333;">Để kích hoạt tài khoản của bạn, vui lòng nhấn vào nút bên dưới:</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://${host}/api/verify-email?token=${user._id}" 
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
    console.log("Email xác nhận đăng ký đã được gửi đến:", user.email);
    return true;
  } catch (error) {
    console.error("Lỗi khi gửi email xác nhận đăng ký:", error);
    return false;
  }
}

/**
 * Gửi email thông báo đơn hàng đang được giao
 * @param {Object} order - Thông tin đơn hàng đã được populate
 */
export async function sendOrderShippingEmail(order) {
  try {
    // Lấy thông tin người nhận và email
    const receiverInfo = order.receiverInfo;
    let userEmail = receiverInfo.email;

    // Nếu đơn hàng có user ID, lấy email từ tài khoản user
    if (order.user) {
      const user = await User.findById(order.user);
      if (user && user.email) {
        userEmail = user.email;
      }
    }

    if (!userEmail) {
      console.error("Không tìm thấy email để gửi thông báo đơn hàng đang giao");
      return;
    }

    const mailOptions = {
      from: "Bee-Store <beestore1802@gmail.com>",
      to: userEmail,
      subject: "BeeStore - Đơn hàng đang được giao #" + order._id,
      html: `
        <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
            <p style="font-size: 18px; text-align: center; font-weight: bold;">Đơn hàng đang được giao</p>

            <p style="font-size: 16px; color: #333;">Chào ${receiverInfo.name},</p>
            <p style="color: #333;">Đơn hàng #${order._id} của bạn hiện đang được giao</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${receiverInfo.address}</p>
              <p style="margin: 5px 0;"><strong>Số điện thoại liên hệ:</strong> ${receiverInfo.phone}</p>
              <p style="margin: 5px 0;"><strong>Dự kiến giao hàng:</strong> Trong vòng 24-48 giờ</p>
            </div>

            <p style="color: #333;">Đơn vị vận chuyển sẽ liên hệ với bạn trước khi giao hàng. Vui lòng đảm bảo số điện thoại của bạn luôn trong trạng thái liên lạc được.</p>
            
            <p style="color: #333;">Bạn có thể theo dõi trạng thái đơn hàng trong mục "Lịch sử đơn hàng" trên tài khoản của mình.</p>

            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:beestore1802@gmail.com">beestore1802@gmail.com</a></p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px;">© 2025 BeeStore. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email thông báo đơn hàng đang giao đã được gửi đến:", userEmail);

  } catch (error) {
    console.error("Lỗi khi gửi email thông báo đơn hàng đang giao:", error);
  }
}

/**
 * Gửi email thông báo đơn hàng đã bị hủy
 * @param {Object} order - Thông tin đơn hàng đã được populate
 */
export async function sendOrderCancelledEmail(order) {
  try {
    // Lấy thông tin người nhận và email
    const receiverInfo = order.receiverInfo;
    let userEmail = receiverInfo.email;

    // Nếu đơn hàng có user ID, lấy email từ tài khoản user
    if (order.user) {
      const user = await User.findById(order.user);
      if (user && user.email) {
        userEmail = user.email;
      }
    }

    if (!userEmail) {
      console.error("Không tìm thấy email để gửi thông báo đơn hàng bị hủy");
      return;
    }

    const mailOptions = {
      from: "Bee-Store <beestore1802@gmail.com>",
      to: userEmail,
      subject: "BeeStore - Đơn hàng đã bị hủy #" + order._id,
      html: `
        <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
            <p style="font-size: 18px; text-align: center; font-weight: bold;">Đơn hàng đã bị hủy</p>

            <p style="font-size: 16px; color: #333;">Chào ${receiverInfo.name},</p>
            <p style="color: #333;">Chúng tôi xin thông báo rằng đơn hàng #${order._id} của bạn đã bị hủy.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${order._id}</p>
              <p style="margin: 5px 0;"><strong>Ngày đặt hàng:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Ngày hủy:</strong> ${new Date().toLocaleString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Lý do:</strong> ${order.cancelReason || 'Không có thông tin'}</p>
            </div>

            <p style="color: #333;">Nếu đơn hàng của bạn đã được thanh toán, số tiền sẽ được hoàn lại vào phương thức thanh toán ban đầu trong vòng 5-7 ngày làm việc.</p>
            
            <p style="color: #333;">Chúng tôi rất tiếc vì sự bất tiện này và mong được phục vụ bạn trong những đơn hàng tiếp theo.</p>

            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:beestore1802@gmail.com">beestore1802@gmail.com</a></p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px;">© 2025 BeeStore. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email thông báo đơn hàng bị hủy đã được gửi đến:", userEmail);

  } catch (error) {
    console.error("Lỗi khi gửi email thông báo đơn hàng bị hủy:", error);
  }
}

/**
 * Gửi email thông báo đơn hàng giao thành công
 * @param {Object} order - Thông tin đơn hàng đã được populate
 */
export async function sendOrderCompletedEmail(order) {
  try {
    // Lấy thông tin người nhận và email
    const receiverInfo = order.receiverInfo;
    let userEmail = receiverInfo.email;

    // Nếu đơn hàng có user ID, lấy email từ tài khoản user
    if (order.user) {
      const user = await User.findById(order.user);
      if (user && user.email) {
        userEmail = user.email;
      }
    }

    if (!userEmail) {
      console.error("Không tìm thấy email để gửi thông báo đơn hàng giao thành công");
      return;
    }

    const mailOptions = {
      from: "Bee-Store <beestore1802@gmail.com>",
      to: userEmail,
      subject: "BeeStore - Đơn hàng giao thành công #" + order._id,
      html: `
        <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
            <p style="font-size: 18px; text-align: center; font-weight: bold;">Đơn hàng giao thành công</p>

            <p style="font-size: 16px; color: #333;">Chào ${receiverInfo.name},</p>
            <p style="color: #333;">Chúc mừng! Đơn hàng #${order._id} của bạn đã được giao thành công vào lúc ${new Date(order.completedAt || new Date()).toLocaleString('vi-VN')}.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${order._id}</p>
              <p style="margin: 5px 0;"><strong>Ngày đặt hàng:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Ngày giao hàng:</strong> ${new Date(order.completedAt || new Date()).toLocaleString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Trạng thái thanh toán:</strong> ${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>

            <p style="color: #333;">Cảm ơn bạn đã mua sắm tại BeeStore. Chúng tôi rất mong nhận được phản hồi của bạn về sản phẩm và trải nghiệm mua sắm.</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="http://localhost:5173/danh-gia" 
                style="padding: 10px 20px; background-color: yellow; color: black; 
                border: none; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block;">
                Đánh giá sản phẩm
              </a>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:beestore1802@gmail.com">beestore1802@gmail.com</a></p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px;">© 2025 BeeStore. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email thông báo đơn hàng giao thành công đã được gửi đến:", userEmail);

  } catch (error) {
    console.error("Lỗi khi gửi email thông báo đơn hàng giao thành công:", error);
  }
}

/**
 * Gửi email thông báo đơn hàng giao thất bại
 * @param {Object} order - Thông tin đơn hàng đã được populate
 */
export async function sendOrderDeliveryFailedEmail(order) {
  try {
    // Lấy thông tin người nhận và email
    const receiverInfo = order.receiverInfo;
    let userEmail = receiverInfo.email;

    // Nếu đơn hàng có user ID, lấy email từ tài khoản user
    if (order.user) {
      const user = await User.findById(order.user);
      if (user && user.email) {
        userEmail = user.email;
      }
    }

    if (!userEmail) {
      console.error("Không tìm thấy email để gửi thông báo đơn hàng giao thất bại");
      return;
    }

    const mailOptions = {
      from: "Bee-Store <beestore1802@gmail.com>",
      to: userEmail,
      subject: "BeeStore - Đơn hàng giao thất bại #" + order._id,
      html: `
        <div style="font-family:'Segoe UI'; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 700px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: rgb(245, 245, 14); text-align: center;">BEESTORE</h2>
            <p style="font-size: 18px; text-align: center; font-weight: bold;">Giao hàng thất bại</p>

            <p style="font-size: 16px; color: #333;">Chào ${receiverInfo.name},</p>
            <p style="color: #333;">Chúng tôi rất tiếc phải thông báo rằng việc giao hàng cho đơn hàng #${order._id} của bạn không thành công.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${order._id}</p>
              <p style="margin: 5px 0;"><strong>Ngày đặt hàng:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              <p style="margin: 5px 0;"><strong>Lý do giao thất bại:</strong> ${order.failureReason || 'Không có người nhận hàng'}</p>
            </div>

            <p style="color: #333;">Chúng tôi sẽ liên hệ lại với bạn qua số điện thoại ${receiverInfo.phone} để sắp xếp lại thời gian giao hàng hoặc thay đổi địa chỉ nếu cần thiết.</p>
            
            <p style="color: #333;">Vui lòng đảm bảo thông tin liên hệ của bạn đúng và số điện thoại luôn trong trạng thái liên lạc được.</p>

            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:beestore1802@gmail.com">beestore1802@gmail.com</a></p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px;">© 2025 BeeStore. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email thông báo đơn hàng giao thất bại đã được gửi đến:", userEmail);

  } catch (error) {
    console.error("Lỗi khi gửi email thông báo đơn hàng giao thất bại:", error);
  }
}

/**
 * Gửi email đặt lại mật khẩu
 * @param {string} email - Email người dùng
 * @returns {Object} - Token đặt lại mật khẩu hoặc null nếu có lỗi
 */
export async function sendPasswordResetEmail(email) {
  try {
    // Tạo token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Lưu token và thời gian hết hạn (5 phút)
    const user = await User.findOne({ email });

    if (!user) {
      return null;
    }

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: "BeeStore <beestore1802@gmail.com>",
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

    await transporter.sendMail(mailOptions);
    console.log("Email đặt lại mật khẩu đã được gửi đến:", email);
    return resetToken;
  } catch (error) {
    console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
    return null;
  }
}

// Đóng kết nối transporter khi ứng dụng dừng
process.on('SIGTERM', () => {
  if (transporter && typeof transporter.close === 'function') {
    transporter.close();
    console.log('Email transporter closed');
  }
});

export default {
  sendOrderConfirmationEmail,
  sendSignupVerificationEmail,
  sendPasswordResetEmail
};