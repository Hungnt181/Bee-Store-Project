import Joi from "joi";

export const bannerJoi = Joi.object({
  imageUrl: Joi.string().required().messages({
    "string.empty": "Ảnh banner không được để trống",
  }),
  status: Joi.boolean(),
});
