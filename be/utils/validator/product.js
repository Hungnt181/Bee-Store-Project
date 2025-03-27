import Joi from "joi";

const productValidator = Joi.object({
  name: Joi.string().trim().min(3).required(),
  price: Joi.number().required().min(0),
  description: Joi.string().optional(),
  about: Joi.string().required(),
  status: Joi.boolean().default(true),
  id_cate: Joi.string().required().messages({
    "any.required": "Chọn danh mục sản phẩm",
    "string.empty": "Chọn danh mục sản phẩm",
    "string.base": "Chọn danh mục sản phẩm",
  }),
});

export { productValidator };
