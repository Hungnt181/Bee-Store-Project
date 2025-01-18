import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkPermission = async (req, res, next) => {
    try {
        // B1: Nhận token từ phía người dùng
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) { // Nếu không có token
            return res.status(401).json({
                message: 'Không có quyền truy cập'
            });
        }

        // B2: Kiểm tra token có hợp lệ không
        const data = jwt.verify(token, '123456');
        if (!data) { // Nếu không verify được token
            return res.status(401).json({
                message: 'Không có quyền truy cập'
            });
        }

        // B3: Kiểm tra email/id ở trong token có đúng hay không
        const user = await User.findOne({ email: data.email });
        if (!user) { // Nếu không có user
            return res.status(401).json({
                message: 'Không có quyền truy cập'
            });
        }

        // B4: Kiểm tra vai trò của người dùng
        if (user.role !== 'admin') { // Nếu không phải admin
            return res.status(403).json({
                message: 'Chỉ quản trị viên mới được phép thực hiện hành động này'
            });
        }

        // Gán thông tin user vào req để sử dụng ở các bước tiếp theo nếu cần
        req.user = user;
        next(); // Cho phép tiếp tục đến controller
    } catch (error) {
        res.status(401).json({
            message: 'Something went wrong'
        });
    }
};

export { checkPermission };