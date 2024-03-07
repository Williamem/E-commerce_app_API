const { Product } = require('../models/index');
const { productValidator } = require('../validators/validators');

exports.getProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await Product.findByPk(id);
/*         console.log('product:')
        console.dir(product) */
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error in getProduct'});
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error in getProducts'});
    }
};