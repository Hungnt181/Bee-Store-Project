import Receiver from "../../models/receiverInfor/receiver.js";
import { receiverJoi } from "../../utils/validator/receiverInfor.js";
import StatusCodes from "http-status-codes";

// Thêm người nhận mới
export const add = async (req, res) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    const { error } = receiverJoi.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // Lưu vào database
    const data = await Receiver.create(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Thêm người nhận thành công", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

// Lấy danh sách người nhận
export const list = async (req, res) => {
  try {
    const data = await Receiver.find();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Danh sách người nhận", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};
