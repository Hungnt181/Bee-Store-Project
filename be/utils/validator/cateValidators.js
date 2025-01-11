import Joi from "joi";

const cateValidate = Joi.object({
    name: Joi.string().required(),
    status: Joi.boolean().required()
})

export default cateValidate