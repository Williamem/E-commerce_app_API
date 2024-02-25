const Product = require('../models/Product');
const { productValidator } = require('../validators/validators');

exports.createProduct = async (req, res) => {
    const validationResult = productValidator.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({error: validationResult.error.details[0].message})
    }
    if (!req.body.stock) {
        req.body.stock = 0
    }
    try {
        product = await Product.create({
            ...req.body,
        });

        res.status(201).json(product)
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
}