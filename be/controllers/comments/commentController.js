import Comment from "../../models/comments/comment.js";
import { commentJoi } from "../../utils/validator/comment.js";
import StatusCodes from "http-status-codes";

// Tạo bình luận mới với trạng thái mặc định là hiển thị
export const createComment = async (req, res) => {
  try {
    const { error } = await commentJoi.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details.map((err) => err.message).join(", "),
      });
    }
    const { id_product, id_user, noidung_bl } = req.body;
    const newComment = await Comment.create({
      id_product,
      id_user,
      noidung_bl,
      status: true, // Mặc định hiển thị
      createdAt: new Date(),
    });
    res.status(201).json({
      message: "Gửi bình luận thành công",
      success: true,
      data: newComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Lấy danh sách bình luận
export const list = async (req, res) => {
  try {
    const data = await Comment.find();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Danh sách bình luận", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};
// Lấy chi tiết bình luận
export const detail = async (req, res) => {
  try {
    const data = await Comment.findById(req.params.id).populate(
      "id_product id_user"
    );
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Bình luận không tồn tại" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Chi tiết bình luận", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};
// Xóa bình luận
export const remove = async (req, res) => {
  try {
    const data = await Comment.findByIdAndDelete(req.params.id);
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Bình luận không tồn tại" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa bình luận thành công", data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server: " + error.message });
  }
};

// Toggle trạng thái hiển thị bình luận
export const toggleCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Bình luận không tồn tại." });
    }

    comment.status = !comment.status;
    await comment.save();

    res.json({
      success: true,
      message: "Trạng thái bình luận đã được cập nhật.",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
