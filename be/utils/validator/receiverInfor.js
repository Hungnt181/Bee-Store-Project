import Joi from "joi";

 const receiverJoi = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên không được để trống",
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được dài quá 100 ký tự",
    "any.required": "Tên là bắt buộc",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Nếu nhập thì phải đúng định dạng
    .allow("") // Cho phép không nhập
    .messages({
      "string.email": "Email không hợp lệ (ví dụ: example@gmail.com)",
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Số điện thoại không được để trống",
      "string.pattern.base": "Số điện thoại phải có từ 10 đến 15 chữ số.",
      "any.required": "Số điện thoại là bắt buộc",
    }),
  address: Joi.string().min(5).max(255).required().messages({
    "string.empty": "Địa chỉ không được để trống",
    "string.min": "Địa chỉ phải có ít nhất 5 ký tự",
    "string.max": "Địa chỉ không được dài quá 255 ký tự",
    "any.required": "Địa chỉ là bắt buộc",
  }),
});

export {receiverJoi};
