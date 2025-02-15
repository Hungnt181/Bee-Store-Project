import Joi from "joi";

const VariantValidator = Joi.object({
  image: Joi.array().items(Joi.string().uri()).required().messages({
    "array.base": "Trường image phải là một mảng",
    "array.includes": "Mỗi phần tử trong mảng image phải là một URL hợp lệ",
    "any.required": "Trường image là bắt buộc",
  }),
  quantity: Joi.number().min(0),
  status: Joi.boolean().default(true),
  id_size: Joi.string().required().messages({
    "any.required": "Chọn kích cỡ sản phẩm",
    "string.empty": "Chọn kích cỡ sản phẩm",
    "string.base": "Chọn kích cỡ sản phẩm",
  }),
  id_color: Joi.string().required().messages({
    "any.required": "Chọn chọn màu sắc sản phẩm",
    "string.empty": "Chọn chọn màu sắc sản phẩm",
    "string.base": "Chọn chọn màu sắc sản phẩm",
  }),
  id_product: Joi.string().required(),
});

export { VariantValidator };
