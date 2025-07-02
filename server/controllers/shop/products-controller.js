const Product = require("../../models/Product");
const product_map = require("./product_map.json");
const getFilteredProducts = async (req, res) => {
  try {
    const { category = [],  sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getSuggestedProducts = async (req, res) => {
  const { state, month, crop } = req.body;

  if (!state || !month || !crop) {
    return res.status(400).json({ error: "State, month, and crop are required" });
  }

  try {
    const titles =
      product_map?.[state]?.[month]?.[crop];

    if (!titles || !Array.isArray(titles)) {
      return res.status(404).json({ error: "No product mapping found" });
    }

    const products = await Product.find({ title: { $in: titles } });

    return res.json({ products });
  } catch (error) {
    console.error("Error fetching suggested products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { getFilteredProducts, getProductDetails,getSuggestedProducts };