import color from "../../models/colors/color.js";
import { colorJoi } from "../../utils/validator/color.js";
import StatusCodes from "http-status-codes";

// Thêm màu mới
export const add = async (req, res) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    const { error } = await colorJoi.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // Kiểm tra xem màu có tồn tại không
    const existingColor = await color.findOne({
      $or: [{ name: req.body.name }, { hexcode: req.body.hexcode }],
    });

    if (existingColor) {
      const errors = [];
      if (existingColor.name === req.body.name) {
        errors.push("Tên màu đã tồn tại!");
      }
      if (existingColor.hexcode === req.body.hexcode) {
        errors.push("Mã màu đã tồn tại!");
      }
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: errors.join(" ") });
    }

    // Thêm màu nếu hợp lệ
    const data = await color.create(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Thêm màu thành công", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

// Lấy danh sách màu
export const list = async (req, res) => {
  try {
    const data = await color.find();
    return res.status(StatusCodes.OK).json({ message: "Danh sách màu", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

// Lấy chi tiết một màu
export const detail = async (req, res) => {
  try {
    const data = await color.findById(req.params.id);
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Màu không tồn tại" });
    }
    return res.status(StatusCodes.OK).json({ message: "Chi tiết màu", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

// Xóa màu
export const remove = async (req, res) => {
  try {
    const data = await color.findByIdAndDelete(req.params.id);
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Màu không tồn tại" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa màu thành công", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

// Cập nhật màu
export const edit = async (req, res) => {
  try {
    const { error } = await colorJoi.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }

    // Kiểm tra xem tên màu hoặc mã màu có trùng không (ngoại trừ ID hiện tại)
    const checkName = await color.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    });
    if (checkName) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tên màu đã tồn tại!" });
    }

    const checkHexcode = await color.findOne({
      hexcode: req.body.hexcode,
      _id: { $ne: req.params.id },
    });
    if (checkHexcode) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Mã màu đã tồn tại!" });
    }

    const data = await color.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Màu không tồn tại" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật màu thành công", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};
