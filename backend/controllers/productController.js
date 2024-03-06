const { Product } = require('../models/index');
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
        res.status(500).json({message: 'Server error in createProduct'});
    }
};

exports.updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, description, stock, image_url, category } = req.body;

    try {
        const existingProduct = await Product.findByPk(id);
        if (!existingProduct) {
            return res.status(404).json({error: 'Product not found'});
        }
            await existingProduct.update({
                name,
                price,
                description,
                stock,
                image_url,
                category
            });
            return res.status(200).json(existingProduct);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update the product' });
        }
}


exports.deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id); // Access id from req.params
    //console.log('Product ID to delete:', id);
    try {
        const productToDelete = await Product.findByPk(id);
        if (!productToDelete) {
            return res.status(404).json({message: 'Product not found'});
        }
        await productToDelete.destroy();
        return res.status(200).json({message: 'Product deleted successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error in deleteProduct'});
    }
}

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