const Joi = require('joi')

const userValidator = Joi.object({
    email: Joi.string()
        .min(6)
        .required()
        .email()
        .messages({
            'string.empty': 'Email is required',
            'string.min': 'Email should have a minimum length of 6',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password should have a minimum length of 6',
            'any.required': 'Password is required'
        })
});

module.exports = userValidator;