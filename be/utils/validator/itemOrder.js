import Joi from "joi";

export const itemOrderValidator = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Tên sản phẩm phải là chuỗi",
    "string.min": "Tên sản phẩm phải có ít nhất 3 ký tự",
    "any.required": "Tên sản phẩm là bắt buộc",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.base": "Số lượng phải là một số",
    "number.min": "Số lượng tối thiểu là 1",
    "any.required": "Số lượng là bắt buộc",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Giá sản phẩm phải là số",
    "number.min": "Giá sản phẩm không được âm",
    "any.required": "Giá sản phẩm là bắt buộc",
  }),
  color: Joi.string().required().messages({
    "string.base": "Màu sắc phải là chuỗi",
    "any.required": "Màu sắc là bắt buộc",
  }),
  nameColor: Joi.string().required().messages({
    "string.base": "Màu sắc phải là chuỗi",
    "any.required": "Màu sắc là bắt buộc",
  }),
  size: Joi.string().required().messages({
    "string.base": "Kích cỡ phải là chuỗi",
    "any.required": "Kích cỡ là bắt buộc",
  }),
  id_variant: Joi.string().required().messages({
    "string.base": "ID biến thể không hợp lệ",
    "any.required": "ID biến thể là bắt buộc",
  }),
});
