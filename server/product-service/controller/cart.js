const Cart = require("../model/cart");
const Product = require("../model/product");
const { publishEvent } = require("../utility/rabbitmq"); // adjust path
const { Counter } = require("prom-client");

// Extra Prometheus metric
const cartOperationsCounter = new Counter({
  name: "cart_operations_total",
  help: "Total cart operations",
  labelNames: ["operation", "status"],
});

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      cartOperationsCounter.inc({ operation: "add", status: "failed" });
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      cartOperationsCounter.inc({ operation: "add", status: "failed" });
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (index === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[index].quantity += quantity;
    }

    await cart.save();

    // 🔹 Publish RabbitMQ event
    await publishEvent("cart_queue", { type: "CART_ITEM_ADDED", userId, productId, quantity });

    cartOperationsCounter.inc({ operation: "add", status: "success" });
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    cartOperationsCounter.inc({ operation: "add", status: "error" });
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: "User id is mandatory!" });

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found!" });

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populated = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    cartOperationsCounter.inc({ operation: "fetch", status: "success" });
    res.status(200).json({ success: true, data: { ...cart._doc, items: populated } });
  } catch (error) {
    cartOperationsCounter.inc({ operation: "fetch", status: "error" });
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity <= 0) {
      cartOperationsCounter.inc({ operation: "update", status: "failed" });
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found!" });

    const index = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (index === -1) return res.status(404).json({ success: false, message: "Cart item not found!" });

    cart.items[index].quantity = quantity;
    await cart.save();

    await cart.populate({ path: "items.productId", select: "image title price salePrice" });

    // 🔹 Publish RabbitMQ event
    await publishEvent("cart_queue", { type: "CART_ITEM_UPDATED", userId, productId, quantity });

    cartOperationsCounter.inc({ operation: "update", status: "success" });

    const populated = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId?.image || null,
      title: item.productId?.title || "Product not found",
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populated } });
  } catch (error) {
    cartOperationsCounter.inc({ operation: "update", status: "error" });
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) return res.status(400).json({ success: false, message: "Invalid data!" });

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found!" });

    cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);
    await cart.save();

    await cart.populate({ path: "items.productId", select: "image title price salePrice" });

    // 🔹 Publish RabbitMQ event
    await publishEvent("cart_queue", { type: "CART_ITEM_DELETED", userId, productId });

    cartOperationsCounter.inc({ operation: "delete", status: "success" });

    const populated = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId?.image || null,
      title: item.productId?.title || "Product not found",
      price: item.productId?.price || null,
      salePrice: item.productId?.salePrice || null,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart._doc, items: populated } });
  } catch (error) {
    cartOperationsCounter.inc({ operation: "delete", status: "error" });
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addToCart, updateCartItemQty, deleteCartItem, fetchCartItems };
