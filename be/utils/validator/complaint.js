import Joi from "joi";

export const complaintValidator = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Tên phải là chuỗi",
    "string.min": "Tên phải có ít nhất 3 ký tự",
    "any.required": "Tên là bắt buộc",
  }),

  email: Joi.string().email().required().messages({
    "string.base": "Email phải là chuỗi",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),

  description: Joi.string().required().messages({
    "string.base": "Nội dung khiếu nại phải là chuỗi",
    "any.required": "Nội dung khiếu nại là bắt buộc",
  }),

  status: Joi.string()
    .valid("Chờ xử lý", "Đang xử lý", "Đã giải quyết", "Đã từ chối")
    .optional()
    .messages({
      "string.base": "Trạng thái phải là chuỗi",
      "any.only": "Trạng thái không hợp lệ",
    }),

  id_order: Joi.string().optional().messages({
    "strings.base": "ID đơn hàng không hợp lệ",
  }),

  id_user: Joi.string().optional().messages({
    "strings.base": "ID người dùng không hợp lệ",
  }),
});
