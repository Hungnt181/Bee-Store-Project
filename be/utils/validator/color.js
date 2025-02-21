import Joi from "joi";

export const colorJoi = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Tên màu không được để trống",
    "string.min": "Tên màu phải có ít nhất 2 ký tự",
    "string.max": "Tên màu không được dài quá 50 ký tự",
    "any.required": "Tên màu là bắt buộc",
  }),
  hexcode: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Mã màu không hợp lệ (ví dụ: #FFFFFF).",
      "any.required": "Mã màu là bắt buộc",
    }),
});
