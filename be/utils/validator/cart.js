import Joi from "joi";

export const cartJoi = Joi.object({
  idVariant: Joi.string().required().messages({
    "string.empty": "Biến thể sản phẩm không được để trống",
    "any.required": "Vui lòng chọn biến thể sản phẩm",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.base": "Số lượng phải là số",
    "number.min": "Số lượng phải ít nhất là 1",
    "any.required": "Vui lòng nhập số lượng",
  }),
  idUser: Joi.string().required().messages({
    "string.empty": "Người dùng không được để trống",
    "any.required": "Thiếu thông tin người dùng",
  }),
});
