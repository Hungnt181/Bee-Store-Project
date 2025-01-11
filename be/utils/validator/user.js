import Joi from 'joi';

const authValidator = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    tel: Joi.string().min(8).max(15).required()
})

export { authValidator }