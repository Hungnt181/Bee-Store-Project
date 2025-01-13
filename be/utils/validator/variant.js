import Joi from "joi";

const VariantValidator = Joi.object({
  image: Joi.string().required(),
  stock: Joi.boolean().default(true),
  status: Joi.boolean().default(true),
  id_size: Joi.string().required(),
  id_color: Joi.string().required(),
  id_product: Joi.string().required(),
});

export { VariantValidator };
