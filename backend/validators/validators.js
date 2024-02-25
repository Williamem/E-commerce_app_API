const Joi = require('joi');

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

const productValidator = Joi.object({
    name: Joi.string()
    .min(1)
    .required()
    .messages({
        'string.empty': 'Name is reqired',
        'string.min': 'name requires minimum length of 2',
        'any.requires': 'Name is required'
    }),
    price: Joi.number(),
    description: Joi.string(),
    stock: Joi.number(),
    image_url: Joi.string(),
    category: Joi.string()
})

module.exports = {
    userValidator,
    productValidator
};