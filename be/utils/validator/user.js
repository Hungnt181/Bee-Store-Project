import Joi from "joi";

const nameField = Joi.string().trim().min(3).required().messages({
  "string.empty": "Họ & Tên không được để trống",
  "string.min": "Họ & Tên phải có ít nhất 3 ký tự",
});

const telField = Joi.string()
  .trim()
  .pattern(/^(0|\+84)(\d{9})$/)
  .required()
  .messages({
    "string.empty": "Số điện thoại không được để trống",
    "string.pattern.base":
      "Số điện thoại không hợp lệ (bắt đầu bằng 0 hoặc +84, gồm 10 số)",
  });

const addressField = Joi.string().trim().min(5).required().messages({
  "string.empty": "Địa chỉ không được để trống",
  "string.min": "Địa chỉ phải có ít nhất 5 ký tự",
});

const passwordField = Joi.string().trim().min(6).max(25).required().messages({
  "string.empty": "Mật khẩu không được để trống",
  "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
});

const signUpUserValidator = Joi.object({
  name: nameField,
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "string.empty": "Email không được để trống",
  }),
  password: passwordField,
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Mật khẩu xác nhận không khớp",
    "string.empty": "Xác nhận mật khẩu không được để trống",
  }),
  tel: telField,
});

const updateUserValidator = Joi.object({
  name: nameField,
  tel: telField,
  address: addressField,
});

const updatePasswordUser = Joi.object({
  password: passwordField,
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Mật khẩu xác nhận không khớp",
    "string.empty": "Xác nhận mật khẩu không được để trống",
  }),
});

const signUpAdminValidator = Joi.object({
  name: nameField,
  email: Joi.string().email().required(),
  password: passwordField,
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const updateAdminValidator = Joi.object({
  name: nameField,
  email: Joi.string().email().required(),
  password: Joi.string().trim().required().min(6).max(100),
});

const signInValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

export {
  signUpUserValidator,
  signUpAdminValidator,
  signInValidator,
  updateAdminValidator,
  updatePasswordUser,
  updateUserValidator,
};
