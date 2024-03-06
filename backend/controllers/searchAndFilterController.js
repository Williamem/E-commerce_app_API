const { Product } = require("../models/index");
const { Op } = require('sequelize');

exports.searchProducts = async (req, res) => {
  const query = req.query.query;
  console.log("Query:", query);
  try {
    const products = await Product.findAll({
      where: {
        name: {
          //q: what does Op.iLike do?

          [Op.iLike]: `%${query}%`,
        },
      },
    });
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error med" });
  }
}

//TODO: Fix searchProducts
exports.filterProducts = async (req, res) => {
  console.log("req.params", req.params);
  const category = req.params.category;
  console.log("Category:", category);
  try {
    //q: what does Product,findAll do?
    const products = await Product.findAll({
      where: {
        category: category,
      },
    });
    if (products.length === 0) {
      return res.status(404).json({ message: "Product category not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in filterProducts" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ["category"],
      group: ["category"],
    });
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in getCategories" });
  }
}