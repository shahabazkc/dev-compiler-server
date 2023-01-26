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
            
        })
    })
}