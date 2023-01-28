import { Joi, celebrate } from 'celebrate';

export default {
    login: celebrate({
        body: Joi.object({
            username: Joi.string().min(2).max(30).required(),
            password: Joi.string().min(4).max(40).required()
        })
    }),
    signup: celebrate({
        body: Joi.object({
            username: Joi.string().min(2).max(30).required(),
            password: Joi.string().min(4).max(40).required(),
            name: Joi.string().min(3).max(22).required(),
            email: Joi.string().email().required(),
            mobile_number: Joi.number().min(6000000000).max(9999999999).required(),
            country_code: Joi.string().min(2).max(6).regex(/^\+?\d+$/).required()
        })
    })
}