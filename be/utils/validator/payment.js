import Joi from "joi";

const paymentJoi = Joi.object({
    name: Joi.string().min(3).required(),
    status: Joi.string().valid("pending", "completed", "failed").required(), 
});
export {paymentJoi};