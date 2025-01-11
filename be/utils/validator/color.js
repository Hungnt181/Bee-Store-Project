import Joi from "joi";

const colorJoi = Joi.object({
  name: Joi.string().required(),
  hexcode: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Ma mau phai bat dau bang '#' va co dung 6 ky tu sau do (0-9, A-F).",
    }),
});
export { colorJoi };
