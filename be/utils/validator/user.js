import Joi from 'joi';

const signUpUserValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(25),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    tel: Joi.string().pattern(/^[0-9]{8,15}$/).messages({
        'string.pattern.base': 'Số điện thoại không hợp lệ. Số điện thoại phải chứa từ 8 đến 15 chữ số.',
    }),
    address: Joi.string(),
})

const signUpAdminValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(25),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
})

const updateAdminValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(100),
})

const signInValidator = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
})

export { signUpUserValidator, signUpAdminValidator, signInValidator, updateAdminValidator }