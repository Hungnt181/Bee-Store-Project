import Joi from "joi";

const productValidator = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().required().min(0),
  description: Joi.string().optional(),
  about: Joi.string().required(),
  status: Joi.boolean().default(true),
});

export { productValidator };
