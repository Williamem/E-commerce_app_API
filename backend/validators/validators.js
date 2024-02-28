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
});

const addressValidator = Joi.object({
    first_name: Joi.string()
    .required()
    .messages({
        'string.empty': 'First name is required'
    }),
    last_name: Joi.string()
    .required()
    .messages({
        'string.empty': 'Last name is required'
    }),
    phone: Joi.string()
    .max(20)
    .messages({
        'string.max': 'That is too long to be a phone number'
    }),
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    address: Joi.string()
});



module.exports = {
    userValidator,
    productValidator,
    addressValidator
};